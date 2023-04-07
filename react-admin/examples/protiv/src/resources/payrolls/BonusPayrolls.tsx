/* eslint-disable @typescript-eslint/no-unused-vars */
import { Icon } from '@iconify/react';
import EditIcon from '@mui/icons-material/Edit';
import { styled, useTheme } from '@mui/material/styles';
import React, { cloneElement, isValidElement, useRef, useState } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import { NUMBER } from '../../utils/Constants/MagicNumber';

import MenuIcon from '@mui/icons-material/Menu';
import {
    Button, CardContent,
    Grid, IconButton, Stack,
    Table,
    TableBody, Menu, useMediaQuery, 
    TableRow, Theme, Toolbar, Typography, Avatar,  Tooltip
} from '@mui/material';
import _ from 'lodash';
import moment from 'moment';
import {
    AutocompleteArrayInput, Button as RaButton, CRUD_UPDATE, Datagrid, FieldTitle, FormWithRedirect, FunctionField, MenuItemLink, NumberField, 
    ReferenceArrayField, ReferenceField, ReferenceInput, ResourceContextProvider, SaveButton, SelectInput, TextField, useGetIdentity, 
    useGetOne, useListContext, useMutation, useNotify, useRecordContext, useRedirect, useRefresh, useResourceContext, useTranslate, useUpdate
} from 'react-admin';
import { useQueryClient } from 'react-query';
import { useLocation } from 'react-router';
import { ArrayInput } from '../../components/ArrayInput';
import { StyledOvertimeInputIterator } from '../../components/ArrayInput/OvertimeInputIterator';
import DialogForm from '../../components/DialogForm';
import { DefaultDatagrid, FormatTimeField, MoneyField, NumberToTimeField, StatusLabelField } from '../../components/fields';
import { CustomFormDisplayField } from '../../components/fields/CustomFormDisplayField';
import { DateField } from '../../components/fields/DateField';
import { AutocompleteInput } from '../../components/fields/inputs';
import { MaskedTimeInput } from '../../components/fields/MaskedTimeInput';
import { useIdentityContext } from '../../components/identity';
import Label from '../../components/Label';
import { updateCache } from '../../hooks/updateCache';
import { useGetBaseLocationForCurrentRoute } from '../../hooks/useGetBaseLocationForCurrentRoute';
import { CreateButton } from '../../layout/CreateButton';
import Empty from '../../layout/Empty';
import { List } from '../../layout/List';
import { ResponsiveFilterGusser } from '../../layout/ResponsiveFilter';
import { HasBackendNotConnected, useGetBackend } from '../company/company';
import { StatusButtonGroup, WeeklyDialogForm } from '../propays/PropayTab';
import { BonusEarningInfo, BonusPayrollFilter, HasPermission, PayrollShow, PeriodField, StyledCard, StyledTableCell, StyledTypography, TitleActions } from './Payrolls';
import usePayrollReport from './usePayrollReport';
import {  parseTime, StyleToolbar, WeeklyAddTimeForm } from './weeklyEntries';
import { PropayLinkButton } from './SFPayrolls';
import { DateRangeInputFilter } from '../../components/fields/DateRangeInputFilter';
import { useNavigate } from 'react-router-dom';
import { truncatePropayName } from '../../utils/Constants/ConstantData';


import ReferenceArrayInput from '../../components/fields/ReferenceArrayInput';
import { Helmet } from 'react-helmet-async';
import { InfoLabel } from '../../components/fields/InfoLabel';
import { validateTotalHours } from './otInputScreen';

const StyledDatagrid = styled(Datagrid)({
    '.column-performance_bonus' : {width: 0},
    '.column-edit-button':{width: 0}
});

const StyledAutocompleteInputLarge = styled(AutocompleteInput)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        'min-width': 'unset',
    },
    [theme.breakpoints.up('sm')]: {
        'min-width': '200px',
    }
}));

const StyledReferenceArrayInput = styled(ReferenceArrayInput)({
    minWidth: '150px',
});

