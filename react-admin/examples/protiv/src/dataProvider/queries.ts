/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten
export const Propay = /* GraphQL */ `
    query Propay($id: Int!) {
        data: Propay(id: $id) {
            name
            amount
            number
            attendance_earning
            ot_amt
            performance_bonus
            earning
            status
            hourly_rate
            avg_wage_per_hr
            avg_wage_per_day
            overage
            hours
            from_date
            to_date
            active
            approved_date
            approved_by_id
            approved_by_id_obj {
                id
                __typename
            }
            propay_type
            is_ot_input_require
            budget_option
            budget
            budget_hours
            is_change_base_wage
            bonus_split_type
            is_change_lead_pay
            show_to_all
            leadpay_amount
            is_include_bonus
            company_id
            assigned_date
            message_ids {
                id
            }
            task_ids {
                id
                name
            }
            job_id
            job_id_obj {
                id
                __typename
            }
            company_id_obj {
                id
                __typename
            }
            week_selection_ids
            week_selection_ids_obj{
                id
                name
                __typename
            }
            weekly_entry_lines {
                employee_id
                propay_hours
                new_hours
                period_id
                propay_id
                id
            }
            employee_wage_ids {
                is_remove_bonus
                bonus_per
                bonus_per
                employee_id
                base_wage
                id
            }
            wage_ids {
                employee_id
                is_remove_bonus
                bonus_per
                base_wage
                hours
                id
            }
            attendance_ids {
                id
                __typename
            }
            attendance_only_ids {
                id
                payroll_id
                status
                payroll_total_worked_hours
                __typename
            }
            show_next_ot_input
            performance_bonus_only_ids {
                id
                __typename
            }
            shift_ids {
                id
                __typename
            }
            manager_id
            manager_id_obj {
                id
                __typename
            }
            selected_employee_ids
            total_qty
            contractor_item_ids_obj {
                quantity
                id
                name
                job_id
                job_id_obj {
                    id
                    __typename
                }
                __typename
            }
            contractor_item_ids
            selected_employee_ids_obj {
                id
                name
                is_propay_user
                __typename
            }
            selected_leadpay_employee_ids
            selected_leadpay_employee_ids_obj {
                id
                name
                __typename
            }
            id
            display_name
            create_uid
            create_uid_obj {
                id
                __typename
            }
            create_date
            write_uid
            write_uid_obj {
                id
                __typename
            }
            write_date
            __typename
        }
    }
`;

export const allPropays = /* GraphQL */ `
    query allPropays($filter: PropayFilter, $perPage: Int, $page: Int, $sortField: String, $sortOrder: String) {
        items: allPropays(filter: $filter, perPage: $perPage, page: $page, sortField: $sortField, sortOrder: $sortOrder) {
        name
        number
        amount
        attendance_earning
        ot_amt
        performance_bonus
        earning
        status
        hourly_rate
        avg_wage_per_hr
        avg_wage_per_day
        overage
        hours
        from_date
        to_date
        assigned_date
        active
        approved_date
        approved_by_id
        approved_by_id_obj {
            id
            __typename
        }
        propay_type
        is_ot_input_require
        budget_option
        budget
        budget_hours
        is_change_base_wage
        bonus_split_type
        is_change_lead_pay
        show_to_all
        leadpay_amount
        is_include_bonus
        company_id_obj {
            id
            __typename
        }
        week_selection_ids
        week_selection_ids_obj{
            id
            name
            __typename
        }
        weekly_entry_lines {
            employee_id
            new_hours
            propay_hours
            period_id
            propay_id
            id
        }
        employee_wage_ids {
            is_remove_bonus
            bonus_per
            bonus_per
            employee_id
            base_wage
            id
        }
        wage_ids {
            employee_id
            is_remove_bonus
            bonus_per
            base_wage
            hours
            id
        }
        message_ids {
            id
        }
        task_ids {
            id
            name
        }
        attendance_ids {
            id
            __typename
        }
        attendance_only_ids {
            id
            payroll_id
            status
            payroll_total_worked_hours
            __typename
        }
        show_next_ot_input
        performance_bonus_only_ids {
            id
            __typename
        }
        shift_ids {
            id
            __typename
        }
        manager_id_obj {
            id
            __typename
        }
        manager_id
        job_id
        job_id_obj {
            id
            __typename
        }
        total_qty
        contractor_item_ids_obj {
            quantity
            id
            name
            job_id
            job_id_obj {
                id
                __typename
            }
            __typename
        }
        contractor_item_ids
        selected_employee_ids_obj {
            id
            name
            is_propay_user
            __typename
        }
        selected_employee_ids
        selected_leadpay_employee_ids
        selected_leadpay_employee_ids_obj {
            id
            name
            __typename
        }
        id
        display_name
        create_uid_obj {
            id
            __typename
        }
        create_uid
        create_date
        write_uid_obj {
            id
            __typename
        }
        write_uid
        write_date
        __typename
        }
        total: _allPropaysMeta(filter: $filter, perPage: $perPage, page: $page) {
        count
        __typename
        }
    }  
`;


