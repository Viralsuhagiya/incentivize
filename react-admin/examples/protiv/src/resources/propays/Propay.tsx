import CloseIcon from '@mui/icons-material/Close';
import {
    Box, Card, Tabs, Link,
    Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography, Tab, useMediaQuery, Accordion, AccordionSummary, AccordionDetails, Theme, Button, FormControl, RadioGroup, FormControlLabel, FormLabel, Radio
} from '@mui/material';
import { styled } from '@mui/material/styles';
import createDecorator from 'final-form-calculate';
import _ from 'lodash';
import get from 'lodash/get';
import { useQueryClient } from 'react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    AutocompleteArrayInput, AutocompleteInput, BooleanInput,  Confirm,  Create, CRUD_UPDATE, Edit,
    FormDataConsumer,
    FormWithRedirect,
    RecordContextProvider, ReferenceField,
    ReferenceInput,
    required, ResourceContextProvider, SaveButton, SelectInput,
    TextField,
    TextInput,
    Toolbar, useMutation, useNotify, useRedirect, useRefresh, useTranslate, useGetIdentity, FieldTitle
} from 'react-admin';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ArrayInput, SimpleFormIterator } from '../../components/ArrayInput';
import BooleanLabelField from '../../components/BooleanLabelField';
import DialogForm from '../../components/DialogForm';
import { Condition, DefaultDatagrid, MoneyField, MoneyInput, PercentInput, ReferenceArrayInputObj, ReferenceInputObj, StatusLabelField } from '../../components/fields';
import { DateField } from '../../components/fields/DateField';
import { List } from '../../layout/List';
import { EmptyTitle } from '../../layout/Title';
import {
    RowForm
} from '../../ra-editable-datagrid';
import { EmployeeFullNameField, EmployeeUpdateForm } from '../employees/Employee';
import { CreateJob, EditJob, JobNameInput } from '../jobs/job';
import { parseTime, StyledBooleanInput, WeeklyAddTimeForm } from '../payrolls/weeklyEntries';
import { PropayShow, PropayShowButton, PROPAY_STATUS } from './PropayTab';
import { usePageAlertsContext } from '../../components/page-alerts/usePageAlerts';
import { LoadingButton } from '@mui/lab';
import { hasNewProPayUsers, getCommaSeperatedStringFromArray, getAvgWage, getDayAvgAmt } from './propay_utils';
import { capitalCase } from 'change-case';
import Page from '../../components/Page';
import prepareChangeset from '../../dataProvider/prepareChangeset';
import { useGetBackend } from '../company/company';
import { DriveEtaRounded } from '@mui/icons-material';
import { ConfirmModal } from '../../components/ConfirmModal';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { InfoLabel } from '../../components/fields/InfoLabel';
import { Field } from 'react-final-form';
import { AttendanceCreateDialog, canAccessCheckInOut } from '../attendances/Attendance';
import { usePermissionsOptimized } from '../../components/identity';
import ButtonGroupInput from './ButtonGroupInput';
import { MaskedTimeInput, validateTime } from '../../components/fields/MaskedTimeInput';
export const StyledPercentInput = styled(PercentInput)({
    'label+.MuiInput-root':{
        marginTop:0,        
    },
    'width': 70,
});

export const StyledSelectInput = styled(SelectInput)({
    'min-width': '150px',
});
const StyledMoneyInput = styled(MoneyInput)({
    width: 80,
    pl:2,
    pr:2
});

export const StyledReferenceInput = styled(ReferenceInput)({
    'min-width': '160px',
});

const PREFIX = 'PropayEdit';

const classes = {
    root: `${PREFIX}-root`,
    moneyInput: `money-input`,
};

export const formStyle = {
    [`&.${classes.root}`]: { alignItems: 'flex-start' },
    '.MuiFormHelperText-root': { display: 'none' },
    '.MuiFormHelperText-root.Mui-error': { display: 'block' },
    '.MuiCardHeader-root': { 'padding-top': '0px' },
    '.MuiFormControl-root': { 'margin-top': '16px' },
};
export const StyledEdit = styled(Edit)({
    ...formStyle,
    '& .RaEdit-card':{
        width:'100%',
    },
    width:'100%',
});

export const StyledCreate = styled(Create)(({ theme }) => ({
    ...formStyle,    
    '& .RaCreate-card':{
        width:'100%',
    },
    width:'100%',
}));


export const StyledBonusSelectInput = styled(SelectInput)({
    'min-width': '250px',
});

export const BudgetChoices = [
    {'id':'amount','name':'Amount'},
    {'id':'hours','name':'Hours'},
]

export const bonusSplitTypeSelection = [
    {
        id: 'by_hours',
        name: 'resources.companies.settings.additional_settings.equally_per_hour',
    },
    {
        id: 'by_wage',
        name: 'resources.companies.settings.additional_settings.equal_percentage_increase_of_wage',
    },
    {
        id: 'by_percentage',
        name: 'resources.companies.settings.additional_settings.set_percentage_distribution',
    },
];

const PropayFilter = [
    <TextInput source='name._ilike' label='Search' alwaysOn size='medium' />,
    <StyledSelectInput
        size='medium'
        source='status._eq'
        label='Status'
        choices={PROPAY_STATUS}
        alwaysOn
    />,    
    <StyledReferenceInput size='medium'
        source='manager_id._eq'
        reference='employees'
        label='Manager'
        filter={{ user_type: {_in:['manager','admin']} }}
    >
        <AutocompleteInput
            source='manager_id'
            optionText={<EmployeeFullNameField />}
        />
    </StyledReferenceInput>
];


