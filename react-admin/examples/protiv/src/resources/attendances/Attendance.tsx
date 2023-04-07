import { Box, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Theme, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import createDecorator from 'final-form-calculate';
import _ from 'lodash';
import moment from 'moment';
import { AutocompleteArrayInput, TextInput } from 'ra-ui-materialui';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    AutocompleteInput as RaAutocompleteInput, Create, Edit, FormDataConsumer, FormWithRedirect, ListActions, Record, ReferenceField, ReferenceInput,
    required, ResourceContextProvider, SaveButton, SelectArrayInput, SelectInput, TextField
} from 'react-admin';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import { DialogTitleForRecord } from '../../components/dialog-form';
import { AttendanceStatusLabelField, EditableDatagridWithPermission, FormatTimeField, FormatTimeFieldResposive, ReferenceInputObj } from '../../components/fields';
import { DateField } from '../../components/fields/DateField';
import { DateRangeInputFilter } from '../../components/fields/DateRangeInputFilter';
import { DateTimePickerInput } from '../../components/fields/DateTimePickerInput';
import { HoursInput, MinutesInput } from '../../components/fields/InputMask';
import { AutocompleteInput, DatePickerInput, HoursFormatInput } from '../../components/fields/inputs';
import { MaskedTimeInput } from '../../components/fields/MaskedTimeInput';
import { useIdentityContext, usePermissionsOptimized } from '../../components/identity';
import AddTimePage from '../../layout/AddTimePage';
import { List } from '../../layout/List';
import { ResponsiveFilterGusser } from '../../layout/ResponsiveFilter';
import { RowForm } from '../../ra-editable-datagrid';
import AutoSaveInlineForm from '../../ra-editable-datagrid/AutoSaveInlineForm';
import { canAccess, usePermissions } from '../../ra-rbac';
import { isMobile } from '../../utils/Constants/ConstantData';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { StyledReferenceArrayInput } from '../payrolls/Payrolls';
import { parseTime, StyledStack, StyleToolbar } from '../payrolls/weeklyEntries';
import { StyleDateTimeField } from '../propays';
import { formStyle, StyledCreate } from '../propays/Propay';
import AttendanceFilterModal, { AddTimeButton, FilterModalButton } from './AttendanceFilterModal';
import { HandleAttendanceImport } from './AttendanceMappingFields';
import AttendanceTeamDropdown from './AttendanceTeamDropdown';
import AttendenceCardListing from './AttendenceCardListing';
import { getHours } from './getHours';
import ImportDone from './ImportDonePage';
import { useAttendance } from './useAttendance';

export const EmployeeFullNameField = ({ record }: any) => (
    <span style={{ color: '#231F20' }}>
        {record.first_name} {record.last_name}
    </span>
);
export const NameField = ({ record }: any) => <span>{record.name}</span>;

export const StyledSelectInput = styled(SelectInput)({
    'min-width': '150px',
});

export const StyledReferenceInput = styled(ReferenceInput)({
    'min-width': '150px',
});
export const StyledAutocompleteInputLarge = styled(AutocompleteInput)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        'min-width': 'unset',
    },
    [theme.breakpoints.up('sm')]: {
        'min-width': '200px',
    }
}));

export const StyledReferenceField = styled(ReferenceField)({
    'min-width': '150px',
});

export const StyledSelectArrayInput = styled(SelectArrayInput)({
    'min-width':'120px'
});

export const StyledDatePickerInput = styled(DatePickerInput)({
   minWidth:100
});

export const ATTENDANCE_STATUS = [
    { id: 'pending', name: 'resources.attendances.choices2.status.pending' },
    { id: 'paid', name: 'resources.attendances.choices2.status.paid' },
];

