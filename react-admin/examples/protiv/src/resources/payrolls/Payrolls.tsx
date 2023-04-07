import { Icon } from '@iconify/react';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { stringify } from 'query-string';
import React, { useMemo, useState } from 'react';
import { useIdentityContext, usePermissionsOptimized } from '../../components/identity';
import { canAccess, usePermissions } from '../../ra-rbac';

import DownloadIcon from '@mui/icons-material/Download';
import { LoadingButton } from '@mui/lab';
import {
    Box, Card, CircularProgress, DialogContent,
    DialogTitle, Grid, IconButton, ListItemButton,
    Popover, Stack, TableCell, Theme, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery
} from '@mui/material';
import _ from 'lodash';
import moment from 'moment';
import {
    AutocompleteArrayInput, AutocompleteInputProps, CRUD_UPDATE, FormWithRedirect, Record, ReferenceInput, required, ResourceContextProvider, 
    SaveButton, SelectInput, ShowContextProvider, Toolbar as AdminToolbar, useGetIdentity, useGetList, useListContext, useMutation, 
    useNotify, useRedirect, useShowController, useTranslate, useUnselectAll,
    useUpdate
} from 'react-admin';
import { useQueryClient } from 'react-query';
import { Link, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import DialogForm from '../../components/DialogForm';
import { convertNumber, MoneyField, StyledEditableDatagrid } from '../../components/fields';
import { DateField } from '../../components/fields/DateField';
import { AutocompleteInput } from '../../components/fields/inputs';
import MenuPopover from '../../components/MenuPopover';
import { updateCache } from '../../hooks/updateCache';
import { useGetBaseLocationForCurrentRoute } from '../../hooks/useGetBaseLocationForCurrentRoute';
import { StyledDialog } from '../propays/Propay';
import { PropayShow } from '../propays/PropayTab';
import { BonusPayrolls } from './BonusPayrolls';
import { ActionLinkProPayForm, PayrollProPayLinkForm } from './SFPayrolls';
import usePayrollReport from './usePayrollReport';
import { WeeklyAddTimeForm } from './weeklyEntries';
import PayrollListView from './PayrollListView';
import ReferenceArrayInput from '../../components/fields/ReferenceArrayInput';
import { InfoLabel } from '../../components/fields/InfoLabel';
import { NUMBER } from '../../utils/Constants/MagicNumber';

export const StyledAutoReferenceInput = styled(ReferenceInput)({
    width: 'unset',
});
export const StyledSelectInput = styled(SelectInput)({
    'min-width': '150px',
});

const StyledAutocompleteInputLarge = styled(AutocompleteInput)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        'min-width': 'unset',
    },
    [theme.breakpoints.up('sm')]: {
        'min-width': '270px',
    }
}));

export const StyledReferenceArrayInput = styled(ReferenceArrayInput)({
    minWidth: '150px',
});

export const StyledTypography = styled(Typography)({
    fontSize: 12,
    whiteSpace: 'nowrap'
});

export const PeriodField = (props: any) => {
    return (
        <>
            <DateField source='start_date' dateFormat='MMM DD, YYYY'/> ~ <DateField source='end_date' dateFormat='MMM DD, YYYY' />
        </>
    );
};

export const PAYROLL_STATUS = [
    { id: 'open', name: 'resources.payrolls.choices.status.open' },
    { id: 'paid', name: 'resources.payrolls.choices.status.paid' },
];
const CommonFilter = [
    <ReferenceInput
        size='medium'
        source='period_id._eq'
        reference='periods'
        label='Payroll Period'
        alwaysOn
        alwaysOnMobile
        sort={{ field: 'start_date', order: 'DESC' }}
        filter={{ start_date: { _lte: moment().format('YYYY-MM-DD') } }}
    >
        <StyledAutocompleteInputLarge source='name' />
    </ReferenceInput>,
    <StyledReferenceArrayInput
        size='medium'
        source='employee_id._in'
        filter={{active: {_eq: true}}}
        reference='employees'
        label='Worker'
        alwaysOn
    >
        <AutocompleteArrayInput source='name'/>
    </StyledReferenceArrayInput>,
];

