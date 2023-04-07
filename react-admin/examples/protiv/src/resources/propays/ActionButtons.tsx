

import _ from 'lodash';
import React from 'react';
import {
    CRUD_UPDATE, useMutation, useNotify, useResourceContext, useTranslate
} from 'react-admin';
import { useQueryClient } from 'react-query';
import { useIdentityContext, usePermissionsOptimized } from '../../components/identity';
import { usePageAlertsContext } from '../../components/page-alerts/usePageAlerts';
import { updateCache } from '../../hooks/updateCache';
import { canAccess } from '../../ra-rbac';
import { useGetBackend } from '../company/company';
import ConfirmTakeOvertimeInput from './ConfirmTakeOvertimeInput';
import { ProPayPaidAlert, StatusButtonGroup } from './PropayTab';






export const ActionButtons = (record: any) => {
    const { permissions } = usePermissionsOptimized();
    const status = record.status;
    const {showAlert} = usePageAlertsContext();
    const [mutate, { loading }] = useMutation();
    const notify = useNotify();
    const resource =  useResourceContext();
    const queryClient = useQueryClient();
    const identity = useIdentityContext();
    const isbackendConnected = useGetBackend();
    const translate = useTranslate();


    const canDoAction =  canAccess({
        permissions,
        resource: 'propays',
        action: 'edit',
    });

    const handleClick = (e:any) => {
        
        e.stopPropagation();
        if(!canDoAction){
            return;    
        }
        return mutate(
        {
            type: 'update',
            resource: 'propays',
            payload: {id: record.id, action:(status==='pending'?'approvePropay':'markPendingPropay'), data: {  } }
        },
        {
            mutationMode: 'pessimistic',
            action: CRUD_UPDATE,
            onSuccess: (
                data: any,
                variables: any = {}
            ) => {
                data = data.data;
                if (record.status === 'pending' && data.status === 'paid') {
                    showAlert({
                        key: 'propay-paid-alert',
                        body: <ProPayPaidAlert name={record.name} />
                    });
                }
                if (identity?.company?.has_overtime_config && !isbackendConnected && record.status === 'pending' && data.status === 'approved' && data.show_next_ot_input) {
                    const attendanceHavingNoOvertime = record.attendance_only_ids.filter(function (value, index, arr) {
                        return value.status !== 'paid' && !value.payroll_total_worked_hours;
                    });
                    const Payrolls = _.uniq(_.map(attendanceHavingNoOvertime,'payroll_id'));
                    if (_.size(Payrolls)){
                        showAlert({
                            key: 'propay-overtine-alert',
                            severity: 'info',
                            render: (props) => <ConfirmTakeOvertimeInput {...props} />,
                            data: { record },
                            keep:true
                        });
                    };
                };      
                queryClient.invalidateQueries(['propays', 'getList']);
                updateCache({queryClient, resource, id:data.id, data});
            },
            onFailure: error => {
                notify(`Failure ! ${error.message}`);
            }
        }
        );
    }; 

    return (
        <>
        
        {status === 'paid' &&
            <StatusButtonGroup
                onClick={handleClick}
                variant='contained'
                reverseVariant='outlined'
                loading={false}
                reverseLoading={loading}
                style={{ backgroundColor: '#3ab077', color: 'white' }}
                buttonsTitle={{ button1:translate("resources.propays.propay_buttons.pending"), button2: translate("resources.propays.propay_buttons.closed") }}
                reverseStyle={{}} />}
        {status==='pending'&&
            <StatusButtonGroup 
                onClick={handleClick} 
                variant='outlined'
                reverseVariant = 'contained'
                loading={loading}
                reverseLoading={false}
                style={{}}
                buttonsTitle={{button1: translate("resources.propays.propay_buttons.pending"), button2: translate("resources.propays.propay_buttons.approved")}}
                reverseStyle={{backgroundColor: '#ffb245', color: 'white' }}/>
        }
        {status==='approved'&&
            <StatusButtonGroup 
                onClick={handleClick} 
                variant='contained'
                reverseVariant = 'outlined'
                loading={false}
                reverseLoading={loading}
                style={{backgroundColor: '#4ac0a2', color: 'white'}}
                buttonsTitle={{button1: translate("resources.propays.propay_buttons.pending"), button2: translate("resources.propays.propay_buttons.approved")}}
                reverseStyle={{}}/>
        }
        {status==='cancelled' &&
           <StatusButtonGroup 
                onClick={handleClick} 
                variant='contained'
                reverseVariant = 'outlined'
                loading={false}
                reverseLoading={loading}
                style={{backgroundColor: '#FF4842', color: 'white'}}
                buttonsTitle={{button1: translate("resources.propays.propay_buttons.pending"), button2: translate("resources.propays.propay_buttons.cancelled")}}
                reverseStyle={{}}/>
        }
        </>
    );
};