/*List of filters for mobile view */
export const AttendanceFilter = [
    <TextInput className='filter-search' source='employee_id_obj.name._ilike' label='Search' alwaysOn alwaysOnMobile size='medium' />,
    <StyledReferenceArrayInput
        size="medium"
        source="employee_id._in"
        reference="employees"
        filter={{active: {_eq: false}, _or: {active: {_eq: true}}}}
        label="Worker"
        alwaysOn
    >
        <AutocompleteArrayInput source='name' />
    </StyledReferenceArrayInput>,
        <StyledSelectInput
        size='medium'
        source='status._eq'
        label='Status'
        alwaysOn
        choices={ATTENDANCE_STATUS}
        />,
    <DateRangeInputFilter source='start' alwaysOn startText={'From'} endText={'To'} />, 
    <StyledReferenceInput
    source='propay_id._eq'
    reference='propays'
    label={'ProPay'}
    size='medium'
    >
    <StyledAutocompleteInputLarge />
    </StyledReferenceInput>,
    <StyledReferenceInput
        source='job_id._eq'
        reference='jobs'
        label={'Job'}
        size='medium'
    >
        <StyledAutocompleteInputLarge optionText='full_name' />
    </StyledReferenceInput>,
    <StyledReferenceArrayInput
        source='period_id._in'
        reference='periods'
        label='Period'
        sort={{ field: 'start_date', order: 'DESC' }}
        filter={{ start_date: { _lte: moment().format('YYYY-MM-DD') } }}
    >
        <AutocompleteArrayInput source='name' />
    </StyledReferenceArrayInput>,
    
];

/*List of filters for web view */
export const AttendanceFilterWeb = [
    <TextInput className='filter-search' source='employee_id_obj.name._ilike' label='Search' alwaysOn alwaysOnMobile size='medium' />,
    <StyledReferenceArrayInput
        size="medium"
        source="employee_id._in"
        reference="employees"
        filter={{active: {_eq: false}, _or: {active: {_eq: true}}}}
        label="Worker"
        alwaysOn
    >
        <AutocompleteArrayInput source='name' />
    </StyledReferenceArrayInput>,
        <StyledSelectInput
        size='medium'
        source='status._eq'
        label='Status'
        alwaysOn
        choices={ATTENDANCE_STATUS}
        />,
        <StyledReferenceInput
            source='propay_id._eq'
            reference='propays'
            label={'ProPay'}
            size='medium'
            alwaysOn
        >
        <StyledAutocompleteInputLarge />
        </StyledReferenceInput>,
        <StyledReferenceInput
                source='job_id._eq'
                reference='jobs'
                label={'Job'}
                size='medium'
                alwaysOn
            >
          <StyledAutocompleteInputLarge optionText='full_name' />
       </StyledReferenceInput>
];

const StyledRowForm = styled(RowForm)({
    ...formStyle,
});

const onChangeStartAndEnd = (fieldValue:any, name:string, allValues:any):any => {
    return getHours(allValues);
};

const validateEnd = (values: any,allValues:any) => {
    if (allValues.hours <= 0) {
        return 'End Date Must be greater than start date'
    };
    return undefined;
};

const onChangeJob = async (fieldValue:any, name:string, allValues:any) => {
    const result:any = {};
    if (allValues?.propay_id_obj?.job_id !== fieldValue){
        result['propay_id'] = null
    };
    return result;
}; 
const PropayInput = (props: any) => {
    const { state } = useLocation();
    return <FormDataConsumer >
    {({ formData,getSource, ...rest }) => {
        var filter = { status: {_in:['pending','approved']} }
        if (formData.job_id){
            filter['job_id'] = {_eq:[formData.job_id]}
        };
        const propayId = props?.propayId?.id ? true : false; 
        return(
            <ReferenceInputObj source='propay_id' disabled={propayId || state?.record?.id} allowEmpty filter={filter} reference='propays' {...props}>
                <StyledSelectInput/>
            </ReferenceInputObj>
            )
    }}
    </FormDataConsumer>
};

const JobInput = (props: any) => {
    const { state } = useLocation();
    return <StyledReferenceInput source='job_id' disabled={props?.propayId?.job_id || state?.record?.job_id} emptyValue={0} 
    filter={{ has_propay: { _eq: true },active: {_eq:true},has_children: {_eq:false} }} allowEmpty reference="jobs" {...props} >
        <StyledSelectInput optionText='full_name'/>
    </StyledReferenceInput>
};

const today = moment().set('second', 0).format('YYYY-MM-DD HH:mm:ss')
const todayDateOnly = moment().format('YYYY-MM-DD');


