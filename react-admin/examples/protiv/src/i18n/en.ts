import { TranslationMessages } from 'react-admin';
import englishMessages from 'ra-language-english';

const customEnglishMessages: TranslationMessages = {
    ...englishMessages,
    pos: {
        search: 'Search',
        configuration: 'Configuration',
        language: 'Language',
        theme: {
            name: 'Theme',
            light: 'Light',
            dark: 'Dark',
        },
        dashboard: {
            monthly_revenue: 'Monthly Revenue',
            month_history: '30 Day Revenue History',
            new_orders: 'New Orders',
            pending_reviews: 'Pending Reviews',
            all_reviews: 'See all reviews',
            new_customers: 'New Customers',
            all_customers: 'See all customers',
            pending_orders: 'Pending Orders',
            order: {
                items:
                    'by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items',
            },
            welcome: {
                title: 'Welcome to the react-admin e-commerce demo',
                subtitle:
                    "This is the admin of an imaginary poster shop. Feel free to explore and modify the data - it's local to your computer, and will reset each time you reload.",
                ra_button: 'react-admin site',
                demo_button: 'Source for this demo',
            },
        },
        menu: {
            sales: 'Sales',
            catalog: 'Catalog',
            customers: 'Customers',
        },
    },
    menu: {
        dashboard: 'Dashboard',
        propay: 'ProPay',
        bonuses: 'Bonuses',
        reports: {
            title:'Reports',
            propay_details:'ProPay Detail',
            wage_growth:'Wage Growth',
            propay_efficiency:'ProPay Efficiency',
            bonus_report:'Bonus Report',
            propay_bonus_report:'ProPay Bonus Report',
            propay_status_report:'Propay Status Report'
        },
        addtime: 'Add Time',
        attendances: 'Time',
        team: 'Team',
        companies: 'Companies',
        jobs: 'Jobs',
        settings: 'Settings'
    },
    dashboard: {
        title:'Dashboard',
        company:'Company',
        create_propay:'Create ProPay',
        select_company:'Select Company',
        switch_company:'Switch Company',
        copy_right:'Copyright © 2023 Protiv. All rights reserved',
        onboarding: 'Onboarding',
        onboarding_info: 'Its time to complete your onboarding —', 
        check_it_out: 'check it out!',
        view_all: 'View All',
        bonuses:{
            title:'Bonuses',
            last_week:'Last Week',
            last_month:'Last Month',
            pending_bonuses:'Pending Bonuses',
            paid_bonuses:'Paid Bonuses',
            bonus:'Bonus',
            bonuses:'Bonuses'
        }
    },
    components: {
        daterangeinput:{
            startText:'From',
            endText:'To'
        }
    },
    filter:{
        search:'Search'
    },
    resources: {
        protivWageGrowthReport: {
            name: 'Wage Growth Report',
            payroll_periods:'Payroll Periods',
            worker:'Worker',
            fields: {
                dates:'Date',
                employee_id:'Name',
                standard_wage: 'Wage',
                pay_rate: 'Wage w/ Bonus',
                wage_growth_per: '%',
                wage_growth:'Wage Growth',
                period_start_date:'Dates'
            },
        },
        PropayBonusReport: {
            name: 'ProPay Bonus Report',
            paid_period:'Paid Period',
            work_period: 'Work Period',
            worker:'Worker',
            title:'Bonus Report',
            fields: {
                propay_id:'ProPay',
                employee_id:'Name',
                performance_bonus: 'Bonus',
                bonus_ot_diff_amt:'OT Diff',
                paid_period_id: 'Paid Period',
                period_id: 'Worked Period',
                bonus_earning:'Total Bonus',
                job_id:'Job',
                hours:'Hours'
            },
        },
        login: {
            sent_magic_link: 'Magic link sent!',
            magic_link_sent_preinfo: `Check your`,
            magic_link_sent_postinfo: `inbox. click the link to sign in.`,
            sign_in_without_password: 'Sign in without your password',
            sign_in_with_magic_link: 'Sign In With Magic Link',
            sign_in_info:
                'We’ll email you a link for password-free sign in to your account.',
            sign_in_manually_instead: 'sign in manually instead',
            sign_in_using_magic_link: 'sign in with magic link',
            alert_msg_info:
                'We’ll email you a magic link for a password-free sign in. Or you can.',
            wrong_email_address: 'Wrong email address? Please',
            reenter_email_address: 're-enter email address.',
            you_can: 'you can',
        },
        position:{
            fields:{
                burden_per:'Burden'
            }
        },
        jobReport:{
            name: 'Job',
            choices:{
                status:{
                    open:'Open',
                    closed:'Closed',
                }
            },
            fields:{
                total_labor_per:'%'
            }
        },
        jobs:{
            choices:{
                status:{
                    open:'Open',
                    closed:'Closed',
                }
            },
            fields:{
                name:'Name',
                revenue:'Revenue',
                labor_cost:'Labor Cost',
                burden:'Burden',
                total_labor:'Total Labor',
                total_labor_per:'%',
            }
        }, 
        protivPropayChanges:{
            fields:{
                name: 'Name', 
                status: 'Status', 
                old_name: 'Old Name', 
                new_name: 'New Name', 
                old_amount: 'Old Amount', 
                new_amount: 'New Amount', 
                old_job_id: 'Old Job', 
                new_job_id: 'New Job'
            },
            choices:{
                status:{
                    open:'Open',
                    pending:'Pending',
                    approved:'Approved',
                    paid:'Closed',
                    cancelled:'Cancelled',
                }
            },
        },
        vericlockBackend: {
            fields: {
                vericlock_api_public_key:'Public Key',
                private_key:'Private Key',
                vericlock_domain:'Domain',
                user_name:'UserName',
                password:'Password'
            },
            choices:{
                status: {
                    pending: 'Pending',
                    connected: 'Connected',
                }
            }
        },
        propayWageByBaseWage: {
            fields: {
                base_wage:'Wage',
                hours:'Hrs.',
                base_pay:'Base',
                propay_ot_amt:'OT',
                bonus:'Bonus',
                propay_earning:'Total',
                pay_rate:'PP Rate '
            },
        },
        propays: {
            name: 'ProPay',
            keep_editor_open: 'Keep editor open after save',
            keep_propay_after_save: 'Keep propay after save',
            new_propay: 'New ProPay',
            active_propay: 'Active ProPay',
            bonus_split_type:'Bonus Split Type',
            incentives_info:'Incentives sent to workers',
            income_earned_info:'Income earned from approved ProPays',
            worked_details:'Worker Details',
            personal_details:'Personal Details',
            other_worker_details:'Other Worker Details',
            propay_detail:'ProPay Detail',
            worked_assigned_propay:'All workers assigned to ProPay',
            budget_selection_info:"Each selection indicates which value is fixed. For more question",
            propay_buttons:{
                pending:'Pending',
                approved:'Approved',
                cancelled:'Cancelled',
                closed:'Closed'
            },
            bonus_choices: {
                bonus_split_type: {
                    by_hours:{
                        label:'Equal per hour',
                        info:'Bonus will be equally distributed based on the number of hours recorded'
                    },
                    by_wage:{
                        label:'% of wage',
                        info:'Bonus will be equally distributed based on the number of hours recorded and their hourly wage.',
                    },
                    by_percentage:{
                        label:'Set % distribution',
                        info:'Bonus will be divided based on the determined percentage set for each person.'
                    }
                }
            },
            fields:{
                is_include_bonus:'Remove Bonus',
                name:'Name',
                number:'Id',
                show_to_all:'Show to all',
                is_change_base_wage:'Change Wage',
                task_ids: {
                    name:'Task',
                },
                total_qty:'Total Qty.',
                contractor_item_ids:'Sub Jobs',
                employee_name_and_position:'Name / Position',
                date_range:'Date',
                manager_id:'Manager',
                actions:'Actions',
                overage:'Overage',
                create_date:'Create Date',
                assigned_date:'Assigned Date',
                hourly_rate:'Hourly Rate',
                attendances:'Attendances',
                approved_date:'Close Date',
                approved_by_id:'Approved By',
                hours:'Hours Worked',
                attendance_earning:'Base Pay',
                performance_bonus:'Add. Income',
                amount:'Total Budget',
                budget_hours:'Budget Hours',
                budget:'Total Budget',
                employee_wage_ids:'ProPay Details',
                activity:'Activity',
                attendance_only_ids:'Attendances',
                status:'Status',
                from_date:'Start Date',
                to_date:'End Date',
                by:'By',
                propay_hours:'Hours(HH:MM)',
                value:'Value',
                actuals:'Actuals',
                total_bonus_payout:'Total Bonus Payout',
                propaydetails:{
                    title:'ProPay Detail Report',
                    name:'ProPay',
                    job_id: {
                        name:'Job',
                        revenue:'Revenue',
                    },
                    earning:'Labor Cost',
                    amount:'PP Budget',
                    status:'Status'
                },
                selected_leadpay_employee_ids:'Workers'
                
            },
            actions:{
                name:'Actions',
                add_time:'Add Time',
                view_propay_details:'View ProPay Details',
                user_working_details:'Users Working Details',
                cancel_propay:'Cancel ProPay',
                delete_propay:'Delete ProPay',
                edit_propay:'Edit ProPay',
            },
            choices:{
                status:{
                    open:'Open',
                    pending:'Pending',
                    approved:'Approved',
                    paid:'Closed',
                    cancelled:'Cancelled'
                },
                budget_option:{
                    amount:'Amount',
                    hours:'Hours',
                }
            },
            cancel: {
                buttonTitle:'Cancel',
                title:'Cancel ProPay - %{name}',
                notify:{
                    title:'Would you like to notify propay cancelled alert to all assigned workers?',
                },
                content:'Are you sure you want to cancel this ProPay?',
            },
            addtime: {
                buttonTitle:'Add Time'
            },
            delete: {
                buttonTitle:'Delete',
                title:'Delete ProPay - %{name}',
                content:'Are you sure you want to delete as no hours recorded in this ProPay?',
            },
            details:{
                my_details:'My Details',
                amount_detail:'Total Team Payout'
            },
            notifications:{
                
            },
            bonus_split:{
                title: 'Bonus Split',
                info_text: 'Bonus will be divided based on the determined percentage set for each person.',
                worker: 'Worker',
            },
            remove_bonus:{
                title: 'Remove Bonus',
                workers: 'Workers',
                bonus_info:'Toggle on to remove access to any potential bonus on this ProPay. Bonuses will be distributed to only workers toggled off.',
                toggle_info: 'Toggle Yes to remove bonus from select workers. Bonus will be split with remaining workers',
            },
            change_wage:{
                wege_info: 'Change the wage of any worker for only this ProPay.',
                workers: 'Workers',
            },
            leadpay:{
                title: 'LeadPay',
                info_text: 'Additional bonus for keeping to ProPay budget. If cost exceeds ProPay budget the LeadPay will be reduced up to total bonus amount.',
            },
            propay_changes:{
                title: 'ProPay Changes',
                info : 'Propay details have been modified! Here is the breakdown of the changes.',
                change: 'Change',
            },
            user_working_details: {
                title: 'Users Working Details',
                name: 'Name',
                date: 'Date',
                hours: 'Hours',
                bonus: 'Bonus',

            },
            bonus_payroll:{
                paid_period: 'Paid Period',
                status: 'Status',
                info: 'Please add the total number of hours worked per week/days to calculate the correct overtime. Total hours should include propay hours and non propay hours.',
                bonus_report: 'Bonus Report',
                payroll_report: 'Payroll Report',
                add_time: 'Add Time',
            },
            card_listing_dashboard:{
                title: 'Title',
            },
            earning_exceed_info:'Cost incurred over the budget. Wage earnings will not be effected',
            no_propay:'-No ProPay-',
            search: 'Search',
            status: 'Status',
            manager: 'Manager',
            worker: 'Worker',
            select_worker: 'Select Worker',
            select_workers: 'Select Workers',
            budget: 'Budget',
            average_hourly_daily_wage_od_all_selected_worker: 'Average hourly and daily wage of all selected workers.',
            add_tasks: 'Add Tasks',
            wage: 'Wage',
            hours: 'Hours',
            base_pay: 'Base Pay',
            bonus: 'Bonus',
            lead_pay: 'Lead Pay',
            total: 'Total',
            propay_rate: 'ProPay Rate',
            bonus_percentage: 'Bonus [%]',
            percentage_increase: '% Increase',
            action: 'Action',
            bonus_info: '(ProPay Per hr bonus) x (Period Hrs.)=Bonus.',
            overtime_info: '(OT Rate Diff) X (Hrs)=Bonus /OT Diff.',
            view_attendances: 'View Attendances',
            
        },
        propayEmployeeWages: {
            fields:{
                base_wage:'Wage',
                hours:'Hours',
                attendance_earning:'Base Pay',
                performance_bonus:'Add. Income',
                bonus:'Bonus',
                earning:'Total',
                pay_rate:'Hourly Rate',
                propay_amount:'Propay Amount',
                bonus_per:'Bonus (%)',
                PropayStatusReport:{
                    name: 'ProPay Status Report',
                    title:'ProPay Status Report',
                    fields: {
                        propay_id:'ProPay',
                        employee_id:'Name',
                        performance_bonus: 'Bonus',
                        job_id:'Job',
                        hours:'Hours',
                        status:'Status'
                    },
                },
        
            },
        }, 
        weekEntryLines: {
            fields:{
                week_selection:'Payroll Selection',
            },
            propay: 'Propay',
            job:'Job',
            total_hours_enter_text: 'Please enter additional or total hours of the selected ProPay.',
            workers: 'Workers',
            worker: 'Worker',
            total_hours: 'Total',
            add_hours: '+Add Hours',
            approve_icon_lable: 'Approve',
            next_icon_lable: 'Next',
            overtime_record_of_worker: 'Did worker record any overtime?',
            total_hours_worked_per_week_days_text: 'Please add the total number of hours worked per week/days to calculate the correct overtime. Total hours should include propay hours and non propay hours.',
            total_hours_per_week: 'Total Hours',
            total_porpay_hours: 'Total Propay Hours: ',
            hh: 'HH',
            mm: 'MM',
            update_propay_hours: 'Update ProPay Hours', 
        },        
        timesheets:{
            name:'Timesheet'
        },
        payBonusReport:{
            title:'Pay Bonus Report'
        },
        payrolls: {
            name:'Bonuses',
            active_payroll: 'Active Payroll',
            weekly_entries:'Entries',
            worker_name: 'Worker name',
            fields:{
                number:'Id',
                period_id:'Payroll Period',
                attendance_only_idsIds:'Attendance',
                performance_bonus_only_idsIds:'Bonus /OT Diff',                
                leave_allocation_line_idsIds: 'Leave',
                retro_attendance_only_idsIds:'Retro Pay',
                total:'Total',
                regular_hours: 'Regular Hours',
                total_hours: 'Total Hours',
                break_hours: 'Break Hours',
                regular_earning:'Regular Earnings',
                bonus_ot_diff_amt:'Overtime Amount',
                performance_bonus: 'Bonus',
                bonus_earning: 'Bonus',
                total_bonus: 'Total Bonus',
                ot_amt:'Overtime Amount',
                ot_rate:'Overtime Rate',
                ot_hours:'Overtime Hours',
                total_leaves_hours:'Leave Hours',
                total_leaves_amount:'Leave Amount',
                net_earning:'Net Earnings',
                close_timesheet_button:'Lock',
                reopen_timesheet_button:'Unlock',
                gross_earning:'Gross Earning',
                retro_earning: 'Retro Earnings',
                retro_gross_earnings:'Retro Gross Earnings',
                retro_overtime: 'Retro Overtime',
                total_earning: 'Total Gross Earnings',
                gross_earnings:'Gross Earnings',
                non_propay_hours:'Non ProPay Hours',
                overtime_1_5_mul:'OT 1.5x (Daily/ Weekly)',
                overtime_2_mul:'OT 2x (Daily/ Weekly)',
                total_worked_hours:'Total Hour'
            },
            choices: {
                status: {
                    open:'Open',
                    paid:'Closed'
                }
            },
            lock:{
                title:'Lock Payroll - %{id}',
                content:'Are you sure you want to lock payroll?',
                notify:'Payroll Locked - %{id}',
            },
            unlock:{
                title:'Open Payroll - %{id}',
                content:'Are you sure you want to open payroll?',
                notify:'Payroll Opened - %{id}'
            },
            earnings:'Earnings',
        },
        periods: {
            choices: {
                status: {
                    open:'Open',
                    closed:'Closed'
                }
            },
            run: {
                buttonTitle:'Close Payroll',
                title:'Run Payroll - %{name}',
                content:'Are you sure you want to run payroll?',
                notify:'Run payroll completed - %{name}'
            },
            unlock: {
                buttonTitle:'Open Payroll',
                title:'Open Payroll Period - %{name}',
                content:'Are you sure you want to open payroll period?',
                notify:'Payroll Period Opened - %{name}'
            },
            addtime: {
                buttonTitle:'Add Time',
            }
        },
        employees:{
            name:'Team',
            fields:{
                employee_number:'Worker #',
                employee_payroll_number:'Payroll ID',
                name:'Name',
                mobile_number:'Mobile #',
                email:'Email',
                user_type:'User Type',
                role:'Role',
                base_wage:'Wage',
                is_propay_user:'Is ProPay User?',
                allow_to_add_time:'Allow To Add Time',
                effective_date:'Select an effective date',
                position_effective_date:'Select an effective date',
                position_id:'Position',
                first_name:'First Name',
                last_name:'Last Name',
                status:'Status',
                yes_value:'Active',
                no_value:'In Active',
                owner:'Primary Admin',
                import_employee:'Import Employee'
            },
            choices: {
                status: {
                    draft: 'Not yet Invited',
                    invited: 'Invite sent',
                    active: 'Active',
                    new: 'Connected (Never Login)',
                },
                active:{
                    active:'Active',
                    inactive:'In-active',
                    edit:'Edit',
                },
                user_type:{
                    'admin': 'Admin',
                    'manager': 'Manager',
                    'worker': 'Worker',
                }
            },
            action:{
                archive:'Disable',
                activate:'Activate',
                invite:'Invite',
                resend_invite:'Resend Invite',
                manageInvite:'Invite User',
            },
            notification:{
                archived_success:'Worker disabled',
                archived_error:'Error in disabling worker: %{error}',
                activated_success:'Worker activated',
                activated_error:'Error in activating worker: %{error}',
            }
        },
        attendances: {
            fields:{
                bonus_earning:'Earnings',
                propay_id:'ProPay',
                performance_bonus:'Bonus',
                bonus_description:'Description',
                performance_hours: 'Hours',
                performance_pay_rate: 'Hourly Wage',
                gross_pay:'Earning',
                regular_hours:'Regular Hours',
                ot_hours:'Overtime Hours',
                ot_amt:'Overtime',
                report_total_ot_amt:'Overtime',
                earning:'Base Pay',
                standard_wage: 'Average Standard Wage',
                pay_rate: 'Average Hourly Wage',
                wage_growth: 'Wage Growth',
                wage_growth_per: '%',
                overage:'Overage',
                capacity_hour_growth: 'Capacity Hour Growth ',
                capacity_hour_growth_per: '%',
                bonus:'Bonus',
                group_propay_earning:'Earnings',
                start:'Start',
                end:'End',
                group_by_propay_overage:'Overage',
                include_in_overtime_computation:'Include in Overtime'
            },
            overtime_info_text:'When check is shown, the total bonus will be included in the net hourly rate that computes the overtime rate. If no check is visible, it will not be included in the overtime calculation',
            keep_editor_open: 'Keep editor open after save',
            keep_employee_after_save: 'Keep worker after save',
            choices: {
                status: {
                    pending:'Pending',
                    approved:'Approved',
                    paid:'Paid'
                }
            },
            choices2: {
                status: {
                    pending:'Open',
                    paid:'Closed',
                }
            }
        },
        tsheetConnectors: {
            choices:{
                status: {
                    pending: 'Pending',
                    connected: 'Connected',
                }
            },
            fields:{
                is_propay_selection_required:'Is Propay Input Required?',
                client_id: 'Client Id',
                client_secret: 'Client Secret',
                company_identifier: 'Company Identifier',
                
            },
            title:'Configuration', 
            save: 'Save',
            disconnect: 'Disconnect',
            save_and_connect: 'Save & Connect',
        },
        salesForceBackends: {
            choices:{
                status: {
                    pending: 'Pending',
                    connected: 'Connected',
                }
            }
        },
        companies: {
            settings:{
                title:'Settings',
                overtime:{
                    title:'Overtime',
                    weekly_overtime:'Weekly Overtime',
                    first_threshold_at:'1st threshold at',
                    second_threshold_at: '2nd threshold at',
                    daily_overtime: 'Daily Overtime',
                    seventh_consecutive_overtime: 'Seventh Consecutive Overtime?',
                    first_eight_hours_at: 'First 8 hours at ',
                    times_of_hourly_rate: 'times of hourly rate.',
                    there_after_at: 'there after at ',
                    hours_for_a: 'hours for a',
                    multiple: 'multiple',
                },
                additional_settings: {
                    title: 'Additional Settings',
                    twelve_hours: '12 Hours',
                    twentyfour_hours: '24 Hours',
                    equally_per_hour: 'Equally per hour',
                    equal_percentage_increase_of_wage: 'Equal % increase of wage',
                    set_percentage_distribution: 'Set % distribution',
                },    
                worker_view:{
                    title: 'Worker View',
                },
                period:{
                    title: 'Period',
                    payroll_cycyle: 'Payroll Cycle',
                    after_period_closed_cannot_change: 'Cannot change payroll week start day and last period closing date once any period is closed.',
                    payroll_period: 'Payroll Period',
                    check_in_out: 'CheckIn / CheckOut',
                    weekly: 'Weekly',
                    bi_weekly: 'Bi-Weekly',
                    semi_monthly: 'Semi-Monthly',
                    monday: 'Monday',
                    tuesday: 'Tuesday',
                    wednesday: 'Wednesday',
                    thrusday: 'Thursday',
                    friday: 'Friday',
                    saturday: 'Saturday',
                    sunday: 'Sunday',


                },
                report:{
                    title:'Report',
                    column_name: 'Column Name',
                    code: 'code',
                    mapped_field: 'Mapped Field',
                    notify_for_mapped_field_and_code_together: "You can not have 'Mapped Field' and 'Code' together.",
                    payroll_id: 'Payroll ID',
                    employee_name: 'Employee Name',
                    payroll: 'Payroll #',
                    o_t_hours: 'O/T Hours',
                    o_t_earnings: 'O/T Earnings',
                    o_t_rate: 'O/T Rate',
                    leave_hours: 'Leave Hours',
                    leave_earnings: 'Leave Earnings',
                    total_hours: 'Total Hours',
                    regular_hours: 'Regular Hours',
                    regular_rate: 'Regular Rate',
                    regular_earnings: 'Regular Earnings',
                    bonus: 'Bonus',
                    total_gross_rate: 'Total Gross Rate',
                    total_gross_earnings: 'Total Gross Earnings',  
                } 
            },
            fields:{
                job_ids:'Job Position',
                job_page:'Job Page',
                hours_per_day:'Hours Per Day Reference',
                time_format: 'Time Format',
                payroll_week_day:'Payroll Start Day',
                last_closing_date: 'Last closing date',
                add_time_interface: 'Add time interface',
                include_ot_from_spent_total:'Include OT before calculating bonus.',
                remove_ot_diff:'Remove OT Difference.',
                additional_settings: 'Additional Settings',
                default_bonus_split_type:'Default Bonus Split',
                hours_format:'Hour Total Calculations',
                allow_all_workers_to_add_time: 'Allow all Workers to Add Time', 
                hide_bonuses_from_other_workers:'Hide bonuses from other workers',
                show_propay_detail_report:'Show ProPay Detail Report',
                enable_onboarding: 'Enable Onboarding?',
                admin_first_name: 'Admin First Name',
                admin_last_name: 'Admin Last Name',
                email: 'Email',
                phone: 'Phone',
                name: 'Name',
                allow_salesforce_api: 'allow_salesforce_api',
                allow_zapier_api: 'allow_zapier_api',
                allow_vericlock_api: 'allow_vericlock_api',
                allow_dataverse: 'Allow Dataverse Connector',

            }
        },
        propayCalculators: {
            fields:{
                name:'ProPay Calculator',
                slider_info_icon:'Use slider below to see potential bonuses on jobs!',
                no_propay_text:"Looks like you don't select any ProPay.",
                bonus_calculate_text:'Calculate Bonus for',
                total_team_pay:'Total Team Pay',
                wage:'Wage',
                worker_hours:'Worker Hours',
                propay_hours:'Propay Hours',
                no_propay_selected_text:'No ProPay Selected',
                selected_employee_id:'Workers',
                team:'Team',
                worker:'Worker',
                total_team_hours:'Total Team Hours to Complete ProPay',
                set_number_hours:'Set the number of hours',
                will_work:'will work',
                only_worker_hours:'Only Worker Hours',
                potential_bonus:'Potential Bonus',
                propay_wage:'ProPay Wage',
                increase_wage:'Increase Wage',
                increase_per:'Increase Per.',
                assuming_hours_entered:'*assuming all hours entered',
                hours_worked:'Hours Worked*',
                wage_zero:'Your wage is zero',
                worked_hours_exceed:'Your worked hours exceed maximum hours',
                max_hours:'Max Hours',
                est_hours:'Est. Hours',
                my_max_hours:'My Max Hours',
                my_est_hours:'My Est. Hours',
                my_hours_worked:'My Hours Worked*',
                team_details:'Team Details',
                team_max_hours:'Team Max Hours',
                team_est_hours:'Team Est. Hours',
                team_hours_worked:'Team Hours Worked*',
                hours_worked_included_all_team_members:'Hours worked included all team members and yourself'
            }
        },
        customers: {
            name: 'Customer |||| Customers',
            fields: {
                commands: 'Orders',
                first_seen: 'First seen',
                groups: 'Segments',
                last_seen: 'Last seen',
                last_seen_gte: 'Visited Since',
                name: 'Name',
                total_spent: 'Total spent',
                password: 'Password',
                confirm_password: 'Confirm password',
                stateAbbr: 'State',
            },
            filters: {
                last_visited: 'Last visited',
                today: 'Today',
                this_week: 'This week',
                last_week: 'Last week',
                this_month: 'This month',
                last_month: 'Last month',
                earlier: 'Earlier',
                has_ordered: 'Has ordered',
                has_newsletter: 'Has newsletter',
                group: 'Segment',
            },
            fieldGroups: {
                identity: 'Identity',
                address: 'Address',
                stats: 'Stats',
                history: 'History',
                password: 'Password',
                change_password: 'Change Password',
            },
            page: {
                delete: 'Delete Customer',
            },
            errors: {
                password_mismatch:
                    'The password confirmation is not the same as the password.',
            },
        },
        commands: {
            name: 'Order |||| Orders',
            amount: '1 order |||| %{smart_count} orders',
            title: 'Order %{reference}',
            fields: {
                basket: {
                    delivery: 'Delivery',
                    reference: 'Reference',
                    quantity: 'Quantity',
                    sum: 'Sum',
                    tax_rate: 'Tax Rate',
                    taxes: 'Tax',
                    total: 'Total',
                    unit_price: 'Unit Price',
                },
                address: 'Address',
                customer_id: 'Customer',
                date_gte: 'Passed Since',
                date_lte: 'Passed Before',
                nb_items: 'Nb Items',
                total_gte: 'Min amount',
                status: 'Status',
                returned: 'Returned',
            },
            section: {
                order: 'Order',
                customer: 'Customer',
                shipping_address: 'Shipping Address',
                items: 'Items',
                total: 'Totals',
            },
        },
        invoices: {
            name: 'Invoice |||| Invoices',
            fields: {
                date: 'Invoice date',
                customer_id: 'Customer',
                command_id: 'Order',
                date_gte: 'Passed Since',
                date_lte: 'Passed Before',
                total_gte: 'Min amount',
                address: 'Address',
            },
        },
        products: {
            name: 'Poster |||| Posters',
            fields: {
                category_id: 'Category',
                height_gte: 'Min height',
                height_lte: 'Max height',
                height: 'Height',
                image: 'Image',
                price: 'Price',
                reference: 'Reference',
                sales: 'Sales',
                stock_lte: 'Low Stock',
                stock: 'Stock',
                thumbnail: 'Thumbnail',
                width_gte: 'Min width',
                width_lte: 'Max width',
                width: 'Width',
            },
            tabs: {
                image: 'Image',
                details: 'Details',
                description: 'Description',
                reviews: 'Reviews',
            },
            filters: {
                categories: 'Categories',
                stock: 'Stock',
                no_stock: 'Out of stock',
                low_stock: '1 - 9 items',
                average_stock: '10 - 49 items',
                enough_stock: '50 items & more',
                sales: 'Sales',
                best_sellers: 'Best sellers',
                average_sellers: 'Average',
                low_sellers: 'Low',
                never_sold: 'Never sold',
            },
        },
        categories: {
            name: 'Category |||| Categories',
            fields: {
                products: 'Products',
            },
        },
        reviews: {
            name: 'Review |||| Reviews',
            amount: '1 review |||| %{smart_count} reviews',
            relative_to_poster: 'Review on poster',
            detail: 'Review detail',
            fields: {
                customer_id: 'Customer',
                command_id: 'Order',
                product_id: 'Product',
                date_gte: 'Posted since',
                date_lte: 'Posted before',
                date: 'Date',
                comment: 'Comment',
                rating: 'Rating',
            },
            action: {
                accept: 'Accept',
                reject: 'Reject',
            },
            notification: {
                approved_success: 'Review approved',
                approved_error: 'Error: Review not approved',
                rejected_success: 'Review rejected',
                rejected_error: 'Error: Review not rejected',
            },
        },
        segments: {
            name: 'Segment |||| Segments',
            fields: {
                customers: 'Customers',
                name: 'Name',
            },
            data: {
                compulsive: 'Compulsive',
                collector: 'Collector',
                ordered_once: 'Ordered once',
                regular: 'Regular',
                returns: 'Returns',
                reviewer: 'Reviewer',
            },
        },
    },
};

export default customEnglishMessages;
