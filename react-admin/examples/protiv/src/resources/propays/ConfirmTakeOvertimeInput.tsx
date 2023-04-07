import { LoadingButton } from '@mui/lab';
import {
    Typography
} from '@mui/material';
import _ from 'lodash';
import React, { useCallback } from 'react';
import {
    ResourceContextProvider
} from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { WeeklyAddTimeForm } from '../payrolls/weeklyEntries';
import { WeeklyDialogForm } from './PropayTab';




    const ConfirmTakeOvertimeInput = ({record,onClose, byDropdown}) => {        
        const employeeNames = byDropdown ? _.join(_.map(record?.data?.propayRecord?.selected_employee_ids_obj,'name')) : 
        _.join(_.map(record?.data?.record?.selected_employee_ids_obj,'name'));
        const diaglogRef: any = React.useRef();
        const openOTDialog = () => {
            diaglogRef.current.open();
        };
        const handleYes = () =>  {
            openOTDialog();
        };
        const handleClickNo = useCallback(()=>{
            onClose();
        },[onClose]);
        return (<>
        <Typography variant="body2">
            Any overtime for&nbsp;({employeeNames})&nbsp;
            {/* <Typography variant="subtitle1" component="span">                
            </Typography> */}
            for any of these dates?
        </Typography>
        {_.map(byDropdown ? record?.data?.propayRecord?.week_selection_ids_obj : record?.data?.record?.week_selection_ids_obj, (item) => {
            return (<Typography>{item.name.slice(NUMBER.FOUR, item.name.length)}</Typography>);
        })}
        <Typography>
        <LoadingButton className='info-msg-btn info-danger-red' onClick={handleClickNo}><strong>No</strong></LoadingButton>
        <LoadingButton className='info-msg-btn info-success-green' onClick={handleYes}><strong>Yes</strong></LoadingButton>        
        </Typography>
        <WeeklyDialogForm title="Set Overtime"  ref={diaglogRef} onCloseAlert={() => {
            onClose();
        }}>
            <ResourceContextProvider value="propays">
                <WeeklyAddTimeForm hideBackButton={true} propay_id={byDropdown ? record?.data?.propayRecord : record?.data?.record} isFromPropay={true} 
                hasOvertimeInput={true} onClose={() => { 
                    diaglogRef.current && diaglogRef.current.close();
                }} />
            </ResourceContextProvider>
        </WeeklyDialogForm>
        </>
        );
    };

export default ConfirmTakeOvertimeInput;