const ManualLabel=()=>{
    return <Typography>Manual</Typography>
};
const ManualLabelResponsive=()=>{
    return <Typography className='manual-responsive'><label>End</label>Manual</Typography>
};
const StartField = (props: any) => {
    const {isManual} = useAttendance(props);
    return  isManual ? <DateField className='attendence-date' source='date' isLocal={false}/>:<StartFieldByPayroll {...props} />
};
const StartFieldResponsive = (props: any) => {
    const {isManual} = useAttendance(props);
    return  isManual ? <Typography className='manual-responsive'><label>Start</label>
    <DateField className='attendence-date' source='date' isLocal={false}/>
    </Typography>
    : <StartFieldByPayrollResponsive {...props} />
};
const EndField = (props: any) => {
    const {isManual} = useAttendance(props);
    return isManual ? <ManualLabel/>:<EndFieldByPayroll {...props} />
};
const EndFieldResponsive = (props: any) => {
    const {isManual} = useAttendance(props);
    return isManual ? <ManualLabelResponsive/>:<EndFieldPayrollResponsive {...props} />
};

const EndFieldPayrollResponsive = (props: any) => {
    const {isPayPeriod} = useAttendance(props);
    return(
        <>
         {isPayPeriod ? <Typography className='manual-responsive'><label>End</label>By Payroll</Typography> : 
         <Typography className='manual-responsive'><label>End</label><StyleDateTimeField className='attendence-date' source='end' /></Typography> }
        </>
    )
};


const AttendanceDateFieldInput=(props:any)=>{
    return <StyledDatePickerInput className='attendence-date' {...props} source='date' />
};

const AttendanceCheckInFieldInput=(props:any)=>{
    return <DateTimePickerInput className='attendence-date' source='start' validate={required()} {...props} defaultValue={today}/>
};

const StartInput = (props:any) =>{
    const {isManual} = useAttendance(props);
    return isManual? <AttendanceDateFieldInput {...props}/>:<StartInputByPayroll {...props}/>
};

const StartInputByPayroll = (props: any) => {
    const {isPayPeriod} = useAttendance(props);
    return(
        <>
        {isPayPeriod ? <ReferenceInput size='medium' source='period_id' reference='periods' label='Payroll period' className='payroll-period-time'>
        <StyledAutocompleteInputLarge source='name' />
        </ReferenceInput>: <AttendanceCheckInFieldInput {...props}/>}
        </>
    )
};
const StartFieldByPayroll = (props: any) => {
    const {isPayPeriod} = useAttendance(props);
    return(
        <>
         {isPayPeriod ? <DateField className='attendence-date' source='period_start_date' isLocal={false}/> : <StyleDateTimeField className='attendence-date' source='start' />}
        </>
    )
};
const StartFieldByPayrollResponsive = (props: any) => {
    const {isPayPeriod} = useAttendance(props);
    return(
        <>        
         {isPayPeriod ? <Typography className='manual-responsive'><label>Start</label>
         <DateField className='attendence-date attendence-date-Typography' label='Start' source='period_start_date' isLocal={false}/>
         </Typography>
         : <Typography className='manual-responsive'><label>Start</label><StyleDateTimeField className='attendence-date' source='start' /></Typography>}
        </>
    )
};
const EndInputByPayroll = (props:any) => {
    const {isPayPeriod} = useAttendance(props);
    return(
        <>
         {isPayPeriod ? <Typography className='manual-responsive'>By Payroll</Typography>: 
         <DateTimePickerInput className='attendence-date' {...props} source='end' validate={[required(), validateEnd]} defaultValue={today}/> }
        </>
    )
};
const EndFieldByPayroll = (props: any) => {
    const {isPayPeriod} = useAttendance(props);
    return(
        <>
         {isPayPeriod ? <DateField className='attendence-date' source='period_end_date' isLocal={false}/> : 
         <StyleDateTimeField className='attendence-date' source='end' />}
        </>
    )
};

const HoursInputs = (props: any) => {
    const {isManual, isPayPeriod} = useAttendance(props)
    return isManual || isPayPeriod ?
        <MaskedTimeInput source='hours' style={{ width: 55 }} variant='standard' label='' />
        : <HoursFormatInput source='hours' style={{ width: 55 }} variant='standard' label='' disabled={true} />
};