const StyledSelectInput = styled(SelectInput)({
    'min-width': '150px',
}); 

const ATTENDANCE_STATUS = [
    { id: 'pending', name: 'resources.attendances.choices.status.pending' },
    { id: 'paid', name: 'resources.attendances.choices.status.paid'},
];

export const BonusFilter = [
    <ReferenceInput
        size='medium'
        source='period_id._eq'
        reference='periods'
        label='Payroll Period'
        alwaysOn
        alwaysOnMobile
        sort={{ field: 'start_date', order: 'DESC' }}
        filter={{ start_date: { _lte: moment().format('YYYY-MM-DD') },payroll_ids: {performance_bonus: {_gt: 0}} }}
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
    <StyledSelectInput
    size='medium'
    source='status._eq'
    label='Status'
    choices={ATTENDANCE_STATUS}
    alwaysOn
/>,
    <DateRangeInputFilter source='create_date' alwaysOn />
];

const BonusActionButtons = (props: any) => {
        const {record,redirectTo,redirectPath,isFromPayrollCard} = props;
        const {status} = record;
        const notify = useNotify();
        const [mutate, { loading }] = useMutation();
        const resource =  useResourceContext();
        const queryClient = useQueryClient();
        const resourceContext =  useResourceContext();
        const redirect = useRedirect();
        const diaglogRef: any = React.useRef();
        const { identity } = useGetIdentity();
        const openOTDialog = () => {
            diaglogRef.current.open()
        };
        const identities = useIdentityContext();
        const refresh = useRefresh();
        const isbackend_connected = useGetBackend()
        const handleClick = (e:any) => {
            e.stopPropagation();
            if(identities.user_type ==='worker') 
            {
                return;
            }
            if (status==='paid'){
                return mutate(
                    {
                        type: 'update',
                        resource: resource,
                        payload: {id: record.id, action:('reOpenOne'), data: {  } }
                    },
                    {
                        mutationMode: 'pessimistic',
                        action: CRUD_UPDATE,
                        onSuccess: (
                            data: any,
                            variables: any = {}
                        ) => {
                            updateCache({queryClient, resource, id:data.data.id, data:data.data});  
                            const updatedData = {...data.data,status:'pending','paid_period_id':0};
                            updateCache({queryClient, resource, id:data.data.id, data:updatedData});  
                            if (isFromPayrollCard){
                                queryClient.invalidateQueries(['payrolls','getList']);
                            } else  {
                                queryClient.invalidateQueries(['attendances','getList']);
                            }
                            refresh()
                        },
                        onFailure: error => {
                            notify(`Failure ! ${error.message}`)
                        }
                    }
                    );
            } else {
                if (!isbackend_connected && !record.payroll_total_worked_hours && identity?.company?.has_overtime_config) {
                    openOTDialog()
                }else{
                    redirect(redirectPath, '', null,{}, { selectedIds: [record.id],redirectTo:redirectTo,isFromPayrollCard:isFromPayrollCard }); 
                }
            }
        }; 
    
        return (
                <>
                    {status === 'pending' &&  
                    <StatusButtonGroup
                        onClick={handleClick}
                        variant='outlined'
                        reverseVariant='contained'
                        loading={loading}
                        reverseLoading={false}
                        style={{}}
                        buttonsTitle={{ button1: 'Pending', button2: 'Paid' }}
                        reverseStyle={{ backgroundColor: '#faa734', color: 'white' }} />
                    }
                    {status === 'paid' &&  
                    <StatusButtonGroup
                        onClick={handleClick}
                        variant='contained'
                        reverseVariant='outlined'
                        loading={loading}
                        reverseLoading={false}
                        style={{ backgroundColor: '#3ab077', color: 'white' }}
                        buttonsTitle={{ button1: 'Pending', button2: 'Paid' }}
                        reverseStyle={{}} />
                    }
                    <WeeklyDialogForm title='Set Overtime'  ref={diaglogRef}>
                        <ResourceContextProvider value='propays'>
                            <WeeklyAddTimeForm hideBackButton={true} payrollIds={[record.payroll_id]} hasOvertimeInput={true} 
                            redirect={redirectTo} selectedIds={[record.id]} isFromPayrollCard={isFromPayrollCard} onClose={() => { 
                                diaglogRef.current && diaglogRef.current.close();
                            }} />
                        </ResourceContextProvider>
                    </WeeklyDialogForm>
                </>
        );
    };
    
    
    

