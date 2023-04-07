import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import createDecorator from 'final-form-calculate';
import _ from 'lodash';
import moment from 'moment';
import React, { useMemo } from 'react';
import { ListActions, Record, ReferenceInput, required, ResourceContextProvider, SelectArrayInput, useRefresh } from 'react-admin';
import { FormatTimeField, HoursFormatInput } from '../../components/fields';
import { DateField } from '../../components/fields/DateField';
import { DateTimePickerInput } from '../../components/fields/DateTimePickerInput';
import { MaskedTimeInput } from '../../components/fields/MaskedTimeInput';
import { useIdentityContext } from '../../components/identity';
import Empty from '../../layout/Empty';
import { List } from '../../layout/List';
import { EditableDatagrid, RowForm } from '../../ra-editable-datagrid';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { getIntegratedNonIntegrated, StyledAutocompleteInputLarge, StyledDatePickerInput } from '../attendances/Attendance';
import { getHours } from '../attendances/getHours';
import { useAttendance } from '../attendances/useAttendance';
import { parseTime } from '../payrolls/weeklyEntries';
import { formStyle } from '../propays/Propay';
import { StyleDateTimeField } from './PropayTab';


export const NameField = ({ record }: any) => <span>{record.name}</span>;

export const StyledSelectArrayInput = styled(SelectArrayInput)({
    'min-width':'120px'
});

const StyledRowForm = styled(RowForm)({
    ...formStyle,
});

const onChangeStartAndEnd = (fieldValue:any, name:string, allValues:any):any => {
    return getHours(allValues);
};

const validateEnd = (values: any,allValues:any) => {
    if (allValues.hours <= 0) {
        return 'End Date Must be greater than start date'
    }
    return undefined;
};

const today = moment().set('second', 0).format('YYYY-MM-DD HH:mm:ss')


const ManualLabel=()=>{
    return <Typography>Manual</Typography>
};
const StartField = (props: any) => {
    const {isManual} = useAttendance(props);
    return  isManual ? <DateField className='attendence-date' source='date' isLocal={false}/>:<StartFieldByPayroll {...props} />
};
const EndField = (props: any) => {
    const {isManual} = useAttendance(props);
    return isManual ? <ManualLabel/>:<EndFieldByPayroll {...props} />
};


const AttendanceDateFieldInput=(props:any)=>{
    return <StyledDatePickerInput className='attendence-date' {...props} source='date' />
};

const AttendanceCheckInFieldInput=(props:any)=>{
    return <DateTimePickerInput className='attendence-date' source="start" validate={required()} {...props} defaultValue={today}/>
};

const StartInput = (props:any) =>{
    const {isManual} = useAttendance(props);
    return isManual? <AttendanceDateFieldInput {...props}/>:<StartInputByPayroll {...props}/>
};

const StartInputByPayroll = (props: any) => {
    const {isPayPeriod} = useAttendance(props);
    return(
        <>
        {isPayPeriod ? <ReferenceInput size="medium" source="period_id" reference="periods" label="Payroll period" className='payroll-period-time'>
        <StyledAutocompleteInputLarge source="name" />
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
const EndInputByPayroll = (props:any) => {
    const {isPayPeriod} = useAttendance(props);
    return(
        <>
         {isPayPeriod ? <Typography className='manual-responsive'>By Payroll</Typography>: 
         <DateTimePickerInput className='attendence-date' {...props} source="end" validate={[required(), validateEnd]} defaultValue={today}/> }
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
        <MaskedTimeInput source="hours" style={{ width: 55 }} variant="standard" label="" />
        : <HoursFormatInput source="hours" style={{ width: 55 }} variant="standard" label="" disabled={true} />
};



const EndInput = (props:any) =>{
    const {isManual} = useAttendance(props);
    return isManual?<ManualLabel/>: <EndInputByPayroll {...props}/>
            
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
                }
            ),
        ];
    }, []);

    const transform = (data:any) =>{
        _.set(data, 'hours',parseTime(data.hours) || 0.0);
        return data;
    };
    return (
        <StyledRowForm {...props} decorators={calculator} transform={transform}>
            <StartInput variant="standard" label=""/>
            <EndInput variant="standard" label=""/>
            <HoursInputs source="hours" style={{ width: 50 }}  variant="standard" label="" disabled={true}/>
        </StyledRowForm>                
    );
};

const IntegratedCompanyList = (props: any) => {
    return (
        <StyledRowForm {...props} >
            <StartField source="start" label="" />
            <EndField source="end" label="" />
            <FormatTimeField source="hours" />
        </StyledRowForm>
    );
};

export const AttendanceCreateRowForm = (props: any) => {
    const{ setModalOpen,modalOpen, setShowToaster, saveAlertState} = props;
    const alertState = saveAlertState ? true : false;
    React.useEffect(() => {
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

export const WorkerAttendance = (props: any) => {
    const { propayId, workerId} = props;
    const identity = useIdentityContext();
    const allowEditable = (record:Record) => {
        return record.status==='pending' && getIntegratedNonIntegrated(identity)
    };
    const refresh = useRefresh();

const handleRefresh =() => {
    refresh();
};

const [modalOpen, setModalOpen] = React.useState(false);
const [showToaster, setShowToaster] = React.useState(true);

const handleCloseModal = () => {
    setModalOpen(false);
    setShowToaster(false);
}

    return (
        <div className='attendence-modal-resource'>
            {modalOpen && 
            <div className='alert-data-msg alert-data-blue'>
                 <div className='alert-data-msg-wrap'>
                     <div className='alert-data-msg-body'>
                         <h4> Your changes will not be saved automatically, Please remember to click the 'Save' button.</h4>
                     </div>
                     <div onClick={() => handleCloseModal()} className='data-close-btn'></div>
                 </div>
             </div>
              } 
        <ResourceContextProvider value='attendances'>
        <List
            {...props}
            actions={<ListActions exporter={false} />}
            title=' '
            empty={<Empty/>}
            sort={{ field: 'create_date', order: 'DESC' }}
            filter={{employee_id: {_eq: workerId}, propay_id: {_eq: propayId},type:{_in:['regular','manual']}}}
            showPagination={false}
            perPage={NUMBER.TWOFIFTY}
        >
            <EditableDatagrid
                data-testid="store-datagrid"
                isRowDeletable={(record: any) => allowEditable(record)}
                isRowEditable = {(record: any) => allowEditable(record)}
                rowClick="edit"
                bulkActionButtons={false}
                onDeleteSuccess={handleRefresh}
                onEditSuccess={handleRefresh}
                editForm={<AttendanceCreateRowForm setModalOpen={setModalOpen} setShowToaster={setShowToaster} saveAlertState={showToaster} modalOpen={modalOpen} {...props} />}
                noEditButton={false}
                size="small"
                defaultTitle={null}
                resource="attendances"
            >
                <StartField source="start"/>
                <EndField source="end"/>
                <FormatTimeField source="hours"/>
            </EditableDatagrid>
        </List>
        </ResourceContextProvider>
        </div> 
        
    );
};