const HoursInputResponsive = (props: any) => {
    const {isManual, isPayPeriod} = useAttendance(props)
    return isManual || isPayPeriod ?
        <MaskedTimeInput source='hours' style={{ width: 55 }} variant='standard' label='Hours' />
        : <HoursFormatInput source='hours' style={{ width: 55 }} variant='standard' label='Hours' disabled={true} />
};

const EndInput = (props:any) =>{
    const {isManual} = useAttendance(props);
    return isManual?<ManualLabel/>: <EndInputByPayroll {...props}/>
            
};

const EndInputResponsive = (props:any) =>{
    const {isManual} = useAttendance(props);
    return isManual?<ManualLabelResponsive/>:< EndInputByPayroll {...props}/>
};

const EmployeeField = (props:any)=>{
    return  (<StyledReferenceField label='Name' source='employee_id' reference='employees' link={false}>
                <TextField source='name'/>
            </StyledReferenceField>)
};
const ZapierList = (props:any) => {
    const calculator = useMemo(() => {
        return [
            createDecorator(
                {
                    field: 'start',
                    updates: onChangeStartAndEnd,
                },
                {
                    field: 'end',
                    updates: onChangeStartAndEnd,
                },
                {
                    field:'job_id',
                    updates: onChangeJob,
                },
            ),
        ];
    }, []);

    const transform = (data:any) =>{
        _.set(data, 'hours',parseTime(data.hours) || 0.0);
        return data;
    };
    return (
        <StyledRowForm {...props} decorators={calculator} transform={transform}>
            <EmployeeField/>
            <StartInput variant='standard' label='Start'/>
            <EndInput variant='standard' label='End'/>
            <HoursInputs source='hours' style={{ width: 50 }}  variant='standard' label='' disabled={true}/>
            <JobInput variant='standard' label='' />
            <PropayInput  variant='standard' label='' />
            <AttendanceStatusLabelField source='status' colors={{'paid':'success'}}/>
        </StyledRowForm>                
    );
};

const IntegratedCompanyList = (props: any) => {
    return (
        <>
        <StyledRowForm {...props} >
            <EmployeeField label='Worker' />
            <StartField source='start' label='Start' />
            <EndField source='end' label='End' />
            <FormatTimeField source='hours' />
            <StyledReferenceField source='job_id' reference='jobs' link={false}>
                <TextField source='full_name' />
            </StyledReferenceField>
            <PropayInput variant='standard' label='' source='propay_id' />
            <AttendanceStatusLabelField source='status' colors={{ 'paid': 'success' }} />
        </StyledRowForm>
        </>
    );
};

export const AttendanceCreateRowForm = (props: any) => {
    const{ setModalOpen,modalOpen, setShowToaster, saveAlertState} = props;
    const alertState = saveAlertState ? true : false;
    useEffect(() => {
        setModalOpen(alertState);
        setTimeout(() => {
        setModalOpen(false);
        setShowToaster(false);
        },
         NUMBER.SIX_THOUSAND)
    },[setModalOpen, modalOpen, alertState, setShowToaster])

    const identity = useIdentityContext();
    return getIntegratedNonIntegrated(identity) ?
        <ZapierList {...props} /> :
        <IntegratedCompanyList {...props} />
};

const StyledEditableDatagridWithPermission = styled(EditableDatagridWithPermission)({
    '.column-status' : {width: '0%'}
});


const AttendanceList = (props: any) => {
    const { pathname } = useLocation();
    const { permissions } = usePermissionsOptimized();
    const checkInOutAddtime = canAccessCheckInOut({
        permissions,
        resource: 'feature_check_in_out',
    });
    const isMobileDevice = isMobile();
    return (
        <>        
        { pathname === '/attendances' && (isMobileDevice ? <AttednadnceResponsive {...props} /> : 
               <AttendanceListWithResponsive {...props}/>) }
        <Routes>
        <Route path='create' element={
            checkInOutAddtime ? 
            (<ResourceContextProvider value='attendances'>
                 <AttendanceCreateDialog />
             </ResourceContextProvider>) :
             (<AddTimePage/>)
         }/>
         <Route path=':id/edit' element={
             <ResourceContextProvider value='attendances'>
                 <AttendanceEditDialog />
             </ResourceContextProvider>
         }/>
         <Route path="import" element={
             <ResourceContextProvider value="attendances">
                 <HandleAttendanceImport />
             </ResourceContextProvider>
         }/>
          <Route path='import/:id/done' element={
             <ResourceContextProvider value='attendances'>
                 <ImportDone />
             </ResourceContextProvider>
         }/>
        </Routes>     
        </> 
    );
};
export default AttendanceList;