export const PropayList = (props: any) => {
    const translate = useTranslate();
    return (
        <>
            <List
                filters={PropayFilter}
                titleActionProps={{showCreate:true}}
            >
                <DefaultDatagrid rowClick='edit'>
                    <TextField source='id'/>
                    <TextField source='name'/>
                    <ReferenceField source='manager_id' reference='employees' link={false}>
                        <EmployeeFullNameField />
                    </ReferenceField>
                    <StatusLabelField source='status' colors={{paid:'success'}}/>
                    <BooleanLabelField
                        source='is_change_base_wage'
                        label='Change Base Wage?'
                    />
                    <MoneyField source='amount' />
                    <DateField source='create_date' isLocal={false}/>
                    <DateField source='write_date' isLocal={false}/>
                    <PropayShowButton textAlign='right' />
                </DefaultDatagrid>
            </List>
            <Routes>
                <Route path=':id/show' element={<PropayShow redirectTo='/propays'/>}/>
                <Route path='create' element={
                    <ResourceContextProvider value='propays'>
                        <PropayDialog
                            redirectTo='/propays'
                            open
                            component={<PropayCreate title={translate('resources.propays.new_propay')}/>}
                        />
                    </ResourceContextProvider>
                }/>
                <Route path=':id' element={
                    <ResourceContextProvider value='propays'>
                        <PropayDialog
                            redirectTo='/propays'
                            open
                            title={translate('resources.propays.actions.edit_propay')}
                            component={<PropayEdit title={translate('resources.propays.actions.edit_propay')}/>}
                        />
                    </ResourceContextProvider>
                }/>
            </Routes>
        </>
    );
};

export const StyledDialog = styled(Dialog)(({ theme }) => ({
    '.MuiDialogContent-root': {
        [theme.breakpoints.down('sm')]: {
            paddingLeft:theme.spacing(NUMBER.TWO),
            paddingRight:theme.spacing(NUMBER.TWO),
            paddingTop:theme.spacing(NUMBER.TWO)
        },
        [theme.breakpoints.up('sm')]: {
            paddingLeft:theme.spacing(NUMBER.THREE),
            paddingRight:theme.spacing(NUMBER.THREE),
        }
    },
    '.MuiDialog-paperFullScreen':{
        margin: 0
    },
}));

const ProPayStyledDialog = styled(StyledDialog)(({ theme }) => ({
    '.MuiDialogContent-root': {
        height: window.innerHeight,
    },
}));

export const PropayDialog = ({ redirectTo, title, open, component }: any) => {
    const redirect = useRedirect();
    const xsFullScreenDialog = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const handleClose = () => {
        redirect(redirectTo, '', null,null, { _scrollToTop: false });
    };
    return (
        <ProPayStyledDialog fullWidth maxWidth='lg' fullScreen={xsFullScreenDialog} open={open}>
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
        </ProPayStyledDialog>
    );
};

const getWage = (emp: any) => {
    return emp.base_wage;
};

const updateExistingHavingWageZero = (employee_wage_ids,employeeIdsById) => {
    return _.forEach(employee_wage_ids, (oneExisting)=>{
        const emp = employeeIdsById[oneExisting.employee_id];
        const base_wage  = getWage(emp)
        if (oneExisting.base_wage == 0 && base_wage) {
            oneExisting['base_wage'] = base_wage;
        }
    });
};

const computeEmployeeWageIds = (selected_employee_ids_obj:any, employee_wage_ids:any, forceUpdate:boolean, propay_type:string):any => {
    let employee_ids = selected_employee_ids_obj;
    if(!(selected_employee_ids_obj instanceof Array)){
        employee_ids = !selected_employee_ids_obj ? [] : [selected_employee_ids_obj];
    }

    const existingIds = _.flatMap(employee_wage_ids, 'employee_id');
    const selected_employee_ids = _.flatMap(employee_ids, 'id');
    const employeeIdsById = _.keyBy(employee_ids, 'id');

    const added = _.map(_.difference(selected_employee_ids, existingIds), val => {
        const emp = employeeIdsById[val];
        return { 'employee_id':emp.id, 'base_wage': getWage(emp),'is_remove_bonus':false};
    });
    const removed = _.map(_.difference(existingIds, selected_employee_ids),val=>{ return {employee_id: val}; });
    if(!_.isEmpty(added)||!_.isEmpty(removed)||forceUpdate){
        _.pullAllBy(employee_wage_ids, removed, 'employee_id')

        if(forceUpdate) {
            _.forEach(employee_wage_ids, (oneExisting)=>{
                const emp = employeeIdsById[oneExisting.employee_id];
                oneExisting['base_wage'] = getWage(emp);
            });
        }

        _.forEach(added, (oneAdded)=>{
            employee_wage_ids.push(oneAdded);
        });

        return employee_wage_ids;
    }else{
        employee_wage_ids  = updateExistingHavingWageZero(employee_wage_ids,employeeIdsById)

        return employee_wage_ids;
    }    
};

const onUpdateSelectedEmployeeIdsObj = (fieldValue:any, name:string, allValues:any):any => {
    const oldVals = allValues?allValues.employee_wage_ids||[]:[];
    const newVals = computeEmployeeWageIds(fieldValue, oldVals, false,allValues.propay_type);
    const result:any = {}
    if (newVals !== undefined){
        result['employee_wage_ids'] = newVals
    }  
    return result;
};
const onUpdateOnChangeWage = (fieldValue:any, name:string, allValues:any):any => {
    const oldVals = allValues?allValues.employee_wage_ids||[]:[];
    const result:any = {}
    if(!fieldValue){
        const newVals = computeEmployeeWageIds(allValues.selected_employee_ids_obj, oldVals, !fieldValue, allValues.propay_type);
        result['employee_wage_ids'] = newVals
    }
    return result;
};

const onUpdatePropayType = (
    fieldValue: any,
    name: string,
    allValues: any
): any => {
    const selected_employee_ids = allValues?allValues.selected_employee_ids : [];
    const selected_employee_ids_obj = allValues?allValues.selected_employee_ids_obj : [];
    const result: any = {};
    if (fieldValue === 'hourly') {
        result['amount'] = null;
    }
    if (!fieldValue){
        result['selected_employee_ids'] = [];
        result['selected_employee_ids_obj'] = [];
    } else {
        if(!(selected_employee_ids instanceof Array) && selected_employee_ids != null){
            result['selected_employee_ids'] = [selected_employee_ids];
        }
        if(!(selected_employee_ids_obj instanceof Array) && selected_employee_ids_obj != null){
            result['selected_employee_ids_obj'] = [selected_employee_ids_obj];
        }
    }
    return result;
};

export const DefaultNameRowForm = (props: any) => {
    console.log('DefaultNameRowForm:', props);
    return (
        <RecordContextProvider value={props.record}>
            <RowForm {...props} resource='taskLists'>
                <TextInput
                    fullWidth
                    source='name'
                    variant='standard'
                    label={false}
                />
            </RowForm>
        </RecordContextProvider>
    );
};