export const updatePropay = /* GraphQL */ `
    mutation updatePropay($input: PropayUpdateInput!) {
        data: updatePropay(input: $input) {
        name
        number
        amount
        earning
        status
        hourly_rate
        overage
        hours
        from_date
        to_date
        active
        approved_date
        approved_by_id
        approved_by_id_obj {
            id
            __typename
        }
        job_id
        job_id_obj {
            id
            __typename
        }
        assigned_date
        propay_type
        is_ot_input_require
        budget_option
        budget
        budget_hours
        is_change_base_wage
        bonus_split_type
        is_change_lead_pay
        show_to_all
        leadpay_amount
        is_include_bonus
        company_id_obj {
            id
            __typename
        }
        company_id
        message_ids {
            id
        }
        task_ids {
            id
            name
        }
        week_selection_ids
        week_selection_ids_obj{
            id
            name
            __typename
        }
        weekly_entry_lines {
            employee_id
            new_hours
            propay_hours
            period_id
            propay_id
            id
        }
        employee_wage_ids {
            is_remove_bonus
            bonus_per
            bonus_per
            employee_id
            base_wage
            id
        }
        wage_ids {
            employee_id
            is_remove_bonus
            bonus_per
            base_wage
            hours
            id
        }
        attendance_ids {
            id
            __typename
        }
        attendance_only_ids {
            id
            payroll_id
            status
            payroll_total_worked_hours
            __typename
        }
        show_next_ot_input
        performance_bonus_only_ids {
            id
            __typename
        }
        shift_ids {
            id
            __typename
        }
        manager_id_obj {
            id
            __typename
        }
        manager_id
        total_qty
        contractor_item_ids_obj {
            quantity
            id
            name
            job_id
            job_id_obj {
                id
                __typename
            }
            __typename
        }
        contractor_item_ids
        selected_employee_ids_obj {
            id
            name
            is_propay_user
            __typename
        }
        selected_employee_ids
        selected_leadpay_employee_ids
        selected_leadpay_employee_ids_obj {
            id
            name
            __typename
        }
        id
        display_name
        create_uid_obj {
            id
            __typename
        }
        create_uid
        create_date
        write_uid_obj {
            id
            __typename
        }
        write_uid
        write_date
        __typename
        }
    }
`;
export const createPropay = /* GraphQL */ `
    mutation createPropay($input: PropayCreateInput!) {
        data: createPropay(input: $input) {
        name
        number
        amount
        earning
        status
        hourly_rate
        overage
        hours
        from_date
        to_date
        active
        approved_date
        approved_by_id
        approved_by_id_obj {
            id
            __typename
        }
        job_id
        job_id_obj {
            id
            __typename
        }
        assigned_date
        propay_type
        is_ot_input_require
        budget_option
        budget
        budget_hours
        is_change_base_wage
        bonus_split_type
        is_change_lead_pay
        show_to_all
        leadpay_amount
        is_include_bonus
        company_id_obj {
            id
            __typename
        }
        company_id
        message_ids {
            id
        }
        task_ids {
            id
            name
        }
        week_selection_ids
        week_selection_ids_obj{
            id
            name
            __typename
        }
        weekly_entry_lines {
            employee_id
            new_hours
            propay_hours
            period_id
            propay_id
            id
        }
        employee_wage_ids {
            is_remove_bonus
            bonus_per
            bonus_per
            employee_id
            base_wage
            id
        }
        wage_ids {
            employee_id
            is_remove_bonus
            bonus_per
            base_wage
            hours
            id
        }
        attendance_ids {
            id
            __typename
        }
        attendance_only_ids {
            id
            payroll_id
            status
            payroll_total_worked_hours
            __typename
        }
        show_next_ot_input
        performance_bonus_only_ids {
            id
            __typename
        }
        shift_ids {
            id
            __typename
        }
        manager_id_obj {
            id
            __typename
        }
        manager_id
        total_qty
        contractor_item_ids_obj {
            quantity
            id
            name
            job_id
            job_id_obj {
                id
                __typename
            }
            __typename
        }
        contractor_item_ids
        selected_employee_ids_obj {
            id
            name
            is_propay_user
            __typename
        }
        selected_employee_ids
        selected_leadpay_employee_ids
        selected_leadpay_employee_ids_obj {
            id
            name
            __typename
        }
        id
        display_name
        create_uid_obj {
            id
            __typename
        }
        create_uid
        create_date
        write_uid_obj {
            id
            __typename
        }
        write_uid
        write_date
        __typename
        }
    }
`;
export const ActionMutation = (customMutationName, returnFields: string[]) => `mutation ${customMutationName}($id: Int!) {
    data:${customMutationName}(id: $id) {
        ${returnFields.join('\n')}
    }
}`
export const Company_switchCompany = ActionMutation('Company_switchCompany',['id']);
export const Propay_approvePropay = ActionMutation('Propay_approvePropay',['id','status','show_next_ot_input']);
export const Propay_markPendingPropay = ActionMutation('Propay_markPendingPropay',['id','status']);
export const Period_runPayroll = ActionMutation('Period_runPayroll',['id','status']);
export const Payroll_reOpenOne = ActionMutation('Payroll_reOpenOne',['id','status']);
export const Attendance_reOpenOne = ActionMutation('Attendance_reOpenOne',['id']);
export const Period_reopen = ActionMutation('Period_reopen',['id','status']);
export const Payroll_runPayrollOne = ActionMutation('Payroll_runPayrollOne',['id','status']);
export const Period_downloadPayrollReport = ActionMutation('Period_downloadPayrollReport',['id','status','period_report_url']);
export const Period_downloadBonusOtReport = ActionMutation('Period_downloadBonusOtReport',['id','status','period_report_url']);
export const Period_downloadCsvPayrollReport = ActionMutation('Period_downloadCsvPayrollReport',['id','status','period_report_url']);
export const Period_downloadBonusExcelayrollReport = ActionMutation('Period_downloadBonusExcelayrollReport',['id','status','period_report_url']);
export const Employee_send_invite =  ActionMutation('Employee_send_invite',['id','status','invite_id']);
export const VericlockBackend_action_authenticate =  ActionMutation('VericlockBackend_action_authenticate',['id','status']);
export const Employee_cancel_invite =  ActionMutation('Employee_cancel_invite',['id','status','invite_id']);
export const AdpPayrollExportLine_resequence = /* GraphQL */ `
  mutation adpPayrollExportLine_resequence($ids:[Int!]!) {
    data:AdpPayrollExportLine_resequence(ids: $ids) {
      id
      sequence
    }
  }
`;