const AttednadnceResponsive = (props: any) => {
    const identity = useIdentityContext();
    const { loading, permissions } = usePermissions();
    const showCreate = !loading && getIntegratedNonIntegrated(identity) && canAccess({
        permissions,
        resource: 'attendances',
        action: 'create',
    }) 

    return(

        <div className='attendence-wrapper'> 
        <h2 className='MuiTypography-root MuiTypography-h2 main-title main-title-mobile'>Time</h2>            
        <List
            {...props}
            title='Attendance'
            titleActionProps={{ label:'Add Time',showCreate: showCreate}}
            filterDefaultValues={{status:{_eq:'pending'}}}
            actions={<ListActions exporter={false} />}
            filters={<ResponsiveFilterGusser filters={AttendanceFilter}/>}
            sort={{ field: 'create_date', order: 'DESC' }}
            filter={{type:{_in:['regular','manual']}}}
            className='attendence-page'
            emptyWhileLoading
        >
        <AttendenceCardListing />
        </List>
        </div>
    );
};

const AttendanceListWithResponsive = (props:any) => {

    const identity = useIdentityContext();
    const { loading, permissions } = usePermissions();
    const showCreate = !loading && getIntegratedNonIntegrated(identity) && canAccess({
        permissions,
        resource: 'attendances',
        action: 'create',
    })
    const allowEditable = (record:Record) => {
        return record.status==='pending' && identity?.allow_to_add_time && !record.locked;
    };
    const [filterCount, setFilterCount] = useState(NUMBER.ZERO);

    const [modalOpen, setModalOpen] = useState(false);
    const [showToaster, setShowToaster] = useState(true);

    const [anchorEl, setAnchorEl] = useState(null);
    const showModal = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const isMobileDevice = isMobile();
    const handleCloseModal = () => {
        setModalOpen(false);
        setShowToaster(false);
    };
  
    return (
        <>
        {modalOpen && 
            <div className='alert-data-msg alert-data-blue'>
                 <div className='alert-data-msg-wrap'>
                     <div className='alert-data-msg-body'>
                         <h4> Your changes will not be saved automatically, Please remember to click the 'Save' button.</h4>
                     </div>
                     <div onClick={() => handleCloseModal()} className='data-close-btn'>X</div>
                 </div>
             </div>
              }     
        <div className='attendence-wrapper'>   
        <h2 className='MuiTypography-root MuiTypography-h2 main-title main-title-mobile'>Time</h2>    
        <FilterModalButton handleShow={handleClick} filterCount={filterCount} {...props}/>
        {showCreate && <AddTimeButton />}
        <List
            {...props}
            title='Attendance'
            titleActionProps={{ showCreate: false}}
            filterDefaultValues={{status:{_eq:'pending'}}}
            actions={(isMobileDevice || !getIntegratedNonIntegrated(identity)) ? <ListActions exporter={false}/> : <AttendanceTeamDropdown/>}             
            filters={<ResponsiveFilterGusser filters={AttendanceFilterWeb}/>}
            sort={{ field: 'create_date', order: 'DESC' }}
            filter={{type:{_in:['regular','manual']}}}
            className='attendence-page'
        >            
            <>            
            <AttendanceFilterModal show={showModal} handleClose={handleClose} anchorEl={anchorEl} setFilterCount={setFilterCount} {...props} />            
            <StyledEditableDatagridWithPermission
                data-testid='store-datagrid'
                isRowDeletable={(record: any) =>getIntegratedNonIntegrated(identity) && allowEditable(record)}
                isRowEditable = {(record: any) =>allowEditable(record)}
                rowClick='edit'
                editForm={<AttendanceCreateRowForm setModalOpen={setModalOpen} setShowToaster={setShowToaster} saveAlertState={showToaster} modalOpen={modalOpen}/>}
                size='small'
                defaultTitle={null}
                resource='attendances'
            >
                <StyledReferenceField label='Name' source='employee_id' sortBy='employee_id' reference='employees' link={false}>
                 <TextField source='name'/>
                </StyledReferenceField>
                <StartField source='start'/>
                <EndField source='end'/>
                <FormatTimeField source='hours'/>
                <StyledReferenceField source='job_id' reference='jobs' link={false}>
                    <TextField source='full_name'/>
                </StyledReferenceField>
                <StyledReferenceField source='propay_id' reference='propays' link={false}>
                    <TextField source='name'/>
                </StyledReferenceField>
                <AttendanceStatusLabelField source='status' colors={{'paid':'success'}}/>               
            </StyledEditableDatagridWithPermission>
            </>
        </List>
        </div>
        </>
    )
};