const CommonSimpleFormIteratorStyle = {
    '.MuiFormControl-root': {
        marginTop: 0,
        '& .MuiInputLabel-formControl': {
            display: 'none',
        },
        '& .MuiInput-root': {
            marginTop:0
        }
    },
    overflow:'auto'
};

export const StyledSimpleFormIterator = styled(SimpleFormIterator)({
    '.MuiTableCell-head: last-child': {
        width: 40,
    },
    '.MuiTableCell-body: last-child': {
        width: 40,
    },
    '.RaSimpleFormIterator-action': {
        marginLeft: 8,
        marginTop: 10,
        float: 'left'
    },
    ...CommonSimpleFormIteratorStyle
    
});

export const StyledEmployeeWageSimpleFormIterator = styled(SimpleFormIterator)({
    CommonSimpleFormIteratorStyle,
    '.MuiTableCell-head: last-child': {
        width: 100,
    },
    '.MuiTableRow-root': {
        '& .RaFormInput-input': {
            width:'100%'
        },
    },
    ...CommonSimpleFormIteratorStyle
    
});

const ConfirmSendSMS = ({record, selectedEmployees, onClose}) => {
    const notify = useNotify();
    const [mutate, { loading }] = useMutation();
    const sendSmsAlert = useCallback(()=>{
        const noBonusIds = record.data.noBonusIds
        mutate(
            {
              type: 'updateMany',
              resource: 'propayEmployeeWages',
              payload: { ids: noBonusIds, action: 'send_no_bonus_sms' },
            },
            {
              mutationMode: 'pessimistic',
              action: CRUD_UPDATE,
              onSuccess: (data: any, variables: any = {}) => {
                onClose()
              },
              onFailure: (error) => {
                notify(`Failure ! ${error.message}`);
              },
            }
          );
    },[mutate, record, notify, onClose]);
    return (<>
    <Typography variant='body2'>
        Would you like to alert
        <Typography variant='subtitle1' component='span'>
            &nbsp;({selectedEmployees})&nbsp;
        </Typography>
        to select the ProPay at the time of clocking in?
        <LoadingButton loading={loading} sx={{p:0}} color='info' onClick={sendSmsAlert}><strong>Yes.</strong></LoadingButton>
    </Typography>
    </>)
};

const ProPayUserAlert = ({propayUsers}) => {
    return (
        <Typography variant='body2'>
            <Typography variant='subtitle1' component='span'>
                &nbsp;({_.join(propayUsers,', ')})&nbsp;
            </Typography>
            are now active ProPay users
        </Typography>        
    )
};

const StyledCard = styled(Card)(({ theme }) => ({
    padding:theme.spacing(NUMBER.TWO),
    [theme.breakpoints.up('sm')]: {
        padding:theme.spacing(NUMBER.THREE)
    }
}));

const isRequired = [required()];
const employeeInitialValues={
    employeesArray:[],
    emptyFields:[]
};