export const CommonFilterForManageBonusOnly = [
    <ReferenceInput
        size='medium'
        source='period_id._eq'
        reference='periods'
        label='Payroll Period'
        alwaysOn
        alwaysOnMobile
        sort={{ field: 'start_date', order: 'DESC' }}
        filter={{ start_date: { _lte: moment().format('YYYY-MM-DD') },payroll_ids: {has_managing_bonus: {_eq: true}} }}
    >
        <StyledAutocompleteInputLarge source='name' />
    </ReferenceInput>,
    <StyledReferenceArrayInput
        size='medium'
        filter={{active: {_eq: true}}}
        source='employee_id._in'
        reference='employees'
        label='Worker'
        alwaysOn
    >
        <AutocompleteArrayInput source='name'/>
    </StyledReferenceArrayInput>,
];

export const canChangeAttendance = (record): boolean => {
    return ['pending'].includes(record.status);
}
export const StyledEditableDatagridWithInlineFields = styled(StyledEditableDatagrid)({
    '.MuiFormHelperText-root': {
        'display': 'none',
    },
    '.MuiInput-input':{
        'padding-top': 0,
        'padding-bottom': 0,
    },
    '.RaDatagrid-rowCell':{
        '&.RaDatagrid-rowCell:nth-last-child(2)':{
            paddingRight:0,
            paddingLeft:3
        }
    },
    '.MuiTableCell-body':{
        '&.RaEditableDatagrid-cell':{
            width:20,
            paddingLeft:0,
            paddingRight:10
        }
    },
    '.RaDatagrid-headerCell':{
        '&.RaEditableDatagrid-header':{
            width:20,
        }
    }
});

export const BonusEarningInfo = (props: any) => {
    const { loaded, identity } = useGetIdentity();
    const translate = useTranslate()
    if (!loaded) {
        return null;
    };
    const { attendanceRecord } = props;
    const payrollRecord = props.payrollRecord || props.record; 
    var bonus_hours = convertNumber(attendanceRecord.performance_hours,identity);
    var bonus = parseFloat(attendanceRecord.performance_bonus).toFixed(NUMBER.TWO);
    var lead_pay_text = 'Leadpay: $' + bonus;

    var bonus_rate = parseFloat(attendanceRecord.performance_pay_rate).toFixed(NUMBER.TWO);
    var bonus_info = translate('resources.propays.bonus_info');
    var bonus_info_text = '$' + bonus_rate + ' X ' + bonus_hours + 'hrs=$' + bonus;

    var ot_hours = convertNumber(payrollRecord.ot_hours,identity);
    var bonus_ot_diff_rate = parseFloat(attendanceRecord.bonus_ot_diff_rate).toFixed(NUMBER.TWO);
    var ot_amt = parseFloat(attendanceRecord.bonus_ot_diff_amt).toFixed(NUMBER.TWO);
    var overtime_info_text = '$' + bonus_ot_diff_rate + ' X ' + ot_hours + 'hrs=$' + ot_amt;
    var overtime_info = translate('resources.propays.overtime_info');

    return (
        <>
            <Stack direction='row'>
                <MoneyField record={attendanceRecord} source='bonus_earning' label={translate('resources.attendances.fields.bonus_earning')} 
                textAlign='right' sx={{paddingTop: 1}}/>
                <InfoLabel >
                    {attendanceRecord.bonus_ot_diff_amt ? 
                    <>
                        <StyledTypography>{overtime_info_text}</StyledTypography>
                        <StyledTypography>{overtime_info}</StyledTypography>
                    </>:null}
                    {attendanceRecord.is_lead_pay ? 
                    <StyledTypography>{lead_pay_text}</StyledTypography>
                    :
                    <><StyledTypography>{bonus_info_text}</StyledTypography>
                    <StyledTypography>{bonus_info}</StyledTypography></>}
                </InfoLabel>
            </Stack>
        </>
    );
};