const PropayEditButton = (props: any) => {
    const { record } = props
    const diaglogRef: any = React.useRef();
    const openAddTimeDialog = () => {
        diaglogRef.current.open()
    };
    return <>
    {record && record.status !== 'paid'?
    <HasBackendNotConnected>
        <IconButton
            color='primary'
            onClick={openAddTimeDialog}
        >
            <EditIcon />
        </IconButton>
        <WeeklyDialogForm title="Add Time"  ref={diaglogRef}>
            <ResourceContextProvider value="attendances">
                <WeeklyAddTimeForm propay_id={record.propay_id_obj} isFromPayroll={true} onClose={() => { diaglogRef.current.close() }} />
            </ResourceContextProvider>
        </WeeklyDialogForm>
        </HasBackendNotConnected>:null}
    </>
};   
const LinkProPayAction = (props: any) => {
    const { pathname } = useLocation();
    const redirect = useRedirect();
    const identity = useIdentityContext();
    const handleClick = () => {
        redirect(pathname + '/select-payroll', '', null, {}, {});
    }
    const showLinkButton = getShowLinkButtonPermission(identity);
    return <>
        {showLinkButton && 
        <Button
            className='link-propay-btn'
            color='primary'
            variant='outlined'
            sx={{ alignItems: 'center',minWidth: 'fit-content', whiteSpace: 'nowrap' }}
            onClick={handleClick}
        >
            Link ProPay
        </Button>
        }
    </>
};

const DesktopToolbarActions = (props:any) => {
    return (
        <Toolbar sx={{
            minWidth: 'fit-content',
            justifyContent:'right'
        }}>
            <>
                {/* <LinkProPayAction {...props} /> */}
                <AddTimeAndReport redirectTo={props.add_path} />
            </>
        </Toolbar>
    );
};

const ListActionToolBarBonus = (props: any) => {
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    if (isSmall){
        return <AddTimeCreate {...props}/>
    };
    return <DesktopToolbarActions {...props}/>
    
};

const AddTimeCreate = (props: any) => {
    return (
        <HasBackendNotConnected>
            <HasPermission resource="attendances" action="create">
                <CreateButton path={props.add_path} label='resources.periods.addtime.buttonTitle' />
            </HasPermission>
        </HasBackendNotConnected>
    )
};
const MobileListActions = (props: any) => {    
    return <>
        {/* {period_id &&  */}
            <ResponsiveFilterGusser filters={props.filters} filterActions={
                <> 
                {/* <LinkProPayAction {...props} /> */}
                    <AddTimeAndReport redirectTo={props.add_path} /></>
            } />
        {/* }    */}
    </>
};
const BonusMobileListActions = (props: any) => {
    return (
        <Stack flexDirection="column" direction="row" sx={{width:'100%'}}>
            <MobileListActions {...props}/>     
            {/* <AddTimeCreate {...props}/> */}
        </Stack>
    );
};

const BonusDesktopListActions = (props: any) => {
    return (
        <>
            <ResponsiveFilterGusser filters={props.filters}/>
            <DesktopToolbarActions {...props}/>
        </>
    );
};

export const BonusListActions = (props: any) => {
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const { filters } = props
    if(!filters){
        return <ListActionToolBarBonus {...props}/>
    };
    if(isSmall){
        return <BonusMobileListActions {...props}/>
    };
    if(!isSmall){
        return <BonusDesktopListActions {...props}/>
    };
};