export const AttendanceCreateDialog = (props: any) => {
    const navigate = useNavigate();
    const { permissions } = usePermissionsOptimized();
    
    const AddtimePermission = canAccess({
        permissions,
        resource: 'feature_check_in_out',
        action:'*',
    });

    if(!AddtimePermission){
        navigate('/attendances');
    };
    
    return (
        <Create  {...props} mutationMode={'pessimistic'} component='div' title={<DialogTitleForRecord title='Add Time' />} >
            <AttendanceDialogForm {...props}/>
        </Create>
    );
};

const AttendanceEditDialog = (props: any) => {
    const transform = (data:any) =>{
        _.set(data, 'hours',parseTime(data.hours) || 0.0);
        return data;
    };   

    return (
        <Edit component='div' {...props} title=' ' mutationMode='pessimistic' transform={transform}>
            <AttendanceEditDailogForm {...props}/>
        </Edit>
    );
};

const AttendanceEditDailogForm = (props: any) => {
    const identity = useIdentityContext();
    return getIntegratedNonIntegrated(identity) ?
        <ZappierListResponsive {...props} /> :
        <IntegratedCompanyResponsive {...props} />
};

const ZappierListResponsive = (props) => {
    const navigate = useNavigate();    
    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    if(!isSmall) {
        navigate('/attendances')
    }
    const calculator = useMemo(() => {
        return [
            createDecorator(
                {
                    field: 'start',
                    updates: onChangeStartAndEnd,
                },
                {
                    field: 'end',
                    updates: onChangeStartAndEnd,
                },
                {
                    field:'job_id',
                    updates: onChangeJob,
                },
            ),
        ];
    }, []);

    const transform = (data:any) =>{
        _.set(data, 'hours',parseTime(data.hours) || 0.0);
        return data;
    };   
    return (
        <div className='attendence-create-page'>
        <Typography variant='h2' className='main-title main-title-mobile'>
        <span className='back-button-attendence' onClick={()=> navigate(-NUMBER.ONE)}>Back</span> 
        Edit Attendance</Typography>
        <div className='attendence-create-wrapper'>
        <FormWithRedirect 
        {...props} 
        decorators={calculator} 
        transform={transform}
        render={(formProps: any) => {
                    return (
                        <Grid container>
                    
                        <Grid item xs={12}>
                            <ReferenceInput source='employee_id' reference='employees' label='Worker'>
                                <RaAutocompleteInput fullWidth label={false} disabled={props.record.id}/>
                            </ReferenceInput>
                        </Grid> 
    
                        <Grid item xs={12}>
                            <JobInput fullWidth label='Job' />
                            </Grid>  
    
                        <Grid item xs={12}>                    
                            <PropayInput fullWidth label='ProPay'/>
                        </Grid>
                            
                            <Grid className='add-job-date-field add-job-date-field-modal' item xs={12}>
                            <StartInput variant='standard' label='Start' {...props}/>
                            </Grid>

                            <Grid className='add-job-date-field add-job-date-field-modal' item xs={12}>
                            <EndInputResponsive variant='standard' label='End' {...props}/>
                            </Grid>
                            <Grid className='add-job-date-field add-job-date-field-modal' item xs={12}>
                            <HoursInputResponsive source='hours' variant='standard' label='' disabled={true} {...props}/>
                            </Grid>
                            
                            <Toolbar>
                        <Box className='add-time-footer' display='flex' justifyContent='space-between' width='100%'>
                            <SaveButton
                                saving={formProps.saving}
                                handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                            />
                        </Box>
                        </Toolbar>
    
                        </Grid>)
                }}
            />
            </div></div>);
};

