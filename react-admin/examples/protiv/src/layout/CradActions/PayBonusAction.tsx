import { Avatar, IconButton, Menu, Tooltip, ListItemIcon } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import React from 'react';
import {
    CRUD_UPDATE,
    ResourceContextProvider,
    useGetIdentity,
    useMutation,
    useNotify,
    useRedirect,
    useRefresh,
    useResourceContext,
} from 'react-admin';
import { useQueryClient } from 'react-query';
import { updateCache } from '../../hooks/updateCache';
import { useGetBackend } from '../../resources/company/company';
import { WeeklyDialogForm } from '../../resources/propays';
import { WeeklyAddTimeForm } from '../../resources/payrolls/weeklyEntries';
import { useIdentityContext, usePermissionsOptimized } from '../../components/identity';
import { canAccess } from '../../ra-rbac';

/*Component from pa bonus action button contains two action mark pay or pending */
const PayBonusAction = (props: any) => {
    const { record, redirectTo, redirectPath, isFromPayrollCard } = props;
    const { status } = record;
    const notify = useNotify();
    const [mutate] = useMutation();
    const resource = useResourceContext();
    const queryClient = useQueryClient();
    const redirect = useRedirect();
    const diaglogRef: any = React.useRef();
    const { identity } = useGetIdentity();
    const identities = useIdentityContext();
    const openOTDialog = () => {
        diaglogRef.current.open();
    };

    const refresh = useRefresh();
    const isbackendConnected = useGetBackend();
    const handleClick = (e: any) => {
        e.stopPropagation();
        if(identities.user_type ==='worker') 
        {
            return;
        }
        if (status === 'paid') {
            handleCloseAction();
            return mutate(
                {
                    type: 'update',
                    resource,
                    payload: { id: record.id, action: 'reOpenOne', data: {} },
                },
                {
                    mutationMode: 'pessimistic',
                    action: CRUD_UPDATE,
                    onSuccess: (data: any, variables: any = {}) => {
                        updateCache({
                            queryClient,
                            resource,
                            id: data.data.id,
                            data: data.data,
                        });
                        const updatedData = {
                            ...data.data,
                            status: 'pending',
                            paid_period_id: false,
                        };
                        updateCache({
                            queryClient,
                            resource,
                            id: data.data.id,
                            data: updatedData,
                        });
                        if (isFromPayrollCard) {
                            queryClient.invalidateQueries([
                                'payrolls',
                                'getList',
                            ]);
                        } else {
                            queryClient.invalidateQueries([
                                'attendances',
                                'getList',
                            ]);
                        }
                        refresh();
                    },
                    onFailure: error => {
                        notify(`Failure ! ${error.message}`);
                    },
                }
            );
        } else {
            handleCloseAction();
            if (
                !isbackendConnected &&
                !record.payroll_total_worked_hours &&
                identity?.company?.has_overtime_config
            ) {
                openOTDialog();
            } else {
                redirect(
                    redirectPath,
                    '',
                    null,
                    {},
                    { selectedIds: [record.id], redirectTo, isFromPayrollCard }
                );
            }
        }
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClickAction = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseAction = () => {
        setAnchorEl(null);
    };

    const { permissions } = usePermissionsOptimized();
    const canPerformAction = canAccess({
        permissions,
        resource: 'propays',
        action: 'edit',
    });

    return (
        <>
            <div className="card-dropdown">
                <Tooltip title="">
                    <IconButton
                        onClick={handleClickAction}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'card-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar>
                            <svg
                                width="4"
                                height="18"
                                viewBox="0 0 4 18"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                                    fill="#BDBDBD"
                                    fill-rule="evenodd"
                                />
                            </svg>
                        </Avatar>
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    id="card-menu"
                    open={open}
                    onClose={handleCloseAction}
                    onClick={handleCloseAction}
                    PaperProps={{
                        elevation: 0,
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {status === 'pending' ? 
                   <MenuItem className='mark-paid-item' onClick={handleClick} disabled={!canPerformAction}>
                    <ListItemIcon>
                    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">    
    <g id="Final" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="paid_black_24dp-(1)">
            <rect id="Rectangle" x="0" y="0" width="24" height="24"></rect>
            <path d="M10,3.75 C10.9688506,3.75 11.905663,3.88801094 12.7918372,4.14543288 C12.7639918,4.38524349 12.75,4.62848777 12.75,4.875 C12.75,8.39581528 15.6041847,11.25 19.125,11.25 C19.3112232,11.25 19.4955815,11.2420152 19.6777512,11.2263693 C19.8881981,12.0319215 20,12.8779838 20,13.75 C20,19.27 15.52,23.75 10,23.75 C4.48,23.75 0,19.27 0,13.75 C0,8.23 4.48,3.75 10,3.75 Z M10.88,6.75 L9.13,6.75 L9.13,8.01 C6.67818182,8.53606061 6.52076217,10.5976033 6.51068676,10.9284528 L6.51,10.97 C6.51,13.25 8.76,13.89 9.86,14.28 C11.44,14.85 12.14,15.35 12.14,16.31 C12.14,17.44 11.09,17.92 10.16,17.92 C8.34,17.92 7.82,16.05 7.76,15.83 L6.11,16.5 C6.74,18.69 8.39,19.28 9.13,19.46 L9.13,20.75 L10.88,20.75 L10.88,19.51 C10.89625,19.5071875 10.9144336,19.5039746 10.9344141,19.5003088 L11.0747656,19.4724597 C11.8467773,19.3075293 13.9,18.6734375 13.9,16.29 C13.9,14.89 13.29,13.67 10.89,12.84 C9.11,12.25 8.25,11.89 8.25,10.94 C8.25,9.92 9.36,9.55 10.06,9.55 C11.37,9.55 11.85,10.54 11.96,10.89 L13.54,10.22 C13.39,9.78 12.72,8.31 10.88,7.99 L10.88,6.75 Z" id="Combined-Shape" fill="#9b9b9b" fill-rule="nonzero"></path>
            <polygon id="Path" fill="#9b9b9b" fill-rule="nonzero" points="18.18 6.4875 16.0575 4.365 15 5.4225 18.18 8.61 23.4825 3.3075 22.425 2.25"></polygon>
        </g>
    </g>
</svg>
                    </ListItemIcon>
                     Mark as Paid
                    </MenuItem>
                    :
                    <MenuItem className='mark-pending-item' onClick={handleClick} disabled={!canPerformAction}>
                    <ListItemIcon>
<svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">    
    <g id="Other-Options-(Home-&amp;-Propay)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="1.1-Dashbard-Op_01" transform="translate(-802.000000, -1353.000000)">
            <g id="Active-ProPay-Copy-2" transform="translate(336.000000, 1259.000000)">
                <g id="Form-Copy-2" transform="translate(20.000000, 72.000000)">
                    <g id="paid_black_24dp-(1)" transform="translate(446.000000, 22.000000)">
                        <rect id="Rectangle" x="0" y="0" width="32" height="32"></rect>
                        <path d="M16,2.66666667 C8.64,2.66666667 2.66666667,8.64 2.66666667,16 C2.66666667,23.36 8.64,29.3333333 16,29.3333333 C23.36,29.3333333 29.3333333,23.36 29.3333333,16 C29.3333333,8.64 23.36,2.66666667 16,2.66666667 Z M17.1733333,23.68 L17.1733333,25.3333333 L14.84,25.3333333 L14.84,23.6133333 C13.8533333,23.3733333 11.6533333,22.5866667 10.8133333,19.6666667 L13.0133333,18.7733333 C13.0933333,19.0666667 13.7866667,21.56 16.2133333,21.56 C17.4533333,21.56 18.8533333,20.92 18.8533333,19.4133333 C18.8533333,18.1333333 17.92,17.4666667 15.8133333,16.7066667 C14.3466667,16.1866667 11.3466667,15.3333333 11.3466667,12.2933333 C11.3466667,12.16 11.36,9.09333333 14.84,8.34666667 L14.84,6.66666667 L17.1733333,6.66666667 L17.1733333,8.32 C19.6266667,8.74666667 20.52,10.7066667 20.72,11.2933333 L18.6133333,12.1866667 C18.4666667,11.72 17.8266667,10.4 16.08,10.4 C15.1466667,10.4 13.6666667,10.8933333 13.6666667,12.2533333 C13.6666667,13.52 14.8133333,14 17.1866667,14.7866667 C20.3866667,15.8933333 21.2,17.52 21.2,19.3866667 C21.2,22.8933333 17.8666667,23.56 17.1733333,23.68 Z" id="Shape" fill="#9b9b9b" fill-rule="nonzero"></path>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>
                    </ListItemIcon>
                    Mark as Pending
                    </MenuItem>
                    }
                </Menu>
            </div>

            <WeeklyDialogForm title="Set Overtime" ref={diaglogRef}>
                <ResourceContextProvider value="propays">
                    <WeeklyAddTimeForm
                        hideBackButton={true}
                        payrollIds={[record.payroll_id]}
                        hasOvertimeInput={true}
                        redirect={redirectTo}
                        selectedIds={[record.id]}
                        isFromPayrollCard={isFromPayrollCard}
                        onClose={() => {
                            diaglogRef.current && diaglogRef.current.close();
                        }}
                    />
                </ResourceContextProvider>
            </WeeklyDialogForm>
        </>
    );
};

export default PayBonusAction;