export const BonusAttendanceList = (props: any) => {
    const currentRouteBasePath = useGetBaseLocationForCurrentRoute();
    const translate = useTranslate();
    const identities = useIdentityContext();

    return (<ResourceContextProvider value="attendances">
        <>
            <List
                empty={false}
                filterDefaultValues={{status:{_eq:'pending'}}}
                filter={{ 'type': { _eq: 'is_performance_bonus' }}}
                titleAction={TitleActions}
                titleActionProps={{ showCreate: false }}
                actions={<BonusListActions filters={BonusFilter} add_path={currentRouteBasePath+'/attendances/create'}/>}
            >
                <DefaultDatagrid
                    bulkActionButtons={<PayBonus redirectTo='/propay/payroll/attendances'  dialogRef={props.dialogRef}/>}
                    optimized={true}
                    isRowSelectable={record => record.status !== 'paid' && identities.user_type !=='worker'}
                >
                    <FunctionField
                        source='employee_id'
                        sortable
                        label='Worker'
                        render={(record: any) => {
                            return (
                                <Stack direction='row' spacing={1}>
                                    <ReferenceField
                                        source='employee_id'
                                        reference='employees'
                                        link={false}
                                    >
                                        <TextField source='name' />
                                    </ReferenceField>
                                    {record.bonus_ot_diff_amt ?
                                    <Label
                                        variant='ghost'
                                        color={'pending'}
                                    >
                                        Overtime
                                    </Label>:<></>}
                                </Stack>)
                        }}
                    />
                    <ReferenceField
                        label='Payroll Period'
                        source='period_id'
                        reference='periods'
                        link={false}
                    >
                        <PeriodField />
                    </ReferenceField>
                    <ReferenceField
                        label='Paid Period'
                        source='paid_period_id'
                        reference='periods'
                        link={false}
                    >
                        <PeriodField />
                    </ReferenceField>
                    <ReferenceField reference='propays' source='propay_id' link={false}>
                    <FunctionField
                         source='name'
                          render={(record: any) => (<PropayName record={record} />)}
                          />
                     </ReferenceField>
                    <FunctionField
                        source='bonus_earning'
                        sortBy='bonus_earning'
                        label={translate('resources.attendances.fields.bonus_earning')}
                        render={(record: any) => (
                            <ReferenceField
                                source='payroll_id'
                                reference='payrolls'
                                link={false}
                            >
                                <BonusEarningInfo attendanceRecord={record}/>  
                            </ReferenceField>
                        )}
                    />
                        <FunctionField
                            textAlign='right'
                            label='Status'
                            render={(record: any) => (
                                <>
                                    <BonusActionButtons record={record} redirectTo='/propay/payroll/attendances' 
                                    redirectPath='/propay/payroll/attendances/paybonus' label='Status' />
                                </>
                            )}
                        />
                </DefaultDatagrid>
            </List>
            <Helmet>
            <title>Bonuses</title>
        </Helmet>
        </>
    </ResourceContextProvider>)
};

const PropayName= (props: any) => {
    const navigate = useNavigate();
    const showPropay = (PropayId: any) => navigate(`/show/${PropayId}/propay`);
    const {record} = props;
    return(
         <>
            {record?.name?.length > NUMBER.TWENTY_ONE ? <Tooltip title={record?.name} placement='bottom' arrow>
              <span onClick={() => showPropay(record.id)}>{truncatePropayName(record?.name.toString())}</span>
                </Tooltip>
                 :
              <span onClick={() => showPropay(record.id)}>{truncatePropayName(record?.name.toString())}</span>
            }
        </>
    );
};

export const BonusPayrolls = (props: any) => {
    const translate = useTranslate();
    return (
    <div className='propay-page-card bonus-payroll-context'>
    <ResourceContextProvider value='payrolls'>
        <List
            empty={false}
            filter={{'performance_bonus': {_gt: 0}}}
            titleAction={TitleActions}
            titleActionProps={{ showCreate: false }}
            actions={<BonusListActions filters={BonusPayrollFilter} add_path='attendance/create'/>}
        >
            <DefaultDatagrid
                rowClick='expand'
                bulkActionButtons={false}
                optimized={true}
                expand={<PayrollShow component={<BonusPayrollDetail />} />}
            >
                <NumberField source='number' label='resources.payrolls.fields.number' />
                <TextField label='resources.payrolls.worker_name' source='employee_name'/>
                <FunctionField
                    source='period_id'
                    render={(record: any) => (
                        <ReferenceField
                            source='period_id'
                            reference='periods'
                            link={false}
                        >
                            <PeriodField />
                        </ReferenceField>
                    )}
                />
                <MoneyField source='bonus_earning' label='resources.payrolls.earnings'/>                 
                <StatusLabelField source='status' colors={{ paid: 'success' }} />

            </DefaultDatagrid>
        </List>
    </ResourceContextProvider>
    </div>
    );
};