const IntegratedCompanyResponsive = (props: any) => {
            const navigate = useNavigate();
               return (
                <div className='attendence-create-page'>
                <Typography variant='h2' className='main-title main-title-mobile'>
                <span className='back-button-attendence' onClick={()=> navigate(-NUMBER.ONE)}>Back</span>
                    Edit Attendance
                </Typography>
                <div className='attendence-create-wrapper'>
            <FormWithRedirect {...props}                             
                render={(formProps: any) => {
                    return (

                    <Grid container>
                    
                    <Grid item xs={12}>
                        <ReferenceInput source='employee_id' reference='employees' label='Worker'>
                            <RaAutocompleteInput fullWidth label={false} disabled={props.record.id}/>
                        </ReferenceInput>
                    </Grid> 

                    <Grid item xs={12}>
                        <JobInput fullWidth label='Job' />
                        </Grid>  

                    <Grid item xs={12}>                    
                        <PropayInput fullWidth label='ProPay'/>
                    </Grid>
                        
                        <Grid className='add-job-date-field add-job-date-field-modal' item xs={12}>
                        <StartFieldResponsive source='start' label='Start' {...props}/>                        
                        </Grid>

                        <Grid className='add-job-date-field add-job-date-field-modal' item xs={12}>
                        <EndFieldResponsive source='end' label='End' {...props}/>                                   
                        </Grid>
                        <Grid className='add-job-date-field add-job-date-field-modal' item xs={12}>
                        <FormatTimeFieldResposive source='hours' {...props}/>
                        </Grid>
                        <Toolbar>
                    <Box className='add-time-footer' display='flex' justifyContent='space-between' width='100%'>
                        <SaveButton
                            saving={formProps.saving}
                            handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                        />
                    </Box>
                    </Toolbar>
                    </Grid>
                )
                }}
            />
            </div></div>);
    }; 
    
const AddtimeFormDataTransform = (formData) => {
        const { hours, minutes } = formData;
        const timeHours = parseFloat(hours);
        const timeMinutes = parseFloat(minutes);
        if (timeMinutes) {
            let strminutes = timeMinutes/NUMBER.SIXTEY || 0.0;
            let time = timeHours + strminutes
            return time;
        } else {
            return timeHours;
        }
};

const AttendanceDialogForm = (props: any) => {
const navigate = useNavigate();
const {state} = useLocation();

const oncangeDecorator = useMemo(() => {
    return [
        createDecorator(
           
            {
                field: 'start',
                updates: onChangeStartAndEnd,
            },
            {
                field: 'end',
                updates: onChangeStartAndEnd,
            },
            {
                field:'job_id',
                updates: onChangeJob,
            },
        )
    ];
}, []);

const employeeFilter = {active: {_eq: true,}};
const [addTimeType, setAddTimeType] = useState('TIMEINOUT');

const dialogRef: any = useRef();
dialogRef.current = addTimeType;

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dialogRef.current = event.target.value;
    setAddTimeType(event.target.value);
  };