export const StyledCard = styled(Card)({
    width: '80%',
    margin: 'auto',
    padding: 20,
});

export const StyledTableCell = styled(TableCell)({
    padding: 0,
});

export const TsheetsPermission = ({is_connected=true,children,...rest}:any) => {
    const identity = useIdentityContext();
    const is_tsheets_connected = identity?.company?.tsheets_status === 'connected'
    if(is_connected !== is_tsheets_connected) return null;

    return (
        React.Children.map(children, child => {
            // Checking isValidElement is the safe way and avoids a typescript
            // error too.
            if (React.isValidElement(child)) {
                return React.cloneElement(child );
            }
            return child;
        })
    )
};

export const HasPermission = (props:any) => {
    const { permissions } = usePermissionsOptimized();
    const {resource, action } = props;

    if(!canAccess({
        permissions,
        resource: resource,
        action: action,
    })){
        return null;
    }

    return (
        React.Children.map(props.children, child => {
            // Checking isValidElement is the safe way and avoids a typescript
            // error too.
            if (React.isValidElement(child)) {
                return React.cloneElement(child );
            }
            return child;
        })
    )
};

export const PayrollShow = (props: any) => {
    const {component} = props;
    const showContext = useShowController(props);
    return (
        <ShowContextProvider value={showContext}>
            {component}
        </ShowContextProvider>
    )
};

const DownloadBonusOtReport = (props: any) => {
    const {onClose} =props;
    const [mutate, { loading }] = useMutation();
    const downloadBonusReport = (data:any) => {
        mutate(
            {
                type: 'update',
                resource: 'periods',
                payload: {
                    id: data.period_id,
                    action: 'downloadBonusOtReport',
                    data: {},
                },
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (data: any, variables: any = {}) => {
                    console.log('Response is coming ', data, variables);
                    onClose();
                    if (data.data?.period_report_url) {
                        window.open(data.data.period_report_url);
                    }
                },
                onFailure: error => {
                    console.log('There is error ', error.message);
                },
            }
        );
    };
    return (
        <FormWithRedirect
        {...props}
        render={(formProps: any) => {
            return (
                <Grid className='mui-tooltbar-spacing' container spacing={0}>
                    <Grid item lg={12} xs={12}>
                        <StyledAutoReferenceInput
                            source='period_id'
                            validate={[required()]}
                            reference='periods'
                            label='Select which pay period report you want to download?'
                        >
                            <AutocompleteInput validate={[required()]} fullWidth label={false} />
                        </StyledAutoReferenceInput>
                        <StyledWeeklyToolbar
                            sx={{
                                bottom: 0,
                                marginBottom:0,
                                left: 0,
                                right: 0,
                                backgroundColor:'#FFF',
                                flex:1, 
                                marginTop:'unset',
                                justifyContent:'flex-end',
                                paddingLeft: 0,
                                paddingRight: 0,
                                minHeight: 50,
                            }}
                            {...formProps}
                        >
                            <SaveButton label='Export' saving={loading} onSave={downloadBonusReport} icon={<DownloadIcon />} />
                        </StyledWeeklyToolbar>
                    </Grid>
                </Grid>
            );
        }}
    />
    );
};
const PayrollReport = (props: any) => {
    const {onClose} =props;
    const [mutate, { loading }] = useMutation();
    const callAction = (props:any) => {
        const {period_id,action} = props;
         mutate(
            {
                type: 'update',
                resource: 'periods',
                payload: {
                    id: period_id,
                    action: action,
                    data: {},
                },
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (data: any, variables: any = {}) => {
                    console.log('Response is coming ', data, variables);
                    onClose();
                    if (data.data?.period_report_url) {
                        window.open(data.data.period_report_url);
                    }
                },
                onFailure: error => {
                    console.log('There is error ', error.message);
                },
            }
        );
    };
    const callActionExcel = (data:any) => {
        callAction({period_id:data.period_id,action:'downloadPayrollReport'})
    }; 
    const callActionCsv = (data:any) => {
        callAction({period_id:data.period_id,action:'downloadCsvPayrollReport'})
    };
    return (
        <FormWithRedirect
        {...props}
        render={(formProps: any) => {
            return (
                <Grid className='mui-tooltbar-spacing' container spacing={0}>
                    <Grid item lg={12} xs={12}>
                        <StyledAutoReferenceInput
                            source='period_id'
                            validate={[required()]}
                            reference='periods'
                            label='Select which closed period report you want to download?'
                        >
                            <AutocompleteInput validate={[required()]} fullWidth label={false} />
                        </StyledAutoReferenceInput>
                        <StyledWeeklyToolbar
                            sx={{
                                bottom: 0,
                                marginBottom:0,
                                left: 0,
                                right: 0,
                                backgroundColor:'#FFF',
                                flex:1, 
                                marginTop:'unset',
                                justifyContent:'flex-end',
                                paddingLeft: 0,
                                paddingRight: 0,
                                minHeight: 50,
                            }}
                            
                            {...formProps}
                        >
                            <SaveButton label='Excel' sx={{marginRight:1}} saving={loading} onSave={callActionExcel} icon={<DownloadIcon />} />
                            <SaveButton label='CSV' saving={loading} onSave={callActionCsv} icon={<DownloadIcon />} />
                        </StyledWeeklyToolbar>
                    </Grid>
                </Grid>
            );
        }}
    />
    );
};

