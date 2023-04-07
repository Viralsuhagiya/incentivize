
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ProPayPaidAlert } from '../../resources/propays';
import { usePageAlertsContext } from '../../components/page-alerts/usePageAlerts'; 
import { CRUD_UPDATE, useMutation, useNotify, useResourceContext } from 'react-admin';
import { useGetBackend } from '../../resources/company/company'; 
import _ from 'lodash';
import { useQueryClient } from 'react-query';
import { updateCache } from '../../hooks/updateCache';
import ConfirmTakeOvertimeInput from '../../resources/propays/ConfirmTakeOvertimeInput';
import { useIdentityContext, usePermissionsOptimized } from '../../components/identity';
import { canAccess } from '../../ra-rbac';


const ApprovePropayAction = (props) => {
    const {record, refresh} = props;

    const { showAlert } = usePageAlertsContext();
    const [mutate] = useMutation();
    const notify = useNotify();
    const resource =  useResourceContext();
    const queryClient = useQueryClient();
    const identity = useIdentityContext();
    const isbackendConnected = useGetBackend();

    const handleApprovePropay = (propayRecord) => {
        const status = propayRecord.status;
        return mutate(
          {
              type: 'update',
              resource: 'propays',
              payload: {id: propayRecord.id, action:(status==='pending'?'approvePropay':'markPendingPropay'), data: {  } }
          },
          {
              mutationMode: 'pessimistic',
              action: CRUD_UPDATE,
              onSuccess: (
                  data: any,
                  variables: any = {}
              ) => {
                  data = data.data;
                  if (propayRecord.status === 'pending' && data.status === 'paid') {
                      showAlert({
                          key: 'propay-paid-alert',
                          body: <ProPayPaidAlert name={propayRecord.name} />
                      });
                  };
                  if (identity?.company?.has_overtime_config && !isbackendConnected && propayRecord.status === 'pending' && data.status === 'approved' && data.show_next_ot_input) {
                      const attendanceHavingNoOvertime = propayRecord.attendance_only_ids.filter(function (value, index, arr) {
                          return value.status !== 'paid' && !value.payroll_total_worked_hours;
                      });
                      const Payrolls = _.uniq(_.map(attendanceHavingNoOvertime,'payroll_id'));
                      if (_.size(Payrolls)){
                          showAlert({
                              key: 'propay-overtine-alert',
                              severity: 'info',
                              render: (props) => <ConfirmTakeOvertimeInput {...props} byDropdown={true} />,
                              data: { propayRecord },
                              keep:true
                          });
                      };
                  };   
                  refresh && refresh(); 
                  queryClient.invalidateQueries(['propays', 'getList']);
                  updateCache({queryClient, resource, id:data.id, data});
              },
              onFailure: error => {
                  notify(`Failure ! ${error.message}`);
              }
          }
          );
    };

    const { permissions } = usePermissionsOptimized();
    const canDoAction =  canAccess({
        permissions,
        resource: 'propays',
        action: 'edit',
    });
    return(
        <>
            <MenuItem onClick={() => handleApprovePropay(record)} disabled={!canDoAction}>
              <ListItemIcon>
              <svg width='22' height='22' viewBox='0 0 22 22'>
                <path d='M11 1.833C5.94 1.833 1.833 5.94 1.833 11S5.94 20.167 11 20.167 20.167 16.06 20.167 11 16.06 1.833 11 
                1.833zm-1.833 13.75L4.583 11l1.293-1.293 3.29 3.282 6.958-6.957 1.293 1.301-8.25 8.25z'></path>
            </svg>
              </ListItemIcon>
              {record.status === 'approved' || record.status === 'closed' || record.status === 'cancelled' || record.status === 'paid' ? 'Pending ProPay' : 'Approve ProPay'}
            </MenuItem>
        </>
    );
};

export default ApprovePropayAction;