const ProapyForm = (props: any): any => {
    const refresh = useRefresh();
    const queryClient = useQueryClient();

    const translate = useTranslate()
    const notify = useNotify();
    const dialogRef: any = useRef();
    const wageChangeRefByEmp: any = useRef({});
    const [employeeDetails, setEmployeeDetails] = useState(employeeInitialValues);
    const [alertData,setAlertData] = useState({'noBonusIds':[],'selectedEmployees':'','newProPayUsers':[]});
    const [openConfirmChangeDialog, setOpenConfirmChangeDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    
    const [isExpand, setIsExpand] = useState(props.isExpand);
    const [empIndex,setEmpIndex]=useState(0)
    const { loaded, identity } = useGetIdentity();
    const [mutate, { loading }] = useMutation();
   
    const onUpdateEmployeeWageIdsAvgWage = (fieldValue:any, name:string, allValues:any):any => {
        const avg_base_wage = getAvgWage(allValues?.employee_wage_ids)
        const avg_wage_per_day = getDayAvgAmt(avg_base_wage,allValues?.hours_per_day)
        const result:any = {'avg_wage_per_hr':avg_base_wage,'avg_wage_per_day':avg_wage_per_day}
        return result;
    };
    const validateWage = (values: any, allValues: any) => {
        if (_.size(get(allValues, 'selected_employee_ids_obj')) > 0) {
            let tempArray = []
            let tempEmpty = []
            // eslint-disable-next-line array-callback-return
            get(allValues, 'selected_employee_ids_obj').map(employee => {
                if (_.indexOf(values, get(employee, 'id')) > -1) {
                    let emptyFieldObj: any = {}
                    if (get(employee, 'base_wage') === 0)
                        emptyFieldObj['Wages'] = true
                    if (identity?.company?.allow_job_position && get(employee, 'position_id') === 0)
                        emptyFieldObj['Position'] = true
                    if (get(employee, 'mobile_number') === '')
                        emptyFieldObj['Mobile_number'] = true
                        
                    if(Object.keys(emptyFieldObj).length>0){
                        tempArray.push(employee)
                        tempEmpty.push(emptyFieldObj)
                    }
                }
            });
            if (_.size(tempArray) > 0) {
                setEmployeeDetails({
                    employeesArray: tempArray,
                    emptyFields: tempEmpty
                }
                );
                return ' '
            }
        }
        setEmployeeDetails(employeeInitialValues)
        return undefined;
    };

    useEffect(()=>{
        if(isExpand !== props.isExpand){
            refresh();
            setIsExpand(props.isExpand);
        }
    },[isExpand, props.isExpand, refresh]);

    const onFocusPropayName = () => {
        setIsExpand(true);
        if(props.gotFocus){
            props.gotFocus();
        }
    };
    const [selectedEmployeeIdsObj, setSelectedEmployeeIdsObj] = useState<any>([] as any);
    const onUpdateSelectedEmployeeIdsObj2 = useCallback((fieldValue:any, name:string, allValues:any):any =>{
        setSelectedEmployeeIdsObj(fieldValue)
        return {}
    },[setSelectedEmployeeIdsObj]);

    const onUpdateContractorItems = (fieldValue:any, name:string, allValues:any) => {
        var total_qty = _.sumBy(fieldValue, 'quantity');
        return {'total_qty':total_qty}
    };
    
    const onemployee_wage_ids = (fieldValue:any, name:string, allValues:any) => {
        var result = {}
        if (fieldValue){
            const onChangeField = name.slice(name.indexOf('.') + 1);
            const targetFieldName = _.replace(name,onChangeField,'bonus_per')
            result[targetFieldName] = 0
            return result
        } else {
            return result
        }
    };

    const calculator = useMemo(() => {
        return [
            createDecorator(
                {
                    field: 'selected_employee_ids_obj',
                    updates: onUpdateSelectedEmployeeIdsObj,
                },
                {
                    field: 'selected_employee_ids_obj',
                    updates: onUpdateEmployeeWageIdsAvgWage,
                },
                {
                    field: 'selected_employee_ids_obj',
                    updates: onUpdateSelectedEmployeeIdsObj2,
                },
                {
                    field:/employee_wage_ids\[\d+\]\.base_wage/,
                    updates: onUpdateEmployeeWageIdsAvgWage,
                },
                {
                    field: 'is_change_base_wage',
                    updates: onUpdateOnChangeWage,
                },
                {
                    field: 'is_change_base_wage',
                    updates: onUpdateEmployeeWageIdsAvgWage,
                },
                {
                    field: 'propay_type',
                    updates: onUpdatePropayType,
                },
                {
                    field:/employee_wage_ids\[\d+\]\.is_remove_bonus/,
                    updates: onemployee_wage_ids,
                },
                {
                    field: 'contractor_item_ids_obj',
                    updates: onUpdateContractorItems,
                },
            ),
        ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useMemo(() => {
        return ( state: any, fieldStates:any) => {
            console.log(`Debug Form validity changed to Valid ${state.valid}, INVALID:${state.invalid}`, state.hasValidationErrors, state.submitErrors);
            _.forEach(fieldStates, (v,k)=>{
                console.log(`Debug field ${k} validity changed to Valid ${v.valid}, INVALID:${!v.valid}`, v.error, v);
            })
            
        }
    }, []);
    const defaultSubscription = {
        submitting: true,
        pristine: true,
        valid: true,
        invalid: true,
        validating: true,
        errors: true, //here we are adding this extra because for some reason using array form + calculator does sets form state to invalid. though its actually valid and no errors
        //registering with errors state is solving this problem as somehow that causes form to re-render.
        //TODO: needs to check performance impact of it.
    };
    const [changeBaseWage, setChangeBaseWage] = useState(
        props.record.is_change_base_wage
    );
    const [bonusType, setBonusType] = useState(
        props.record.bonus_split_type
    );
    
    const [changeNoBonusFlag, setNoBonus] = useState(
        props.record.is_include_bonus
    );
    const [changeLeadPay, setChangeLeadPay] = useState(
        props.record.is_change_lead_pay
    );
    
    const employeeFilter = {show_in_list: {_eq: true,},active: {_eq: true,}};

    const {showAlert} = usePageAlertsContext()
    const employeeHavingNoBouns = (data:any)=>{
        
        var previousData= _.map(_.filter(props.record.employee_wage_ids, (item) => {
            return item.is_remove_bonus
        }), function(o) {
            return  {id:o.id,is_remove_bonus:o.is_remove_bonus,employee_id: o.employee_id}
        });
        var newData = _.map(_.filter(data.employee_wage_ids, (item) => {
            return item.is_remove_bonus
        }), function(o) {
            return  o.is_remove_bonus && {id:o.id,is_remove_bonus:o.is_remove_bonus, employee_id: o.employee_id}
        });
        const result = _.differenceWith(newData, previousData,_.isEqual);
        return result 
    };

    const handleConfirmChange = () => {
        mutate(
            {
                type: 'update',
                resource: 'propays',
                payload: {id: props.record.id, action:'actionSendPropayChangedWorkerSms', data: {} }
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (data: any, variables: any = {}) => {
                    onSavePropay(alertData)
                },
                onFailure: (error) => {
                notify(`Failure ! ${error.message}`);
                },
            }
            );
        
    };

    const onSavePropay = (data:any) => {
        const {selectedEmployees,noBonusIds,newProPayUsers} = data;
        if(!_.isEmpty(newProPayUsers)){
            showAlert({
                key:'propay-user-enabled',
                body: <ProPayUserAlert propayUsers={newProPayUsers}/>
            })
        }
        if (_.size(selectedEmployees)) {
            showAlert({
                key:'propay-bonus-alert',
                severity:'info',
                render:(props)=><ConfirmSendSMS {...props} selectedEmployees={selectedEmployees}/>,
                data:{noBonusIds}
            })
        }
        if(props.lostFocus){
            props.lostFocus();
        }
        redirect(props.redirect);
        refresh();
    };
    const redirect = useRedirect();
    const navigate = useNavigate();

    const HandleFormCancel = (HandleForm) => {
        if(HandleForm.title === 'Edit ProPay')
        {
            setOpenConfirmDialog(true);
        }else {
            handleNavigation();
        }
    };

    const handleNavigation = () => {
        navigate(-NUMBER.ONE);
    };

    if (!loaded) return null;
    return (
        <>
        <FormWithRedirect
            {...props}
            decorators={calculator}
            initialValues={{ 
                propay_type: 'propay' ,
                bonus_split_type:identity.company?.default_bonus_split_type,
                budget_option:identity.company?.default_budget_type,
                hours_per_day:identity.company?.hours_per_day
            }}
            // debug = {debug}
            subscription={defaultSubscription}
            render={(formProps: any) => {
                return (
                    <Box>
                        <Grid container spacing={3} >
                        {props.isFromDashboard && <Grid container>
                            <Grid item xs={12} sx={{paddingLeft:3, paddingTop:5.5}}>
                                <TextInput
                                    source='name'
                                    validate={isRequired}
                                    fullWidth
                                    onFocus={onFocusPropayName}
                                    className='propayName'
                                />
                                
                            </Grid>
                        </Grid> }
                        {(!props.isFromDashboard || isExpand) && 
                        <div className='create-propay-wrapper'>                            
                            <div className='create-propay-container'>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                            <Grid className='form-padding-parent' container spacing={3} sx={{ marginBottom:10 }}>
                            <Grid className='form-padding' item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={3}>
                                    <Grid className='create-propay-top-wrap' item xs={12}>
                                        <StyledCard>
                                            <Grid container>
                                            {!isExpand && <Grid item xs={12}>
                                                    <TextInput
                                                        source='name'
                                                        label='ProPay Title'
                                                        className='title-input-propay'
                                                        validate={isRequired}
                                                        fullWidth
                                                    />
                                                </Grid>}

                                                <Grid item xs={12}>
                                                    <ReferenceInput
                                                        source='manager_id'
                                                        reference='employees'
                                                        className='manager-create-propay'
                                                        validate={isRequired}
                                                        filter={{ user_type: {_in:['manager','admin']},active: {_eq: true,} }}
                                                    >
                                                        <AutocompleteInput
                                                            fullWidth
                                                        />
                                                    </ReferenceInput>
                                                </Grid>
                                                {identity?.company?.show_job_page &&                                            
                                                <Grid item xs={12}>
                                                    <ReferenceInput
                                                        source='job_id'
                                                        validate={required()}
                                                        reference='jobs'
                                                        className='job-create-propay'
                                                        filter={{ active: {_eq:true},has_children: {_eq:false}}}
                                                    >
                                                        {/** TODO: what about tsheet here? */}
                                                        { (identity?.company?.allow_zapier_api || identity?.company?.allow_salesforce_api || identity?.company?.allow_vericlock_api || identity?.company?.allow_dataverse) ? 
                                                            <JobNameInput fullWidth />:
                                                            <JobNameInput showCreateButton={true} fullWidth create={<CreateJob />} edit={<EditJob />}/>
                                                        }
                                                    </ReferenceInput>
                                                </Grid>}
                                                {identity?.company?.tsheets_status == 'connected' && identity?.company?.show_job_page &&
                                                    <Grid container>
                                                        <Grid item xs={12} className='create-right-panel'>
                                                            <Box>
                                                                <Stack direction='row' spacing={1}>
                                                                    <BooleanInput
                                                                        source='show_to_all'
                                                                        helperText={false}
                                                                        className='toggle-accordian'
                                                                    />
                                                                    <div className='create-right-tooltip'>
                                                                        <InfoLabel className='remove-bonus-tooltip' sx={{ height: 20 }} icon='ri:error-warning-fill' height={20}>
                                                                            <Typography className='bonus-tooltip-cs'>
                                                                                Toggle on will show this propay under all jobs.
                                                                            </Typography>
                                                                        </InfoLabel>
                                                                    </div>
                                                                </Stack>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                }
                                                <Grid item xs={12}>
                                                {identity?.company?.show_job_page && identity?.company?.allow_salesforce_api &&
                                                    <FormDataConsumer 
                                                >
                                                        {({ formData, ...rest }) => {
                                                            if (formData.job_id) {
                                                                return <ReferenceArrayInputObj
                                                                source='contractor_item_ids'
                                                                reference='contractItems'
                                                                filter={{ job_id: {_eq:[formData.job_id]},active: {_eq: true,} }}
                                                                    label={translate('resources.propays.fields.contractor_item_ids')}
                                                                >
                                                                    <AutocompleteArrayInput 
                                                                       optionText={(record?: any) =>
                                                                        record?.id
                                                                            ? record.id === '@@ra-create'? record.name :`${record.name} (${record.quantity})`
                                                                            : ''
                                                                        } fullWidth multiple={false} />
                                                                </ReferenceArrayInputObj>
                                                            } else {
                                                                return <></>
                                                            }
                                                            
                                                        }}
                                                    </FormDataConsumer>
                                                }
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Grid container>
                                                        <Grid className='create-select-employee' item lg={12} md={12} sm={12} xs={12}>
                                                            <Condition when='propay_type' is='propay'>
                                                                <ReferenceArrayInputObj source='selected_employee_ids' reference='employees' filter={employeeFilter} 
                                                                validate={[validateWage]} label='resources.propays.select_worker'>
                                                                    <AutocompleteArrayInput fullWidth multiple={false} />
                                                                </ReferenceArrayInputObj>
                                                            </Condition>
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Stack direction="column">
                                                            <Grid container>
                                                                <Grid item lg={2} md={2} sm={2} xs={2}>
                                                                </Grid>
                                                                <Grid item lg={10} md={10} sm={10} xs={10} >
                                                                    <Stack direction='row' >
                                                                        <ButtonGroupInput
                                                                            source='budget_option'
                                                                            variant='standard'
                                                                            fullWidth
                                                                            defaultValue={'amount'}
                                                                            choices={BudgetChoices}
                                                                        />
                                                                        <div className='create-right-tooltip'>
                                                                        <InfoLabel className='remove-bonus-tooltip' icon='ri:error-warning-fill' height={12}>
                                                                            <Typography sx={{fontSize:10}}>
                                                                                {translate('resources.propays.budget_selection_info')} &nbsp;
                                                                                <Link target='_blank' href="https://docs.google.com/spreadsheets/d/1PTAc8trqf22LX6VYIhx_jT9kDPLrGU5TEUC9Vi5hT1k/edit#gid=1651806671" underline="always">
                                                                                read more 
                                                                                </Link> 
                                                                            </Typography> 
                                                                        </InfoLabel>
                                                                        </div>
                                                                    </Stack>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container sx={{paddingTop:1}}>
                                                                <Grid item lg={2} md={2} >
                                                                    <Stack><FieldTitle label='resources.propays.budget'/></Stack>
                                                                </Grid>
                                                                <Grid item lg={10} md={10} sm={10} xs={10} >
                                                                    <Condition when='budget_option' is='hours'> 
                                                                        <Stack>
                                                                            <MaskedTimeInput className='money-pay-input-create' fullWidth label={false} source='budget_hours' validate={[required(),validateTime]} />
                                                                        </Stack>
                                                                    </Condition>
                                                                    <Condition when='budget_option' is='amount'>
                                                                        <MoneyInput
                                                                            label=''
                                                                            fullWidth
                                                                            className='money-pay-input-create'
                                                                            source='amount'
                                                                            validate={required()}
                                                                        />
                                                                        <FormDataConsumer>
                                                                            {({ formData, ...rest }) => {
                                                                                return (
                                                                                    <Stack direction='row' className='amount-avg-text'>
                                                                                        <InfoLabel sx={{height:10}} icon='ri:error-warning-fill' height={12}>
                                                                                            <Typography sx={{fontSize:10}}>
                                                                                                {translate('resources.propays.average_hourly_daily_wage_od_all_selected_worker')}
                                                                                            </Typography> 
                                                                                        </InfoLabel>
                                                                                        <Typography sx={{fontSize:10}} color='primary' >Avg.&nbsp;</Typography> 
                                                                                        <Typography sx={{fontSize:10}} >${_.round(formData?.avg_wage_per_hr,NUMBER.TWO)}/hr,  
                                                                                        ${_.round(formData?.avg_wage_per_day,NUMBER.TWO)}/day </Typography>
                                                                                        {identity?.company?.allow_salesforce_api && 
                                                                                        <>  
                                                                                            <Typography sx={{fontSize:10}}>,</Typography>
                                                                                            <Typography  sx={{fontSize:10}} color='primary' >&nbsp;Sub Qty.&nbsp;</Typography> 
                                                                                            <Typography  sx={{fontSize:10}} >{_.round(formData?.total_qty,NUMBER.TWO)}</Typography>
                                                                                        </>
                                                                                        }
                                                                                    </Stack>
                                                                                )
                                                                            }}
                                                                        </FormDataConsumer>
                                                                    </Condition>
                                                                </Grid>
                                                            </Grid>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        {
                                                            employeeDetails.employeesArray.length > 0 &&
                                                            employeeDetails.employeesArray.map((item, index) => {
                                                                const employeeEmptyFields = employeeDetails.emptyFields[index]
                                                                const msgStr = getCommaSeperatedStringFromArray(Object.keys(employeeEmptyFields));
                                                                return (
                                                                    <Typography sx={{ color: '#ff4842', mt: 1, fontSize: '0.75rem' }}>
                                                                        {`${item.name} has no ${msgStr}`}
                                                                        <Typography component='span' sx={{ ml: 1, cursor: 'pointer', textDecoration: 'underline', fontSize: '0.75rem' }}
                                                                            onClick={() => {
                                                                                setEmpIndex(index)
                                                                                dialogRef.current.open(item)
                                                                            }
                                                                            }
                                                                        >
                                                                            click here to change.
                                                                        </Typography>
                                                                    </Typography>
                                                                )
                                                            })
                                                        }
                                                    </Grid>
                                                    <Grid
                                                                item
                                                                lg={12}
                                                                md={12}
                                                                sm={12}
                                                                xs={12}
                                                            >  
                                                        <StyledBonusSelectInput
                                                            source='bonus_split_type'
                                                            validate={required()}
                                                            choices={bonusSplitTypeSelection}
                                                            onChange={setBonusType}
                                                            className='bonus-hundred-width'
                                                        />
                                                    </Grid>

                                                    <Grid item xs={12}>
                                        <StyledCard className='create-task-sec'>
                                            <ArrayInput source='task_ids' label={false}>
                                                <StyledSimpleFormIterator disableReordering  removeColumnLabel=' '>
                                                    <TextInput
                                                        fullWidth
                                                        variant='standard'
                                                        source='name'
                                                        label='resources.propays.add_tasks'
                                                        size='small'
                                                        validate={required()}
                                                    />
                                                </StyledSimpleFormIterator>
                                            </ArrayInput>
                                        </StyledCard>                                        
                                    </Grid>
                                                    
                                                </Grid>
                                            </Grid>
                                        </StyledCard>
                                    </Grid>
                                   
                                </Grid>
                            </Grid>

                            <Grid className='form-padding' item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={3}>
                                    
                                    <Grid item xs={12} className='create-right-panel'>
                                    <Box>
                                                        <Stack direction='row' spacing={1}>
                                                            <BooleanInput
                                                                source='is_change_base_wage'
                                                                helperText={false}
                                                                onChange={setChangeBaseWage}
                                                                className='toggle-accordian'
                                                            />   
                                                            <div className='create-right-tooltip'>
                                                            <InfoLabel className='remove-bonus-tooltip' sx={{height:20}} icon='ri:error-warning-fill' height={20}>
                                                              <Typography className='bonus-tooltip-cs'>
                                                                    {translate('resources.propays.change_wage.wege_info')}
                                                              </Typography> 
                                                              </InfoLabel>                                                              
                                                         </div>                                                         
                                                        </Stack>     
                                                        {(changeBaseWage) &&
                                        <Grid item xs={12}>
                                            <StyledCard>
                                                <ArrayInput source='employee_wage_ids' label={false}>
                                                    <StyledEmployeeWageSimpleFormIterator
                                                        disableReordering
                                                        disableAdd
                                                        disableRemove
                                                    >
                                                        <StyledReferenceInput
                                                            label='resources.propays.change_wage.workers'
                                                            size='small'
                                                            variant='standard'
                                                            source='employee_id'
                                                            filter={{active: {_eq: true}}}
                                                            reference='employees'
                                                            validate={isRequired}
                                                            disabled
                                                        >
                                                            <AutocompleteInput fullWidth disabled/>
                                                        </StyledReferenceInput>
                                                        <FormDataConsumer>
                                                            {({ formData, getSource, scopedFormData, ...rest }) => {
                                                                return (
                                                                    <Field name={getSource('base_wage')}>
                                                                        {({ input: { onChange } }) => {
                                                                            wageChangeRefByEmp.current[`${scopedFormData.employee_id}`] = onChange
                                                                            return (<><StyledMoneyInput
                                                                                variant='standard'
                                                                                source={getSource('base_wage')}
                                                                                size='small'
                                                                                validate={required()}
                                                                                label='Wage'
                                                                            />
                                                                            </>)
                                                                        }}
                                                                    </Field>
                                                                )
                                                            }}
                                                        </FormDataConsumer>
                                                    </StyledEmployeeWageSimpleFormIterator>
                                                </ArrayInput>
                                            </StyledCard>
                                        </Grid>
                                    }     
                                    </Box>                                              
                                </Grid>

                                <Grid item xs={12} className='create-right-panel remove-bonus-th'>   
                                <Box>                                                    
                                                        <Stack direction='row' spacing={1}>
                                                        <BooleanInput
                                                                source='is_include_bonus'
                                                                helperText={false}
                                                                onChange={setNoBonus}
                                                                className='toggle-accordian'
                                                        />
                                                        <div className='create-right-tooltip'>
                                                            <InfoLabel className='remove-bonus-tooltip' sx={{height:20}} icon='ri:error-warning-fill' height={20}>
                                                              <Typography className='bonus-tooltip-cs'>
                                                                    {translate('resources.propays.remove_bonus.toggle_info')}
                                                              </Typography> 
                                                              </InfoLabel>                                                              
                                                         </div>
                                                        </Stack>
                                                        {(changeNoBonusFlag) &&
                                        <Grid item xs={12}>
                                            <StyledCard>
                                                <ArrayInput source='employee_wage_ids' label={false}>
                                                    <StyledEmployeeWageSimpleFormIterator
                                                        disableReordering
                                                        disableAdd
                                                        disableRemove
                                                    >
                                                        <StyledReferenceInput
                                                            label='resources.propays.remove_bonus.workers'
                                                            size='small'
                                                            variant='standard'
                                                            source='employee_id'
                                                            filter={{active: {_eq: true}}}
                                                            reference='employees'
                                                            validate={isRequired}
                                                            disabled
                                                        >
                                                            <AutocompleteInput fullWidth disabled/>
                                                        </StyledReferenceInput>                                                        
                                                        {changeNoBonusFlag && <StyledBooleanInput
                                                                            source='is_remove_bonus'
                                                                            variant='standard'
                                                                            size='small'
                                                                            label='resources.propays.remove_bonus.title'
                                                                            className='remove-bonus-tooltip'        
                                                                            helperText={false}
                                                                            infoText='resources.propays.remove_bonus.bonus_info'
                                                                    />}                                                        
                                                    </StyledEmployeeWageSimpleFormIterator>
                                                </ArrayInput>
                                            </StyledCard>
                                        </Grid>
                                    }     
                                </Box>
                                </Grid>

                                <Grid item xs={12} className='create-right-panel'>   
                                <Box>
                                        <Stack direction='row' spacing={1}>
                                            <BooleanInput
                                                source='is_change_lead_pay'
                                                label='resources.propays.leadpay.title'
                                                helperText={false}
                                                onChange={setChangeLeadPay}
                                                className='toggle-accordian'
                                            />                                                                                       
                                             <div className='create-right-tooltip'>
                                                            <InfoLabel className='remove-bonus-tooltip' sx={{height:20}} icon='ri:error-warning-fill' height={20}>
                                                              <Typography className='bonus-tooltip-cs'>
                                                                    {translate('resources.propays.leadpay.info_text')}
                                                              </Typography> 
                                                              </InfoLabel>                                                              
                                            </div> 
                                            </Stack>
                                            <StyledCard>
                                            {(changeLeadPay) &&
                                                <Grid item xs={12}>
                                                    <Grid container spacing={3}>
                                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <FormDataConsumer 
                                                            label={translate('resources.propays.fields.selected_leadpay_employee_ids')}
                                                        >
                                                            {({ formData, getSource, scopedFormData, ...rest }) => {
                                                                const filterIds = _.union(formData?.selected_employee_ids || [], formData?.manager_id ?[formData?.manager_id]:[]);
                                                                var filter = { id: {_in:filterIds} }                                                                
                                                                return (
                                                                    <ReferenceArrayInputObj 
                                                                        label={translate('resources.propays.fields.selected_leadpay_employee_ids')}
                                                                        source='selected_leadpay_employee_ids' 
                                                                        reference='employees'                                                                         
                                                                        filter={filter}
                                                                    >
                                                                        <AutocompleteArrayInput fullWidth multiple={false} />
                                                                    </ReferenceArrayInputObj>
                                                                    
                                                                   )
                                                            }}
                                                        </FormDataConsumer>

                                                        <MoneyInput
                                                                fullWidth
                                                                source='leadpay_amount'
                                                                validate={required()}                                                                
                                                            />

                                                        </Grid>

                                                    </Grid>
                                                </Grid>
                                            }
                                        </StyledCard>
                                </Box>
                                    </Grid>

                            {bonusType === 'by_percentage' && <Grid item xs={12} className='create-right-panel remove-bonus-th'>   
                                <Box>                                                    
                                                        <Stack direction='row' spacing={1}>
                                                        <Accordion>
                          <AccordionSummary
                           expandIcon={'+'}
                           aria-controls='panel1a-content'
                           id='panel1a-header'
                           >
                         <Typography>{translate('resources.propays.bonus_split.title')}</Typography>
                         <div className='create-right-tooltip'>
                                                            <InfoLabel className='remove-bonus-tooltip' sx={{height:20}} icon='ri:error-warning-fill' height={20}>
                                                              <Typography className='bonus-tooltip-cs'>
                                                                {translate('resources.propays.bonus_split.info_text')}
                                                              </Typography> 
                                                              </InfoLabel>                                                              
                                                         </div>
                         </AccordionSummary>
                           <AccordionDetails>
                                                        
                                        <Grid item xs={12}>
                                            <StyledCard>
                                                <ArrayInput source='employee_wage_ids' label={false}>
                                                    <StyledEmployeeWageSimpleFormIterator
                                                        disableReordering
                                                        disableAdd
                                                        disableRemove
                                                    >
                                                        <StyledReferenceInput
                                                            size='small'
                                                            variant='standard'
                                                            source='employee_id'
                                                            filter={{active: {_eq: true}}}
                                                            reference='employees'
                                                            validate={isRequired}
                                                            label='resources.propays.bonus_split.worker'
                                                            disabled
                                                        >
                                                            <AutocompleteInput fullWidth disabled/>
                                                        </StyledReferenceInput>
                                                        {bonusType === 'by_percentage' && <FormDataConsumer label={translate('resources.propayEmployeeWages.fields.bonus_per')}>
                                                            {({ formData, getSource, scopedFormData, ...rest }) => {
                                                                return (<StyledPercentInput
                                                                    className='bonus-split-input-group'
                                                                    source={getSource('bonus_per')}
                                                                    variant='standard'
                                                                    disabled={scopedFormData.is_remove_bonus}
                                                                    label={translate('resources.propayEmployeeWages.fields.bonus_per')}
                                                                />)
                                                            }}
                                                            </FormDataConsumer>
                                                        }
                                                    </StyledEmployeeWageSimpleFormIterator>
                                                </ArrayInput>
                                            </StyledCard>
                                        </Grid>
                                        </AccordionDetails>
                                        </Accordion>
                                        </Stack>

                                </Box>
                                </Grid>}

                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container columnSpacing={3} sx={{ marginTop: 1 }}>
                            <Toolbar                                
                                record={formProps.record}
                                invalid={formProps.invalid}
                                handleSubmit={formProps.handleSubmit}
                                handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                                saving={formProps.saving}
                                basePath={props.redirect}
                            >
                                <Button
                                        className='cancel-button-propay'
                                            variant='outlined'
                                            size='small'
                                            onClick={()=> HandleFormCancel(formProps)}                                            
                                        >
                                            {translate('resources.propays.cancel.buttonTitle')}
                                </Button>
                                {<SaveButton  onSuccess={(data)=> {
                                    notify('ra.notification.created', 'info', {
                                        smart_count: 1,
                                    });
                                    queryClient.invalidateQueries(['propays', 'getList']);
                                    const neededKeys = ['amount','name','task_ids','job_id'];
                                    const changeset = _.keys(prepareChangeset(props.record, data));
                                    const hasChange = neededKeys.some(key => changeset.includes(key))

                                    const newProPayUsers = hasNewProPayUsers({id:data.id, selected_employee_ids_obj:selectedEmployeeIdsObj}, data);
                                    const employeeNoBonusResult = employeeHavingNoBouns(data);
                                    const noBonusIds = _.map(employeeNoBonusResult,'id');
                                    const employeeIds = _.map(employeeNoBonusResult,'employee_id')
                                    const selectedEmployees = _.join(_.map(_.filter(data.selected_employee_ids_obj, (item) => {
                                        return _.includes(employeeIds, item.id)
                                    }),'name'), ',');
                                    const saveAlertData = {'newProPayUsers':newProPayUsers,'noBonusIds':noBonusIds,'selectedEmployees':selectedEmployees}
                                    if (hasChange && props?.record.id) {
                                        setAlertData(saveAlertData)
                                        setOpenConfirmChangeDialog(true)
                                    } else {
                                        onSavePropay(saveAlertData);
                                    }
                                }}/>}
                            </Toolbar>
                        </Grid>
                        </Grid>
                        </div>
                        </div>
                        }
                        </Grid>
                        <DialogForm title='Update Worker' ref={dialogRef}>
                            <EmployeeUpdateForm  onEditSuccess={(data) => {
                                dialogRef.current.close()
                                const emptyFields = employeeDetails.emptyFields[empIndex];
                                if (emptyFields?.Wages && wageChangeRefByEmp.current) {
                                    const currentEmployeeOnchange = wageChangeRefByEmp.current[data.id]
                                    if(currentEmployeeOnchange){
                                        currentEmployeeOnchange(data.base_wage)
                                    }
                                }
                            }} emptyFields={employeeDetails.emptyFields[empIndex]} />
                        </DialogForm>

                    </Box>
                );
            }}
        />        
            <ConfirmModal
                  isOpen={openConfirmChangeDialog}
                  loading={loading}
                  title='Propay Update'
                  content='Would you like to notify propay changed updates to all assigned workers?'                  
                  onClose={() => {
                    onSavePropay(alertData);
                    setOpenConfirmChangeDialog(false)
                  } }
                onConfirm={handleConfirmChange}
            />
            <ConfirmModal
                  isOpen={openConfirmDialog}
                  loading={loading}
                  title='Cancel Updates'
                  content='Are you sure you want to cancel these changes?'                  
                  onClose={() => {
                    setOpenConfirmDialog(false)
                  } }
                onConfirm={handleNavigation}
            />
        </>
    );
};
const transform = (data: any)=>{
    _.unset(data,'selected_employee_ids');
    _.unset(data,'total_qty');
    _.unset(data,'avg_wage_per_hr');
    _.unset(data,'avg_wage_per_day');
    _.unset(data,'hours_per_day');
    _.set(data, 'budget_hours',parseTime(data.budget_hours) || 0.0);
    return data;
}

const ProapyTabs = (props:any) => {
    const { permissions } = usePermissionsOptimized();
    const [currentTab, setCurrentTab] = useState('propay');
    const handleChangeTab = (newValue: string) => {
        setCurrentTab(newValue);
      };
      const checkInOutAddtime = canAccessCheckInOut({
        permissions,
        resource: 'feature_check_in_out',
    });

    const PropaysTabs = [
        {
          value: 'propay',
          component: <ProapyForm {...props}/>
        },
        {
          value: 'time',
          component: checkInOutAddtime ? 
          (<ResourceContextProvider value='attendances'>
               <AttendanceCreateDialog propayId={props.record}/>
           </ResourceContextProvider>) : (<WeeklyAddTimeForm  isFromPropayCard={true} hideKeepEditor={true} propay_id={props.record}/>)
        }
      ];

    return (
        <Page>
            <Container sx={{p:0}}>
                    <Tabs
                        value={currentTab}
                        scrollButtons='auto'
                        variant='scrollable'
                        allowScrollButtonsMobile
                        sx={{pb:1}}
                        onChange={(e, value) => handleChangeTab(value)}
                    >
                        {PropaysTabs.map((tab) => (
                            <Tab
                                disableRipple
                                key={tab.value}
                                value={tab.value}
                                label={capitalCase(tab.value)}
                            />
                        ))}
                    </Tabs>
                {PropaysTabs.map((tab) => {
                    const isMatched = tab.value === currentTab;
                    return isMatched && <Box key={tab.value}>{tab.component}</Box>;
                })}
            </Container>
        </Page>)
};

export const PropayEdit = (props: any) => {
    const { loaded } = useGetIdentity();
    const isbackend_connected = useGetBackend()

    if (!loaded) return null;
    return (<StyledEdit component='div' {...props} title={<EmptyTitle/>} mutationMode='pessimistic' transform={transform}>
        {!isbackend_connected ?
            <ProapyTabs {...props} />:
            <ProapyForm {...props} />
        }
    </StyledEdit>)
};

export const PropayCreate = (props: any) => {
    const {isFromDashboard,gotFocus, lostFocus, isExpand, ...rest} = props;
    return <StyledCreate component='div' {...rest} title={<EmptyTitle />} transform={transform}>
        <ProapyForm {...props} />
    </StyledCreate>
};
