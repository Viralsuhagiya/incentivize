import { TranslationMessages } from 'react-admin';
import RaSpanishMessages from './ra_es';
import spanishMessages from 'ra-language-spanish';

const customEnglishMessages: TranslationMessages = {
    ...spanishMessages,
    ...RaSpanishMessages,
    pos:{
        search:'Busqueda',
        configuration:'Configuración',
        language:'Idioma',
        theme:{
           name:'Tema',
           light:'Claro',
           dark:'Oscuro'
        }
     },
      menu: {
         dashboard: 'Dashboard',
         propay: 'ProPay',
         bonuses: 'Bonuses',
         reports: 'Reports',
         addtime: 'Add Time',
         attendances: 'Attendances',
         team: 'Team',
         companies: 'Companies',
         jobs: 'Jobs',
         settings: 'Settings'
      },
     resources:{
        protivWageGrowthReport:{
           name:'Informe de aumento salarial',
           fields:{
              dates:'Fecha',
              employee_id:'Nombre',
              standard_wage:'Salario',
              pay_rate:'Salario con bono',
              wage_growth_per:'%',
              wage_growth:'Aumento salarial'
           }
        },
        PropayBonusReport:{
           name:'Informe de bono de ProPay',
           fields:{
              propay_id:'ProPay',
              employee_id:'Nombre',
              performance_bonus:'Bono',
              paid_period_id:'Periodo de pago',
              period_id:'Periodo trabajado'
           }
        },
        login:{
           sent_magic_link:'¡Enlace mágico enviado!',
           magic_link_sent_preinfo:'`Revise su`',
           magic_link_sent_postinfo:'`bandeja de entrada. Siga el enlace para iniciar sesión.`',
           sign_in_without_password:'Iniciar sesión sin contraseña',
           sign_in_with_magic_link:'Iniciar sesión con enlace mágico',
           sign_in_info:'Le enviaremos por correo un enlace para iniciar sesión en su cuenta sin contraseña.',
           sign_in_manually_instead:'iniciar sesión manualmente',
           sign_in_using_magic_link:'iniciar sesión con enlace mágico',
           alert_msg_info:'Le enviaremos por correo un enlace mágico para iniciar sesión sin contraseña. O usted puede.',
           wrong_email_address:'¿Dirección de correo incorrecta? Por favor',
           reenter_email_address:'Ingrese nuevamente su dirección de correo electrónico.',
           you_can:'usted puede'
        },
        position:{
           fields:{
              burden_per:'Carga'
           }
        },
        jobReport:{
           name:'Empleo',
           choices:{
              status:{
                 open:'Abierto',
                 closed:'Cerrado'
              }
           },
           fields:{
              total_labor_per:'%'
           }
        },
        jobs:{
           choices:{
              status:{
                 open:'Abierto',
                 closed:'Cerrado'
              }
           },
           fields:{
              total_labor_per:'%'
           }
        },
        protivPropayChanges:{
           fields:{
              name:'Nombre',
              status:'Estado',
              old_name:'Nombre anterior',
              new_name:'Nombre nuevo',
              old_amount:'Monto anterior',
              new_amount:'Monto nuevo',
              old_job_id:'Empleo anterior',
              new_job_id:'Empleo nuevo'
           },
           choices:{
              status:{
                 open:'Abierto',
                 pending:'Pendiente',
                 approved:'Aprobado',
                 paid:'Cerrado',
                 cancelled:'Cancelado'
              }
           }
        },
        vericlockBackend:{
           fields:{
              vericlock_api_public_key:'Llave pública',
              private_key:'Llave privada',
              vericlock_domain:'Dominio',
              user_name:'Nombre de usuario',
              password:'Contraseña'
           },
           choices:{
              status:{
                 pending:'Pendiente',
                 connected:'Conectado'
              }
           }
        },
        propayWageByBaseWage:{
           fields:{
              base_wage:'Salario',
              hours:'Hrs.',
              base_pay:'Base',
              propay_ot_amt:'ST',
              bonus:'Bono',
              propay_earning:'Total',
              pay_rate:'Tarifa PP'
           }
        },
        propays:{
           name:'ProPay',
           keep_editor_open:'Mantener el editor abierto luego de guardar',
           keep_propay_after_save:'Mantener propay después de guardar',
           new_propay:'Nuevo ProPay',
           edit_propay:'Editar ProPay',
           active_propay:'ProPay activo',
           bonus_split_type:'Tipo de división de bono',
           incentives_info:'Incentives sent to workers',
           income_earned_info:'Income earned from approved ProPays',
           bonus_choices:{
              bonus_split_type:{
                 by_hours:{
                    label:'Igual por hora',
                    info:'El bono será distribuido de formas iguales en base al número de horas registradas'
                 },
                 by_wage:{
                    label:'% de salario',
                    info:'El bono será distribuido de formas iguales en base al número de horas registradas y su salario por hora.'
                 },
                 by_percentage:{
                    label:'Establecer % de distribución',
                    info:'El bono será distribuido en base al porcentaje determinado establecido para cada persona.'
                 }
              }
           },
           bonus_info:'Actívar para eliminar el acceso a cualquier posible bono en este ProPay. Los bonos serán distribuidos solo a los trabajadores desactivados.',
           fields:{
              is_include_bonus:'Remover bono',
              name:'Título',
              number:'Id',
              show_to_all:'Mostrar a todos',
              is_change_base_wage:'Cambiar salario',
              task_ids:{
                 name:'Tarea'
              },
              total_qty:'Cantidad total.',
              contractor_item_ids:'Empleo secundario',
              employee_name_and_position:'Nombre / Cargo',
              date_range:'Fecha',
              manager_id:'Gerente',
              actions:'Acciones',
              overage:'Excedente',
              create_date:'Crear fecha',
              assigned_date:'Asignar fecha',
              hourly_rate:'Tarifa por hora',
              attendances:'Asistencias',
              approved_date:'Cerrar fecha',
              approved_by_id:'Aprobado por',
              hours:'Horas',
              attendance_earning:'Salario base',
              performance_bonus:'Ingreso adicional',
              amount:'Monto',
              employee_wage_ids:'Detalles de ProPay',
              activity:'Actividad',
              attendance_only_ids:'Asistencias',
              status:'Estado',
              from_date:'Fecha de inicio',
              by:'Por',
              propaydetails:{
                 title:'Informe detallado de ProPay',
                 name:'ProPay',
                 job_id:{
                    name:'Empleo',
                    revenue:'Ganancia'
                 },
                 earning:'Coste laboral',
                 amount:'Presupuesto de PP',
                 status:'Estado'
              },
              selected_leadpay_employee_ids:'Empleados'
           },
           choices:{
              status:{
                 open:'Abierto',
                 pending:'Pendiente',
                 approved:'Aprobado',
                 paid:'Cerrado',
                 cancelled:'Cancelado'
              }
           },
           cancel:{
              buttonTitle:'Cancelar',
              title:'Cancelar ProPay - %{name}',
              notify:{
                 title:'¿Le gustaría notificar la alerta de cancelación de propay a todos los empleados asignados?'
              },
              content:'¿Está seguro de que desea cancelar este ProPay?'
           },
           addtime:{
              buttonTitle:'Añadir tiempo'
           },
           delete:{
              buttonTitle:'Borrar',
              title:'Borrar ProPay - %{name}',
              content:'¿Está seguro de que desea eliminar ya que no hay horas registradas en este ProPay?'
           },
           details:{
              my_details:'Mis datos',
              amount_detail:'Pago total al equipo'
           },
           notifications:{
              
           },
           no_propay:'-No hay ProPay-'
        },
        propayEmployeeWages:{
           fields:{
              base_wage:'Salario',
              hours:'Horas',
              attendance_earning:'Salario base',
              performance_bonus:'Ingreso adicional',
              bonus:'Bono',
              earning:'Total',
              pay_rate:'Tarifa por hora',
              propay_amount:'Monto de Propay',
              bonus_per:'Bono (%)'
           }
        },
        weekEntryLines:{
           fields:{
              week_selection:'Selección de nómina'
           }
        },
        timesheets:{
           name:'Hoja de horas'
        },
        payBonusReport:{
           title:'Informe de pago de bonos'
        },
        payrolls:{
           name:'Bonos',
           active_payroll:'Nómina activa',
           weekly_entries:'Entradas',
           fields:{
              number:'Id',
              period_id:'Periodo de nómina',
              attendance_only_idsIds:'Asistencia',
              performance_bonus_only_idsIds:'Bono /ST Diferencia',
              leave_allocation_line_idsIds:'Permiso',
              retro_attendance_only_idsIds:'Pago de retroactivos',
              total:'Total',
              regular_hours:'Horas regulares',
              total_hours:'Total de horas',
              break_hours:'Horas de descanso',
              regular_earning:'Ingresos regulares',
              bonus_ot_diff_amt:'Monto de sobretiempo',
              performance_bonus:'Bonos',
              bonus_earning:'Bonos',
              total_bonus:'Total de Bonos',
              ot_amt:'Monto de sobretiempo',
              ot_rate:'Tarifa de sobretiempo',
              ot_hours:'Horas de sobretiempo',
              total_leaves_hours:'Horas de permiso',
              total_leaves_amount:'Monto de permiso',
              net_earning:'Ganancias netas',
              close_timesheet_button:'Bloquear',
              reopen_timesheet_button:'Desbloquear',
              gross_earning:'Ganancias brutas',
              retro_earning:'Ganancias retroactivos',
              retro_gross_earnings:'Ganancias brutas retroactivo',
              retro_overtime:'Sobretiempo retroactivo',
              total_earning:'Ganancias brutas totales',
              gross_earnings:'Ganancias Brutas',
              non_propay_hours:'Horas no ProPay'
           },
           choices:{
              status:{
                 open:'Abierto',
                 paid:'Cerrado'
              }
           },
           lock:{
              title:'Bloquear nómina - %{id}',
              content:'¿Está seguro de que quiere bloquear la nómina?',
              notify:'Nómina bloqueada - %{id}'
           },
           unlock:{
              title:'Abrir nómina - %{id}',
              content:'¿Está seguro de que quiere abrir la nómina?',
              notify:'Nómina Abierta - %{id}'
           },
           earnings:'Ganancias'
        },
        periods:{
           choices:{
              status:{
                 open:'Abierto',
                 closed:'Cerrado'
              }
           },
           run:{
              buttonTitle:'Cerrar nómina',
              title:'ejecutar nómina - %{name}',
              content:'¿Está seguro de que quiere ejecutar la nómina?',
              notify:'Ejecutar nómina completada - %{name}'
           },
           unlock:{
              buttonTitle:'Abrir nómina',
              title:'Período de Nómina Abierto - %{name}',
              content:'¿Está seguro de que quiere abrir el período de nómina?',
              notify:'Período de nómina abierto - %{name}'
           },
           addtime:{
              buttonTitle:'Añadir tiempo'
           }
        },
        employees:{
           name:'Equipo',
           fields:{
              employee_number:'Empleado #',
              employee_payroll_number:'ID de nómina',
              name:'Nombre',
              mobile_number:'Móvil #',
              email:'Email',
              user_type:'Tipo de usuario',
              base_wage:'Salario',
              is_propay_user:'¿Es usuario de ProPay?'
           },
           choices:{
              status:{
                 draft:'No ha sido invitado aún',
                 invited:'Invitación enviada',
                 active:'Activo',
                 new:'Conectado (Nunca iniciar sesión)'
              },
              active:{
                 active:'Activo',
                 inactive:'Inactivo',
                 edit:'Editar'
              },
              user_type:{
               'admin': 'Admin',
               'manager': 'Manager',
               'worker': 'Worker',
           }
           },
           action:{
              archive:'Desactivar',
              activate:'Activar',
              invite:'Invitar',
              resend_invite:'Reenviar invitación',
              manageInvite:'Invitar usuario'
           },
           notification:{
              archived_success:'Emeplado desactivado',
              archived_error:'Error al desactivar al empleado: %{error}',
              activated_success:'Empleado activado',
              activated_error:'Error al activar al empleado: %{error}'
           }
        },
        attendances:{
           fields:{
              bonus_earning:'Ganancias',
              propay_id:'ProPay',
              performance_bonus:'Bonos',
              bonus_description:'Descripción',
              performance_hours:'Horas',
              performance_pay_rate:'Salario por hora',
              gross_pay:'Ganancias',
              regular_hours:'Horas regulares',
              ot_hours:'horas de sobretiempo',
              ot_amt:'Sobretiempo',
              report_total_ot_amt:'Sobretiempo',
              earning:'Salario base',
              standard_wage:'Salario promedio estándar',
              pay_rate:'Salario promedio por hora',
              wage_growth:'Aumento salarial',
              wage_growth_per:'%',
              overage:'Excedente',
              capacity_hour_growth:'Capacidad de crecimiento de horas',
              capacity_hour_growth_per:'%',
              bonus:'Bonos',
              group_propay_earning:'Ganancias',
              start:'Entrada',
              end:'Salida',
              group_by_propay_overage:'Excedente',
              include_in_overtime_computation:'Incluir en Sobretiempo'
           },
           overtime_info_text:'Cuando se muestra la marca, el bono total será incluido en la tarifa por hora neta que calcula la tarifa de sobretiempo. Si no hay ningúna marca visible, no se incluirá en el cálculo de sobretiempo',
           keep_editor_open:'Mantener el editor abierto después de guardar',
           keep_employee_after_save:'Mantener empleado después de guardar',
           choices:{
              status:{
                 pending:'Pendiente',
                 approved:'Aprobado',
                 paid:'Pagado'
              }
           },
           choices2:{
              status:{
                 pending:'Abierto',
                 paid:'Cerrado'
              }
           }
        },
        tsheetConnectors:{
           choices:{
              status:{
                 pending:'Pendiente',
                 connected:'Conectado'
              }
           },
           fields:{
              is_propay_selection_required:'¿Se requiere la entrada de Propay?'
           }
        },
        salesForceBackends:{
           choices:{
              status:{
                 pending:'Pendiente',
                 connected:'Conectado'
              }
           }
        },
        companies:{
           fields:{
              job_ids:'Puesto de empleo',
              hours_per_day:'Referencia de horas por díae',
              payroll_week_day:'Día de inicio de nómina',
              include_ot_from_spent_total:'Incluye ST antes de calcular el bono.',
              remove_ot_diff:'Remover diferencia de ST.',
              default_bonus_split_type:'División de bono por defecto',
              hours_format:'Cálculos de horas totales',
              hide_bonuses_from_other_workers:'Ocultar bonos de otros empleados',
              show_propay_detail_report:'Mostrar informe detallado de ProPay'
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
     }
};

export default customEnglishMessages;
