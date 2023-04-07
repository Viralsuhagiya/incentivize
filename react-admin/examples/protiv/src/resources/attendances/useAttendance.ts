import { Record } from 'react-admin'

const isManualAttendance = (record:Record) => {
    return record ? (record.add_time_interface === 'check_in_out' && !record.start):false
}
const isPayPEriodAttendance = (record:Record) => {
    return record ? (record.add_time_interface === 'payroll_period' && !record.start ) : false
}

const getStatusInfo = (record:Record) => {
    return record && record.locked && record.propay_status!=='paid' ? 'Attendance is marked approved in QuickBooks time, Please unapprove in QB time to modify' :''
}

export const useAttendance = (props:any)=>{
    const {record} = props;
    const isManual = isManualAttendance(record);
    const isPayPeriod = isPayPEriodAttendance(record);
    const statusInfo = getStatusInfo(record);
    return {isManual,statusInfo, isPayPeriod};
};