export const PayBonus = (props: any) => {
    const { redirectTo } = props;
    const { data,selectedIds} = useListContext();
    const diaglogRef: any = React.useRef();
    const openOTDialog = () => {
        diaglogRef.current.open()
    };
    const redirect = useRedirect();
    const currentRouteBasePath = useGetBaseLocationForCurrentRoute();
    const [payrollIds, setPayrollIds] = useState([]);
    const isbackend_connected = useGetBackend();
    const identity = useIdentityContext();
    const handleClick = () => {
        if(identity.user_type === 'worker') 
        {
            return;
        }
        const AttendanceHavingNoOvertime = data.filter(function (value, index, arr) {
            return _.includes(selectedIds, value.id) && !value.payroll_total_worked_hours
        });
        const filteredPayrolls = _.uniq(_.map(AttendanceHavingNoOvertime,'payroll_id'));
        setPayrollIds(filteredPayrolls);
        if (!isbackend_connected && identity.company.has_overtime_config &&  _.size(filteredPayrolls)) {
            openOTDialog()
        } else {
            redirect(currentRouteBasePath+'/attendances/paybonus', '', null,{}, 
            { selectedIds: selectedIds,redirectTo:redirectTo}); 
        }
    };
    return (<>
        <RaButton
            label='Pay Bonus'
            className='pay-bonus-alert-btn'
            onClick={handleClick}
        />
        <WeeklyDialogForm title='Set Overtime'  ref={diaglogRef}>
            <ResourceContextProvider value='porpays'>
                <WeeklyAddTimeForm hideBackButton={true} payrollIds={payrollIds} hasOvertimeInput={true} redirect={redirectTo} selectedIds={selectedIds} onClose={() => { 
                    diaglogRef.current && diaglogRef.current.close();
                }} />
            </ResourceContextProvider>
        </WeeklyDialogForm>
        </>
    );
};

const AddTimeAndReport = (props:any) => {
    const {redirectTo} = props;
    const ref = useRef(null);
    const { filterValues } = useListContext(props);
    const period_id = filterValues && filterValues.period_id && filterValues.period_id._eq;
    const [open, setOpen] = useState(false);
    const { loading:excelLoading, callAction:callActionExcel } = usePayrollReport({
        action:'downloadPayrollReport', 
        id: period_id,
    })
    const { loading:csvLoading, callAction:callActionCsv } = usePayrollReport({
        action:'downloadCsvPayrollReport', 
        id: period_id,
    });
    const handleClose = () => {
        setOpen(false);
    };
    const handleClick = (event) => {
        setOpen(true);
    };
    const theme = useTheme();
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const identity = useIdentityContext();
    const showLinkButton = getShowLinkButtonPermission(identity);
    const translate = useTranslate();
    
    return (
        <>
            <IconButton
                ref={ref} 
                color='primary'
                onClick={handleClick}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                className='bonus-menu-dropdown'
                open={open}
                anchorEl={ref.current}
                onClose={() => setOpen(false)}
            >
                {showLinkButton && <MenuItem onClick={handleClose}><LinkProPayAction { ...props } /></MenuItem>}
                <HasPermission resource='payrolls' action='export_payroll'>
                    <MenuItemLink
                        onClick={handleClose}
                        to={'report'}
                        primaryText={translate('resources.propays.bonus_payroll.bonus_report')}
                    />
                    {identity?.company?.allow_zapier_api || identity?.company?.allow_salesforce_api || 
                    identity?.company?.allow_vericlock_api || identity?.company?.allow_dataverse || identity?.company?.tsheets_status === 'connected' &&
                    <MenuItemLink
                        onClick={handleClose}
                        to={'payroll-report'}
                        primaryText={translate('resources.propays.bonus_payroll.payroll_report')}
                    />}
                </HasPermission>
            </Menu>       
          </>
    );
}; 