export const Propay_removeEmployeeWage = /* GraphQL */ `
  mutation Propay_removeEmployeeWage($id:Int!,$employee_id:Int!,$base_wage:Float!, $selection_options: String!) {
    data:Propay_removeEmployeeWage(id: $id, employee_id: $employee_id,base_wage: $base_wage, selection_options:$selection_options) {
      id
    }
  }
`;


export const Employee_updateShowList = /* GraphQL */ `
  mutation Employee_updateShowList($ids:[Int!]!) {
    data:Employee_updateShowList(ids: $ids) {
      id
      show_in_list
    }
  }
`;
export const Employee_archiveEmployee = /* GraphQL */ `
  mutation Employee_archiveEmployee($ids:[Int!]!) {
    data:Employee_archiveEmployee(ids: $ids) {
      id
      active,
      status
    }
  }
`;
export const Employee_activateEmployee = /* GraphQL */ `
  mutation Employee_activateEmployee($ids:[Int!]!) {
    data:Employee_activateEmployee(ids: $ids) {
      id
      active,
      status
    }
  }
`;

export const PropayEmployeeWage_send_no_bonus_sms = /* GraphQL */ `
  mutation propayEmployeeWage_send_no_bonus_sms($ids:[Int!]!) {
    data:PropayEmployeeWage_send_no_bonus_sms(ids: $ids) {
      id
    }
  }
`;

export const GetOnePartner = /* GraphQL */ `
    query Partner($id: Int!) {
        data: Partner(id: $id) {
            id
            name
            email
            display_name
            active
            company_id
            company_id_obj {
                id
            __typename
            }
            create_uid
            create_uid_obj {
                id
                __typename
            }
            create_date
            write_uid
            write_uid_obj {
                id
                __typename
            }
            write_date
            __typename
        }
    }
`;


export const allPartners = /* GraphQL */ `
    query allPartners($filter: PartnerFilter, $perPage: Int, $page: Int, $sortField: String, $sortOrder: String) {
        items: allPartners(filter: $filter, perPage: $perPage, page: $page, sortField: $sortField, sortOrder: $sortOrder) {
        id
        name
        email
        display_name
        active
        company_id
        company_id_obj {
            id
            __typename
        }
        create_uid_obj {
            id
            __typename
        }
        create_uid
        create_date
        write_uid_obj {
            id
            __typename
        }
        write_uid
        write_date
        __typename
        }
        total: _allPartnersMeta(filter: $filter, perPage: $perPage, page: $page) {
        count
        __typename
        }
    }  
`;