export const DownloadPayrollReport = ({ period }: any) => {
    const [anchorRef, setAnchorRef] = useState(null);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleClick = (event) => {
        setAnchorRef(event.currentTarget);
        setOpen(true);
    };
    const { loading:excelLoading, callAction:callActionExcel } = usePayrollReport({
        action:'downloadPayrollReport', 
        id: period.id,
    })
    const { loading:csvLoading, callAction:callActionCsv } = usePayrollReport({
        action:'downloadCsvPayrollReport', 
        id: period.id,
    })
    const { loading:bonusExcelLoading, callAction:callActionBonusExcel} = usePayrollReport({
        action:'downloadBonusExcelayrollReport', 
        id: period.id,
    });
    const loading = excelLoading || csvLoading || bonusExcelLoading;

    return (
        <>
            <LoadingButton
                variant='contained'
                type='submit'
                color='primary'
                disabled={loading}
                onClick={handleClick}
                sx={{
                    marginRight: 1,
                }}
            >
                {loading && (
                    <CircularProgress size={25} thickness={2} />
                )}
                Report
            </LoadingButton>
            <MenuPopover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box>
                    <ListItemButton onClick={()=>{
                        handleClose()
                        callActionExcel()
                    }}>
                        Payroll - Excel
                    </ListItemButton>
                    <ListItemButton onClick={()=>{
                        handleClose()
                        callActionCsv()
                    }}>
                        Payroll - Csv
                    </ListItemButton>
                    <ListItemButton onClick={()=>{
                        handleClose()
                        callActionBonusExcel()
                    }}>
                        Bonus - Excel
                    </ListItemButton>
                    </Box>
            </MenuPopover>
        </>
    );
}; 

const StyledWeeklyToolbar =  styled(AdminToolbar)({
    '&.RaToolbar-mobileToolbar': {
        position: 'relative'
    },
    '&.RaToolbar-toolbar':{
        backgroundColor:'#FFF'
    },
    '&.RaToolbar-desktopToolbar':{
        backgroundColor:'#FFF',
        marginTop:'unset'
    },
});

export const StyleToolbar = styled(AdminToolbar)({
    '&.RaToolbar-mobileToolbar': {
        position: 'relative'
    },
    '&.RaToolbar-toolbar':{
        backgroundColor:'#FFF'
    }
});