export const CustomToolbar = (props: any) => {
    const notify = useNotify();
    const onSuccess = ({ data }: any) => {
        notify(props.success_msg || 'Element Updated');
        if (props.onSuccess){
            props.onSuccess();
        }
        if (props.onClose){
            props.onClose();
        }
    };
    return (
        <Toolbar {...props}>
            <SaveButton {...props} onSuccess={onSuccess} />
        </Toolbar>
    );
};

const PayrollOTForm = (props: any) => {
    const {record} = props;
    const [update,{isLoading}] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();
    const translate = useTranslate();

    const handleClick = (data:any) => {
        const savedata = {id: record.id, data: {id:record.id,total_worked_hours:parseTime(data.total_worked_hours)}, 
        previousData: {id:record.id,total_worked_hours:parseTime(record.total_worked_hours)}};
        update(
            'payrolls',
            savedata,
            {
                mutationMode: 'pessimistic',
                onSuccess: (result: any) => {
                    refresh()
                    if (props.onSuccess) {
                        props.onSuccess()
                    };
                },
                onError: (error: any) => {
                    notify(`Element Failed Updated ${error.message}`);
                },
            }
        );
    };

    return (
        <FormWithRedirect
            {...props}
            record={{id:record.id,name:record.name,total_worked_hours:record.total_hours}}
            render={(formProps: any) => {
                return (
                    <Grid>
                        <TextField source='name' label='' />
                        <Stack>
                            <Typography variant='caption' color='textSecondary'> {translate('resources.propays.bonus_payroll.info')}</Typography>
                        </Stack>
                        <MaskedTimeInput
                            label=''
                            sx={{width: 80}}
                            textAlign='center'
                            source='total_worked_hours'
                            variant='standard' 
                            validate={[validateTotalHours(record.total_propay_hours)]}
                        />
                        <Grid container columnSpacing={3} sx={{ marginTop: 3 }}>
                            <StyleToolbar
                                {...formProps}>
                                <SaveButton saving={isLoading} onSave={handleClick} />
                            </StyleToolbar>
                        </Grid>
                    </Grid> 
                )
            }}
        />
    );
};

const OtEditButton = (props:any) => {
    const openDialog = () => {
        dialogRef.current.open()
    };
    const dialogRef: any = React.useRef();
    return (
        <>
            <Button
                onClick={openDialog}
                sx={{minWidth:'unset',paddingLeft:1}}
            >
                <Icon
                    fr=''
                    icon='clarity:note-edit-line'
                    fontSize={20}
                />               
            </Button>
            <DialogForm title='Set Total Hours' ref={dialogRef}>
                <PayrollOTForm {...props} onSuccess={() => {
                        dialogRef.current.close();
                    }}/>
            </DialogForm>
        </>
    );
};

export const PropayPerformanceBonusDataGrid = (props: any) => {
    const { payrollRecord } = props;
    const translate = useTranslate();
    return (
            <StyledDatagrid bulkActionButtons={false} empty={<Empty />} optimized={true}>
                <ReferenceField reference='propays' source='propay_id' link={false}>
                    <FunctionField
                         source='name'
                          render={(record: any) => (<PropayName record={record} />)}
                          />
                     </ReferenceField>
                <ReferenceField
                    label='resources.propays.bonus_payroll.paid_period'
                    source='paid_period_id'
                    reference='periods'
                    link={false}
                >
                    <PeriodField />
                </ReferenceField>
                <FormatTimeField source='performance_hours' textAlign='right' />
                <FunctionField
                    sortBy='bonus_earning'
                    source='bonus_earning'
                    label={translate('resources.attendances.fields.bonus_earning')}
                    render={(record: any) => (
                        <BonusEarningInfo attendanceRecord={record} payrollRecord={payrollRecord}/>  
                    )}
                />
                <BonusActionButtons  redirectTo='/propay/payroll' redirectPath='/propay/payroll/paybonus' label='resources.propays.bonus_payroll.status' isFromPayrollCard={true}/>
                <PropayEditButton source='edit-button' label=''/>
            </StyledDatagrid>
    );
};

