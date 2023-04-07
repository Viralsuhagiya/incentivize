
import {
    Propay,
    allPropays,
    updatePropay,
    createPropay,
    Company_switchCompany,
    Period_runPayroll,
    Propay_approvePropay,
    Propay_markPendingPropay,
    Payroll_reOpenOne,
    Attendance_reOpenOne,
    Payroll_runPayrollOne,
    Period_reopen,
    Period_downloadPayrollReport,
    Period_downloadBonusOtReport,
    Period_downloadCsvPayrollReport,
    Period_downloadBonusExcelayrollReport,
    GetOnePartner,
    allPartners,
    AdpPayrollExportLine_resequence,
    Employee_updateShowList,
    Employee_send_invite,
    Employee_cancel_invite,
    Employee_archiveEmployee,
    Employee_activateEmployee,
    VericlockBackend_action_authenticate,
    PropayEmployeeWage_send_no_bonus_sms,
    Propay_removeEmployeeWage
} from './queries';
const mapper = {
    GET_ONE: {
        Propay: Propay,
        Partner: GetOnePartner,
    },
    UPDATE: {
        Propay: updatePropay,
        Company_switchCompany: Company_switchCompany,
        Propay_approvePropay: Propay_approvePropay,
        Propay_markPendingPropay: Propay_markPendingPropay,
        Payroll_reOpenOne:Payroll_reOpenOne,
        Attendance_reOpenOne:Attendance_reOpenOne,
        Payroll_runPayrollOne:Payroll_runPayrollOne,
        Period_reopen:Period_reopen,
        Period_runPayroll: Period_runPayroll,
        Period_downloadPayrollReport:Period_downloadPayrollReport,
        Period_downloadBonusOtReport:Period_downloadBonusOtReport,
        Period_downloadCsvPayrollReport:Period_downloadCsvPayrollReport,
        Period_downloadBonusExcelayrollReport:Period_downloadBonusExcelayrollReport,
        AdpPayrollExportLine_resequence:AdpPayrollExportLine_resequence,
        Employee_updateShowList:Employee_updateShowList,
        Employee_send_invite: Employee_send_invite,
        Employee_cancel_invite: Employee_cancel_invite,
        Employee_archiveEmployee:Employee_archiveEmployee,
        Employee_activateEmployee:Employee_activateEmployee,
        VericlockBackend_action_authenticate:VericlockBackend_action_authenticate,
        PropayEmployeeWage_send_no_bonus_sms:PropayEmployeeWage_send_no_bonus_sms,
        Propay_removeEmployeeWage: Propay_removeEmployeeWage
    },
    CREATE: {
        Propay: createPropay,
    },
    GET_LIST: {
        Propay: allPropays,
    },
    GET_MANY: {
        Propay: allPropays,
        Partner: allPartners,
    },
};

export default mapper;