const transform = (data:any) =>{
    if(dialogRef.current !== 'TIMEINOUT'){
        delete data.start;
        delete data.end;
    }
    else{
        delete data.date;
    }
    if(dialogRef.current === 'DURATION'){
        _.set(data, 'hours',AddtimeFormDataTransform(data) || 0.0)
    };
    delete data.minutes;
    return data;
};     
return (
    <div className='attendence-create-page'>
    {(!props?.propayId?.id || state?.record?.id) && <Typography variant='h2' className='main-title main-title-mobile'>
    <span className='back-button-attendence' onClick={()=> navigate(-NUMBER.ONE)}>Back</span>
        Add Time
    </Typography>}
    <div className='attendence-create-wrapper'>
    <StyledCreate component='div' title=' ' transform={transform}>            
    <FormWithRedirect 
        decorators={oncangeDecorator}
        initialValues={{ propay_id: props?.propayId?.id || state?.record?.id, job_id: props?.propayId?.job_id || state?.record?.job_id}}
        redirect='list'
        render={(formProps: any) => {
            return (
                <>
                <Grid spacing={4} container>
                
                <Grid item lg={6} xs={12}>
                    <ReferenceInput source='employee_id' reference='employees' label='Worker' validate={required()} filter={employeeFilter}>
                        <RaAutocompleteInput fullWidth label={false} />
                    </ReferenceInput>
                </Grid> 

                <Grid item lg={6} xs={12}>
                    <JobInput fullWidth label='Job' {...props}/>
                    </Grid>  

                <Grid item lg={6} xs={12}>
                <FormLabel className='add-time-label hidden-add-time'>&nbsp;</FormLabel>
                    <PropayInput fullWidth label='ProPay' {...props}/>
                </Grid>
                   
                    <Grid className='add-time-type' item lg={6} md={6} sm={6} xs={12}>
                            <FormControl>
                                <FormLabel className='add-time-label'>Type</FormLabel>
                            <RadioGroup
                                    row
                                    aria-labelledby='radio-buttons-type-group-label'
                                    name='row-radio-buttons-group' 
                                    value={addTimeType}
                                    onChange={handleChange}                                       
                                >
                                    <FormControlLabel value='TIMEINOUT' control={<Radio />} label='Time In/Out' />
                                    <FormControlLabel value='DURATION' control={<Radio />} label='Duration' />
                                </RadioGroup>
                                </FormControl>
                    </Grid>
                    
                    {addTimeType === 'TIMEINOUT' && <>
                    <Grid className='add-job-date-field' item lg={6} xs={12}>
                    <StartInput />                                        
                    </Grid>

                    <Grid className='add-job-date-field' item lg={6} xs={12}>
                    <EndInput />
                    </Grid> 
                    </>    
                    }  
                    
                    {addTimeType === 'DURATION' && <>
                    <Grid className='add-job-date-field' item lg={6} xs={12}>
                    <StyledDatePickerInput className='attendence-date' {...props} source='date' defaultValue={todayDateOnly}/>
                    </Grid>
                    <Grid className='add-time-hour-field' item lg={6} xs={12}>
                        <StyledStack className='' direction='row'>
                        <HoursInput variant='standard' source='hours' label='HH' validate={required()}/>
                        <MinutesInput variant='standard' source='minutes' label='MM'/>
                        </StyledStack>
                    </Grid>
                    </> }
                </Grid>
                 <Box className='add-time-footer' display='flex' justifyContent='space-between' width='100%'>
                 <Grid className='padding_toolbaar' item lg={12} md={12} sm={12} xs={12} sx={{ marginTop: 0 }}>
                 <StyleToolbar                                
                            record={formProps.record}
                            invalid={formProps.invalid}
                            handleSubmit={formProps.handleSubmit}
                            handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                            saving={formProps.saving}
                            basePath={props.redirect}
                        >
                            <SaveButton saving={false}/>
                        </StyleToolbar>
                         </Grid>    
                 </Box>
                </>
                )
        }}
    />    
    </StyledCreate>
    </div></div>);        
};

/*function to find out if company is integrated or not */
export const getIntegratedNonIntegrated = (companyData: any) => {
    if(companyData?.company?.allow_zapier_api){
        return true; 
    }
    else if(companyData?.company?.allow_dataverse){
        //TODO: this is very bad way of doing this, using this all flags on the UI side at lot of places
        //not sure whats the purpose for this
        //but looks like its for not allowing to add/edit time for attendance for integrated companies
        return false;
    }
    else if((companyData?.company?.allow_salesforce_api || companyData?.company?.allow_vericlock_api ||
               companyData?.company?.tsheets_status === 'connected') && !companyData?.company?.allow_zapier_api){
        return false;
    }else{
        return true;
    }
};

/*function to find out if company can access check- in/out add time interface or not*/
export const canAccessCheckInOut = ({
    permissions,
    resource,
}: {
    permissions: any;
    resource: string;
}): boolean => {
    
    const featureFlag = permissions.filter((flag) => flag.resource === resource);
    if(featureFlag?.length > NUMBER.ZERO){
            if(featureFlag[NUMBER.ZERO]?.resource === resource && featureFlag[NUMBER.ZERO]?.type === 'allow'){
                return true;
            }else{
                return false;
            }
    }else{
        return false;
    }
};