const PayrollBonusEarningInfo = (props: any) => {
    const {record:payrollRecord} = props; 
    if (!payrollRecord) return null
    var bonus = parseFloat(payrollRecord.performance_bonus).toFixed(NUMBER.TWO);
    var bonus_info_text = 'Bonus: $' + bonus ;

    var ot_amt = parseFloat(payrollRecord.bonus_ot_diff_amt).toFixed(NUMBER.TWO);
    var overtime_info_text = 'Overtime: $' + ot_amt ;

    return (
        <>
        {payrollRecord.bonus_ot_diff_amt?
            <InfoLabel>
                {payrollRecord.bonus_ot_diff_amt ? <StyledTypography>{overtime_info_text}</StyledTypography>:null}
                {payrollRecord.performance_bonus ? <StyledTypography>{bonus_info_text}</StyledTypography>:null}
            </InfoLabel>:null}
        </>
    );
};

export const PayrollTotalFooter = (props:any) => {
    const record = useRecordContext();
    return (<Grid container spacing={2}>
        <Grid item xs={12}>
            <Grid container spacing={3}>
                <Grid item lg={5} sm={12} xs={12}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <StyledTableCell align='left'>
                                    <FieldTitle source='non_propay_hours' />
                                </StyledTableCell>
                                <StyledTableCell align='right'>
                                    <FormatTimeField source='non_propay_hours' />
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    {record && record.status !== 'paid' && _.has(props,'extraButton') && isValidElement(props.extraButton) && cloneElement(props.extraButton, {
                                        ...props
                                    })}
                                </StyledTableCell>
                            </TableRow>
                            <TableRow>
                                <StyledTableCell align='left'>
                                    <FieldTitle source='bonus_earning' label='resources.payrolls.fields.total_bonus' />
                                </StyledTableCell>
                                <StyledTableCell align='right'>
                                    <MoneyField source='bonus_earning' />
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                    <PayrollBonusEarningInfo record={record} />
                                </StyledTableCell>
                            </TableRow>
                            {record && record.bonus_ot_diff_amt ? <TableRow>
                                <StyledTableCell align='left'>
                                    <FieldTitle source='bonus_ot_diff_amt' />
                                </StyledTableCell>
                                <StyledTableCell align='right'>
                                    <MoneyField source='bonus_ot_diff_amt' />
                                </StyledTableCell>
                                <StyledTableCell align='left'>
                                </StyledTableCell>
                            </TableRow>:<></>}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </Grid>
    </Grid>)
};

export const getShowLinkButtonPermission = (identity:any) => {
    //Here as per david show link button is not necessary for dataverse.
    return identity?.company?.allow_salesforce_api || identity?.company?.tsheets_status == 'connected'
};

const BonusPayrollDetail = (props :any) => {
    const record = useRecordContext();
    const { identity } = useGetIdentity();
    const showLinkButton =   getShowLinkButtonPermission(identity);
    return (
        <StyledCard>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={12}>
                        <ReferenceArrayField
                            reference='attendances'
                            source='performance_bonus_only_idsIds'
                        >
                            <PropayPerformanceBonusDataGrid payrollRecord={record} />
                        </ReferenceArrayField>
                    </Grid>
                    <PayrollTotalFooter extraButton={<>
                    {showLinkButton  && <PropayLinkButton record={record} />}
                    <HasBackendNotConnected><OtEditButton record={record} /></HasBackendNotConnected>
                    </>}/>
                </Grid>
            </CardContent>
        </StyledCard>
    );
};