export const PeriodNameWithStatus = (props: AutocompleteInputProps) => {
    const { loading } = usePermissions();
    if (loading) return null;
    return <>
        <AutocompleteInput
            optionText={(record?: Record) =>
                record?.id
                    ? record.id === '@@ra-create' ? record.name : `${record.name} (${record.status})`
                    : ''
            }
            {...props}
        />
    </>
};

const PayBonusSubmit = (props: any) => {
    const {state:{selectedIds,isFromPayrollCard,redirectTo}} = useLocation();
    const notify = useNotify();
    const [update,{isLoading}] = useUpdate();
    const currentRouteBasePath = useGetBaseLocationForCurrentRoute();
    const queryClient = useQueryClient();
    const redirect = useRedirect();
    const unselectAll = useUnselectAll('attendances');

    const handleClick = (data:any) => {
        const payload = {
            id: data.period_id,
            data: { id: data.period_id, selected_bonus_ids: selectedIds },
            previousData: { id: data.period_id, selected_bonus_ids: [] }
        }
        const resource = 'periods';
        update(
            resource,
            payload,
            {
                mutationMode: 'pessimistic',
                onSuccess: (result: any) => {
                    if (isFromPayrollCard){
                        queryClient.invalidateQueries(['payrolls', 'getList']);
                        updateCache({queryClient, resource:'attendances', id:selectedIds[0], data:{status:'paid',paid_period_id:data.period_id}});
                    }else{
                        queryClient.invalidateQueries(['attendances', 'getList']);
                    }
                    unselectAll()
                    redirect(redirectTo || currentRouteBasePath)
                },
                onError: (error: any) => {
                    notify(error.message);
                },
            }
        );
    };
    return (
        <FormWithRedirect
            {...props}
            render={(formProps: any) => {
                return (
                    <Grid className='pay-bonus-modal-grid'>
                        <Grid item lg={12} xs={12}>
                            <StyledAutoReferenceInput
                                source='period_id'
                                validate={[required()]}
                                filter={{start_date: { _lte: moment().format('YYYY-MM-DD')} }}
                                reference='periods'
                                label='Select which pay period to pay bonus?'
                            >
                                <PeriodNameWithStatus  fullWidth/>
                            </StyledAutoReferenceInput>
                            <StyledWeeklyToolbar
                                sx={{
                                    bottom: 0,
                                    marginBottom:0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor:'#FFF',
                                    flex:1, 
                                    marginTop:'unset',
                                    justifyContent:'flex-end',
                                }}
                                {...formProps}
                            >
                                <SaveButton label='Pay' saving={isLoading} onSave={handleClick}/>
                            </StyledWeeklyToolbar>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
};

const AddTimeFormDialog = ({redirectTo='/propay/payroll', component}:{component:React.ReactElement,redirectTo?: string}) =>{
    return (
        <ResourceContextProvider value='attendances'>
            <AddTimeDialog redirectTo={redirectTo} component={component}/>
        </ResourceContextProvider>
    )    
};

const TimeDialog = ({ redirectTo,component, }: any) => {
    const redirect = useRedirect();

    const handleClose = () => {
        redirect(redirectTo, '', null, null, { _scrollToTop: false });
    };

    return <>
        <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                {component.props.title}
                <IconButton
                    color='primary'
                    aria-label='upload picture'
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </Stack>
        </DialogTitle>
        <DialogContent>{component}</DialogContent>
    </>
};
const WeeklyAddTimeDialog = ({ redirectTo, component }: any) => {
    const xsFullScreenDialog = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );

    return (
        <StyledDialog open  maxWidth='md' fullScreen={xsFullScreenDialog}>
            <TimeDialog redirectTo={redirectTo}  component={component}/>
        </StyledDialog>
    );
};

const AddTimeDialog = ({ redirectTo, component }: any) => {
    const xsFullScreenDialog = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );

    return (
        <StyledDialog open fullWidth maxWidth='xs' fullScreen={xsFullScreenDialog}>
            <TimeDialog redirectTo={redirectTo} component={component} />
        </StyledDialog>
    );
};

export const PayrollFilter=[...CommonFilter,<StyledSelectInput
    size='medium'
    source='status._eq'
    label='Status'
    choices={PAYROLL_STATUS}
    alwaysOn
/>]

export const BonusPayrollFilter=[...CommonFilterForManageBonusOnly,<StyledSelectInput
    size='medium'
    source='status._eq'
    label='Status'
    choices={PAYROLL_STATUS}
    alwaysOn
/>]

export const useDefaultPeriodFilter = (props) => {
    const { data }: any = useGetList('periods', {
        sort: { field: 'end_date', order: 'DESC' },
        filter: {},
    });
    
    const period_filter = useMemo(() => {
        if(!_.size(data)){
            return {};
        }
        let period_filter = {}
        const lastClosed:any = _.find(data, function(record) {
             return record.status === 'closed'; 
            });
        if (!lastClosed){
            const period:any = _.last(data)
            period_filter = {'period_id': {'_eq': period.id}}
        }
        else {
            const nextOpen = moment(lastClosed.end_date).add(1, 'day').format('YYYY-MM-DD')
            const nextOpenPeriod:any = _.find(data, function(o) { 
                return o.start_date === nextOpen;
             });
            period_filter = {'period_id': {'_eq': nextOpenPeriod ? nextOpenPeriod.id:lastClosed.id}};
        }
        return period_filter;
    }, [data]);
    return period_filter;
};

export const TitleActions = (props: any): React.ReactElement => {
    return (
        <PayrollSwitcher/>
    );
};

const PayrollSwitcher = (props: any) => {
    const currentRouteBasePath = useGetBaseLocationForCurrentRoute();
    const params = useParams();
    var { filterValues,displayedFilters } = useListContext();
    const statusDict = {
        'open':{_eq:'pending'},
        'paid':{_eq:'paid'},
        'pending':{_eq:'open'}
    };
    const search = `?${stringify({
        displayedFilters: displayedFilters.status ? JSON.stringify({ ...displayedFilters, status: statusDict[displayedFilters.status._eq] }) : JSON.stringify(displayedFilters),
        filter:filterValues.status ? JSON.stringify({ ...filterValues, status: statusDict[filterValues.status._eq] }) : JSON.stringify(filterValues)
    })}`
    const value = params['*'];
    return (
            <ToggleButtonGroup
                exclusive
                value={value}
                size='small'
                color='primary'
                sx={{marginLeft:1}}
            >
            <ToggleButton value='attendances' component={Link} to={{
                pathname: `${currentRouteBasePath}/attendances`,
                search: search
            }}>
                <Icon icon='mdi:account-multiple' fr='' width={24} height={24} />
            </ToggleButton>
            <ToggleButton value='' component={Link} to={{
                pathname: currentRouteBasePath,
                search: search
            }}>
                <Icon icon='ph:currency-circle-dollar-fill' fr='' width={24} height={24} />
            </ToggleButton>
        </ToggleButtonGroup>
    )
};

const OpenWeeklyAddTimeForm = (props:any) => {
    const {redirectTo} = props;
    return <> 
        {redirectTo ?
            (<WeeklyAddTimeDialog {...props} component={
                <WeeklyAddTimeForm redirect={redirectTo} {...props} title={'Add Time'} />
            } />)
            : <WeeklyAddTimeForm redirect={redirectTo} {...props} title={'Add Time'} />
        }
    </>
};

export const DialogAddTimeForm = (props: any) => {
    const identity = useIdentityContext();
    if (!identity) {
        return <></>
    }
    return <OpenWeeklyAddTimeForm {...props} />
};

export const PayrollsList = (props: any) => {
    const redirect = useRedirect()
    const identity = useIdentityContext();
    if (!identity) {
        return <></>
    }
    return <> 
    <Routes>
        <Route path='*' element={<Outlet/>}>
            <>
                <Route path='' element={<><BonusPayrolls /><Outlet/></>}>
                    <Route path='attendance/create' element={
                        <OpenWeeklyAddTimeForm redirectTo='/propay/payroll'  refreshResource='payrolls'/>
                    } />
                    <Route path=':resource/:id' element={
                        <ResourceContextProvider value='propays'>
                            <PropayShow redirectTo='/propay/payroll'/>
                        </ResourceContextProvider>
                    }>
                    </Route>
                    <Route path='paybonus' element={
                        <AddTimeFormDialog redirectTo='/propay/payroll' component={
                            <PayBonusSubmit redirect='/propay/payroll' title={'Pay Bonus'}/>
                        } />
                    } />
                    <Route path='report' element={
                        <DialogForm open title={'Generate Report'} onClose={()=>redirect('/propay/payroll')}>
                            <DownloadBonusOtReport onClose={()=>redirect('/propay/payroll')}/>
                        </DialogForm>                    
                    } />
                    <Route path='payroll-report' element={
                        <DialogForm open title={'Generate Report'} onClose={()=>redirect('/propay/payroll')}>
                            <PayrollReport onClose={()=>redirect('/propay/payroll')}/>
                        </DialogForm>                    
                    } />
                    <Route path='select-payroll' element={
                        <DialogForm open title={'Select which payroll to link propay?'} onClose={()=>redirect('/propay/payroll')}>
                            <ActionLinkProPayForm redirectpathname='/propay/payroll'/>
                        </DialogForm> 
                    }/>      
                    <Route path='link-propay' element={
                        <DialogForm open title={'Link ProPay'} onClose={()=>redirect('/propay/payroll')}>
                            <PayrollProPayLinkForm onClose={()=>redirect('/propay/payroll')}/>
                        </DialogForm> 
                    }/>                   
                </Route>
                <Route path='attendances' element={<><PayrollListView /><Outlet /></>}>
                    <Route path='create' element={
                        <OpenWeeklyAddTimeForm redirectTo='/propay/payroll/attendances' refreshResource='attendances' />
                    } />
                    <Route path=':resource/:id' element={
                        <ResourceContextProvider value='propays'>
                            <PropayShow redirectTo='/propay/payroll/attendances' />
                        </ResourceContextProvider>
                    } />
                    <Route path='paybonus' element={
                        <AddTimeFormDialog redirectTo='/propay/payroll/attendances' component={
                            <PayBonusSubmit redirect='/propay/payroll/attendances' title={'Pay Bonus'}/>
                        } />
                    } />
                    <Route path='report' element={
                        <DialogForm open title={'Generate Report'} onClose={()=>redirect('/propay/payroll/attendances')}>
                            <DownloadBonusOtReport onClose={()=>redirect('/propay/payroll/attendances')}/>
                        </DialogForm>                    
                    } />
                    <Route path='payroll-report' element={
                        <DialogForm open title={'Generate Report'} onClose={()=>redirect('/propay/payroll/attendances')}>
                            <PayrollReport onClose={()=>redirect('/propay/payroll/attendances')}/>
                        </DialogForm>                    
                    } />
                    <Route path='select-payroll' element={
                        <DialogForm open title={'Select which payroll to link propay?'} onClose={()=>redirect('/propay/payroll/attendances')}>
                            <ActionLinkProPayForm redirectpathname='/propay/payroll/attendances'/>
                        </DialogForm> 
                    }/>  
                    <Route path='link-propay' element={
                        <DialogForm open title={'Link ProPay'} onClose={()=>redirect('/propay/payroll/attendances')}>
                            <PayrollProPayLinkForm onClose={()=>redirect('/propay/payroll/attendances')}/>
                        </DialogForm> 
                    }/>        
                </Route>
            </>
        </Route>
    </Routes>
    </>
};
