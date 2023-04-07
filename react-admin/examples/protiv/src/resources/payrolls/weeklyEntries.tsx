import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import createDecorator from 'final-form-calculate';
import _ from 'lodash';
import get from 'lodash/get';
import lodashMemoize from 'lodash/memoize';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import {
    AutocompleteArrayInput, AutocompleteInput, BooleanInput, CRUD_UPDATE, FormDataConsumer, FormWithRedirect, Record, 
    ReferenceField, ReferenceInput, required, ResourceContextProvider, SaveButton, TextField, useGetIdentity, useGetList, useMutation, 
    useNotify, useRedirect, useRefresh, useTranslate, useUnselectAll, useUpdate
} from 'react-admin';
import { Field } from 'react-final-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { ArrayInput } from '../../components/ArrayInput';
import { RemoveItemWithConfirmation } from '../../components/ArrayInput/RemoveItemWithConfirmation';
import { StyledSimpleFormGroupIterator, StyledSimpleFormGroupIteratorAddtime } from '../../components/ArrayInput/SimpleFormGroupIterator';
import DialogForm from '../../components/DialogForm';
import { DateTimeField, NumberToTimeField, NumberToTimeFieldSign, ReferenceArrayInputObj, ReferenceInputObj, ReferenceListBase } from '../../components/fields';
import { CustomFormDisplayField } from '../../components/fields/CustomFormDisplayField';
import { HoursInput, MinutesInput } from '../../components/fields/InputMask';
import { usePageAlertsContext } from '../../components/page-alerts/usePageAlerts';
import { Toolbar } from '../../ra-rbac/form';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { convertNumToTime } from '../../utils/formatter';
import { JobNameInput } from '../jobs/job';
import { ListStyle, ProPayPaidAlert } from '../propays';
import { OvertimeTotalHoursInputScreen } from './otInputScreen';
import { PeriodField } from './Payrolls';

const textStyle = {
    fontSize: 14,
    color: '#231F20',
    fontWeight: 400,
    marginLeft: 1,
    marginRight: 1,
};

export const StyledReferenceListBase = styled(ReferenceListBase)({
    ...ListStyle,
    '.MuiTableHead-root': {
        display: 'none'
    },
    '.RaDatagrid-row':{
        borderBottomWidth:0
    }
});

export const StyledStack = styled(Stack)({
    '.MuiFormControl-root': {
        marginTop: 0,
        '& .MuiInputLabel-formControl': {
            display: 'none',
        },
        '& .MuiInput-root': {
            marginTop: 0
        },
        '& .MuiInput-input': {
            textAlign: 'center'
        }
    },
});

const StyledNameTextField = styled(TextField)({
    ...textStyle,
    fontWeight: 'bold',
});

const StyledNumberToTimeFieldSign = styled(NumberToTimeFieldSign)({
    ...textStyle,
});

const StyleDateTimeField = styled(DateTimeField)({
    ...textStyle
});


export const StyleToolbar = styled(Toolbar)({
    '&.RaToolbar-mobileToolbar': {
        position: 'relative'
    },
    '&.RaToolbar-toolbar':{
        backgroundColor:'#FFF',
    }
});

const isRequired = [required()];

export const StyledReferenceInput = styled(ReferenceInput)({
    'min-width': 170,
});

export const StyledBooleanInput = styled(BooleanInput)({
    '.MuiTypography-body1': {
        display: 'none'
    }       
});

const StyledSaveButton = styled(SaveButton)({
    backgroundColor: '#F4F6F8', 
    borderColor: '#F4F6F8', 
    color: '#637381',
    '&:hover': {
        borderColor: '#F4F6F8',
        backgroundColor: '#F4F6F8',
    }
});

export const StyledLoadingButton = styled(LoadingButton)({
    backgroundColor: 'white', 
    color: 'primary',
    boxShadow: 'none',
    minWidth: 80,
    height: 34
});

type Memoize = <T extends (...args: any[]) => any>(
    func: T,
    resolver?: (...args: any[]) => any
) => T;

const memoize: Memoize = (fn: any) =>
    lodashMemoize(fn, (...args) => JSON.stringify(args));

export const checkAnRaiseValidation = (total_worked_hours, total_propay_hours, new_hours, total_hours) => {
    if (total_worked_hours && total_propay_hours && new_hours && total_hours > total_worked_hours) {
        return `Total Propay hours of the selected period cannot be greater than total worked hours [${convertNumToTime(total_worked_hours)}].`;
    } else {
        return undefined
    };
};

const prepareOTData = (data:any,previousData:{},submit_hours_id:any) => {
    return {id: submit_hours_id, data: {id: data.submit_hours_id,ot_payroll_ids:data.ot_payroll_ids}, previousData: {id: submit_hours_id,ot_payroll_ids:previousData}}
};

export const getPayrollData = (previousPayrollData:[],has_daily_overtime_configured:any,period_schedule:any) => {
    return _.size(previousPayrollData) ? _.map(previousPayrollData, (item:Record) => {
        return {
            id: item?.id,
            has_overtime: item?.has_overtime,
            period_id: item?.period_id,
            employee_id: item?.employee_id,
            total_propay_hours: item?.total_propay_hours,
            total_worked_hours:item?.total_hours,
            total_man_and_prop_hrs:item?.total_man_and_prop_hrs
        };
    }):[]
};


export const SavedPrimaryButton = (props: any) => {
    const { variant, size, sx, label, iconLabel,...rest } = props;
    return (
        <SaveButton variant={variant || 'outlined' }
                    size={size||'small'}
                    style={sx || {backgroundColor: 'white', color: 'primary',boxShadow: 'none'}}
                    label={label || ''}
                    icon={
                        <>
                            <Typography color='primary' fontWeight='bold'>
                                {iconLabel}
                            </Typography>
                        </>}
                    {...rest}
        />)
};

const getPayrollsIds = (Attendances)=>{
    return _.uniq(_.map(Attendances,'payroll_id'));
};

export const ProPayHoursUpdateForm = (props: any) => {
    const {record,onEditSuccess} = props;
    _.unset(record,'hours');
    _.unset(record,'minutes');
    const [update,{isLoading}] = useUpdate();
    const notify = useNotify();
    const queryClient = useQueryClient();

    const onSave = (data:any) => { 
        const new_propay_hours = convertToFloatHours(data.hours,data.minutes);
        const new_hours =  new_propay_hours-data.propay_hours;
        const new_data = {id:data.propay_id, weekly_entry_lines:[{...record,new_hours: new_hours}]};
        const previousData = {id:data.propay_id, weekly_entry_lines:[record]};
        _.unset(new_data,'minutes');
        update(
            'propays',
            {id: data.propay_id, data: new_data, previousData: previousData},
            {
                mutationMode: 'pessimistic',
                onSuccess: (result: any) => {
                    notify('Element Updated', 'info', {
                        smart_count: 1,
                    })
                    queryClient.setQueryData(['propays', 'getOne', String(result.id)],result);
                    onEditSuccess(new_propay_hours)
                },
                onError: (error: any) => {
                    notify(`Element Failed Updated ${error.message}`);
                },
            }
        );
    };

    const [hours, minutes] = convertNumToTime(record.propay_hours).split(':');
    return (
        <ResourceContextProvider value='payrollAttendanceInputs'>
            <FormWithRedirect
                {...props}
                initialValues={{ hours:hours, minutes:minutes }}
                render={(formProps: any) => {
                    return (
                        <Grid container spacing={1}>
                            <Grid item lg={12} xs={12}>
                                <StyledStack direction='row'>
                                    <HoursInput variant='standard' label={false} source='hours' placeholder='hh'/>
                                    <Typography sx={{ marginTop: 0 }}>:</Typography>
                                    <MinutesInput variant='standard' label={false} source='minutes' placeholder='mm'/>
                                </StyledStack>
                            </Grid>
                            <Grid className='padding_toolbaar' item lg={12} md={12} sm={12} xs={12} sx={{ marginTop: 0 }}>
                                <StyleToolbar
                                    sx={{
                                        bottom: 0,
                                        marginBottom: 0,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: '#FFF',
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                    }}
                                    record={record}
                                    invalid={formProps.invalid}
                                    handleSubmit={formProps.handleSubmit}
                                    handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                                    saving={formProps.saving}
                                    basePath={''}
                                >
                                    <SaveButton onSave={onSave} saving={isLoading}/>
                                </StyleToolbar>
                            </Grid>
                        </Grid>
                    );
                }}
            />
        </ResourceContextProvider>
    );
};

const UpdatePropayHoursComponent = (props:any) => {
    const openUpdateProPayHoursDialog = () => {
        dialogRef.current.open()
    };
    const dialogRef: any = React.useRef();
    const {onSuccess} = props;
    const translate = useTranslate();

    return (
        <>
            <Button
                onClick={openUpdateProPayHoursDialog}
                sx={{minWidth:'unset',padding:0}}
            >
                <Icon
                    fr=''
                    icon='clarity:note-edit-line'
                    fontSize={20}
                />               
            </Button>
            <DialogForm title={translate('resources.weekEntryLines.update_propay_hours')} ref={dialogRef}>
                <ProPayHoursUpdateForm record={props.record} onEditSuccess={(data:any) => {
                        dialogRef.current.close();
                        onSuccess(data)
                    }} {...props}/>
            </DialogForm>
        </>
    );
};

export const parseTime = (value: any) => {
    if (value &&  typeof value == 'string'){
        const [hours, minutes] = value.split(':');
        if (minutes) {
            var strminutes = parseFloat(minutes)/NUMBER.SIXTEY || 0.0;
            var time = parseInt(hours) + strminutes
            return time
        } else {
            return parseFloat(hours)
        }
    } else {
        return value
    }
};

export const convertToFloatHours = (hours:any,minutes:any) => {
    if (minutes) {
        var strminutes = parseFloat(minutes)/NUMBER.SIXTEY || 0.0;
        if (hours) {
            var time = parseInt(hours) + strminutes
            return time
        } else {
            return strminutes
        }
    } else {
        return parseFloat(hours)
    }
};

const prepareWeeklyLines = (weeklyLines:any) => {
    const new_weeklines= weeklyLines.map((item) => {
        return { id:item.id,
            propay_id:item.propay_id,
            period_id:item.period_id,
            employee_id:item.employee_id,
            new_hours:convertToFloatHours(item.hours,item.minutes) || 0,
        }
    });
    return new_weeklines
};

const prepareUpdateData = (data:any) => {
    const new_data = { id:data.propay_id_obj.id, weekly_entry_lines: prepareWeeklyLines(data.weekly_entry_lines)}
    const previousData = { id:data.propay_id_obj.id, weekly_entry_lines: prepareWeeklyLines(data.propay_id_obj.weekly_entry_lines)}
    return  { id: data.propay_id, data: new_data, previousData:previousData}};

export const AttedanceInputScreen = (props: any) => {
    const {isFromPropay,setPropayId,setOvertimeInput,propayId,onClose,redirect:redirectTo,setPayrollIds,propay_id,refreshResource} = props;
    const redirect = useRedirect();
    const navigate = useNavigate();
    const translate = useTranslate();
    const [update,{isLoading}] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();
    const queryClient = useQueryClient();
    const [canCloseDialog, setCanCloseDialog] = useState(false);
    const { identity } = useGetIdentity();
    const [mutate, { loading:isApproveLoading }] = useMutation();
    const [isPropayApproveLoading, setIsPropayApproveLoading]= useState(isApproveLoading);
    const hideKeepEditor = props.hideKeepEditor || false;
    const isFromPropayCard = props.isFromPropayCard;
    const [showNextOtInput,setShowNextOtInput] = useState(propay_id?.show_next_ot_input);
    const [propayStatus,setPropayStatus] = useState(propay_id?.status);
    const [jobId, setJobId] = useState(0);
    const {showAlert} = usePageAlertsContext();

    const getFilterForEmployee = (formData,scopedFormData) => {
        var weekly_entry_lines = formData.weekly_entry_lines.filter(function (value, index, arr) {
            return value.employee_id !== undefined && value.period_id === scopedFormData.period_id;
        });
        const filteredEmployeeIds = _.map(weekly_entry_lines, 'employee_id');
        const propayAssignedEmployees = get(formData.propay_id_obj, 'selected_employee_ids');
        const filteredIds = propayAssignedEmployees? propayAssignedEmployees.filter(e => !filteredEmployeeIds.includes(e)):[];
        return { id: {_in:filteredIds} };
    };

    const callAction = (props:any) => {
        const {onSuccess,data,resource,setPropayId} = props;
        update(
            resource,
            data,
            {
                mutationMode: 'pessimistic',
                onSuccess: (result: any) => {
                    if (onSuccess){
                        onSuccess()
                    };
                    if(setPropayId){
                        setPropayId(result.id)
                    };
                    queryClient.setQueryData([resource, 'getOne', String(result.id)],result);
                    if (refreshResource){
                        queryClient.invalidateQueries([refreshResource,'getList'])
                    };
                },
                onError: (error: any) => {
                    notify(`Element Failed Updated ${error.message}`);
                },
            }
        );
    };

    const computeWeekEntryIds = (selected_week_selection_obj: any, weekly_entry_lines: any, forceUpdate: boolean, propayObj: any): any => {
        let week_ids = selected_week_selection_obj;
        if (!(selected_week_selection_obj instanceof Array)) {
            week_ids = !selected_week_selection_obj ? [] : [selected_week_selection_obj];
        }
        const existingIds = _.flatMap(weekly_entry_lines, 'period_id');
        const selected_week_ids = _.flatMap(week_ids, 'id');
        const weekIdsById = _.keyBy(week_ids, 'id');

        const added = _.map(_.difference(selected_week_ids, existingIds), val => {
            const period = weekIdsById[val];
            const preSelectedWeekIds = propayObj.length > 0 && propayObj.filter((weekEntry) => weekEntry?.period_id === val);
            if(preSelectedWeekIds[0] && (val === preSelectedWeekIds[0]?.period_id)){
                return preSelectedWeekIds[0];
            }else{
            return { 'period_id': period.id,'employee_id':null,'new_hours':0,'propay_hours':0};
            }
        });

        if (!_.isEmpty(added) || forceUpdate) {    
            _.forEach(added, (oneAdded) => {
                weekly_entry_lines.push(oneAdded);
            });
            return weekly_entry_lines;
        } else {
            const filterData = weekly_entry_lines.filter((item) => {
                const elementsNotInWeekIds = existingIds.filter((num) => !selected_week_ids.includes(num));
                return item?.period_id !== elementsNotInWeekIds[0];
            })
            return filterData;
        }
    };
    
    const onUpdateWeekSelectionObj = (fieldValue: any, name: string, allValues: any): any => {
        const oldVals = allValues ? allValues.weekly_entry_lines || [] : [];
        const newVals = computeWeekEntryIds(fieldValue, oldVals, false, allValues?.propay_id_obj?.weekly_entry_lines);
        const result: any = {};
        if (newVals !== undefined) {
            result['weekly_entry_lines'] = newVals
        }
        return result;
    };
    
    const onSave = (data:any) => {
        callAction({ data: prepareUpdateData(data),onSuccess:() => {
            if (!canCloseDialog) {
                if (props.isFromPropayCard) {
                    setPropayId(propayId);
                } else {
                    setPropayId(0)
                    setPropayStatus('');
                    refresh();
                    navigate('/attendances');
                    if(onClose){
                        onClose();
                    } else if (redirectTo){
                        redirect(redirectTo, '', null, null, { _scrollToTop: false });
                    }
                }
                refresh()
            } else {
                setPropayId(propayId);
            }
        },resource:'propays'})
    };

    const nextOvertimeInputScreen = (data:any) => {
        callAction({ data: prepareUpdateData(data),onSuccess:() => {
            setOvertimeInput(true);
        },resource:'propays',setPropayId:setPropayId});        
    }
    const handleApprove = (data:any) => {
        const propayName = data.propay_id_obj?.name
        const resource = 'propays'
        setIsPropayApproveLoading(true)
        callAction({data: prepareUpdateData(data),onSuccess:() => {
            mutate(
                {
                    type: 'update',
                    resource: resource,
                    payload: {id: data.propay_id, action:'approvePropay', data: {} }
                },
                {
                    mutationMode: 'pessimistic',
                    action: CRUD_UPDATE,
                    onSuccess: (
                        data: any,
                        variables: any = {}
                    ) => {
                        data = data.data;
                        queryClient.invalidateQueries(['propays', 'getList']);
                        if (data && data.status === 'approved' && identity?.company?.has_overtime_config){
                            setPropayId(data.id);
                            setShowNextOtInput(data.show_next_ot_input)
                        };
                        setPropayStatus(data.status);
                        setIsPropayApproveLoading(false);
                        if (data && data.status === 'paid'){
                            showAlert({
                                key: 'propay-paid-alert',
                                body: <ProPayPaidAlert name={propayName} />
                            })
                            setPropayId(0);
                            if (onClose) {
                                onClose() 
                            } else {
                                refresh()
                            }
                        }
                    },
                    onFailure: error => {
                        setIsPropayApproveLoading(false)
                        notify(`Failure ! ${error.message}`);
                    }
                }
            );
        },resource:resource})
    };

    const onChangeJob = (fieldValue: any, name: string, allValues: any): any => {
        const result:any = {}
        if (fieldValue && allValues?.propay_id_obj?.job_id !== fieldValue){
            result['propay_id'] = null
        }
        return result
    };

    const onChangePropay = (fieldValue: any, name: string, allValues: any): any => {
        const existingIds = fieldValue ? fieldValue.weekly_entry_lines || [] : [];
        const existingWeekSelectionIds = fieldValue ? fieldValue.week_selection_ids || [] : [];
        const result: any = { 'weekly_entry_lines': [],'week_selection_ids':[]};
        if (existingIds.length){
            var deepCopy = _.cloneDeep(existingIds);
            result['weekly_entry_lines'] = deepCopy
        };
        if (existingWeekSelectionIds.length) {
            result['week_selection_ids'] = existingWeekSelectionIds
        };
        setPropayId(fieldValue?.id);
        setJobId(fieldValue?.job_id);
        setShowNextOtInput(fieldValue?.show_next_ot_input);
        setPropayStatus(fieldValue?.status);
        setPayrollIds(getPayrollsIds(allValues?.propay_id_obj?.attendance_only_ids));
        return result;  
    };
    
    const onchangeWeeklyEntryLines = (fieldValue: any, name: string, allValues: any): any => {
        const week_selection_ids = _.uniq(_.map(allValues.weekly_entry_lines,'period_id'))
        if (_.isEqual(week_selection_ids,allValues.week_selection_ids)) {
            return {}
        } else {
            return {'week_selection_ids':week_selection_ids}; 
        } 
    };

    const decorator = useMemo(() => {
        return [
            createDecorator(
                {
                    field: 'job_id',
                    updates: onChangeJob
                },
                {
                    field: 'propay_id_obj',
                    updates: onChangePropay
                },
                {
                    field: 'weekly_entry_lines',
                    updates: onchangeWeeklyEntryLines

                },
                {
                    field: 'week_selection_ids_obj',
                    updates: onUpdateWeekSelectionObj,
                },
                ),
            ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    return (
        <FormWithRedirect
            decorators={decorator}
            initialValues={{ propay_id: propayId,job_id:jobId}}
            {...props}
            render={(formProps: any) => {
            return (
                    <div className={`${isFromPropayCard ? 'attendence-create-wrapper time-card-edit' : ''}`}>
                    <Grid className='add-time-grid-cont' container lg={12} md={12} sm={12} xs={12} spacing={4}>
                    <Grid className='add-time-col-left' item lg={4} md={4} xs={12}>
                        {identity?.company?.show_job_page && <Grid item lg={12} xs={12} sx={{p:0}} className='add-time-input'>
                            <ReferenceInputObj
                                    label='resources.weekEntryLines.job'
                                    source="job_id"
                                    reference="jobs"
                                    filter={{ active: {_eq:true}}}
                                >
                                    <JobNameInput fullWidth />
                            </ReferenceInputObj>
                        </Grid>}
                        
                        <Grid item lg={12} xs={12} sx={{p:0}} className='add-time-input'>
                                <FormDataConsumer label='resources.weekEntryLines.propay'>
                                {({ formData, getSource, scopedFormData, ...rest }) => {
                                    let filter = { status: { _in: ['pending', 'approved'] }}
                                    if (formData?.job_id) {
                                        filter['job_id'] = {_eq:formData.job_id}
                                    }
                                    return (
                                        <ReferenceInputObj source='propay_id' disabled={(isFromPropay||isFromPropayCard) && propayId ? true : false} 
                                        filter={filter} reference="propays" label='resources.weekEntryLines.propay'>
                                            <AutocompleteInput fullWidth label={false}
                                                optionText={(record: any) =>
                                                    `${record?.name} (${record?.status})`
                                                } />
                                        </ReferenceInputObj>);
                                }}
                            </FormDataConsumer>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} className='Autocomplete-fullwidth add-time-input'>
                            <ReferenceArrayInputObj filter={{ status: { _in: ['open'] }, start_date: { _lte: moment().format('YYYY-MM-DD') } }} source="week_selection_ids" 
                            reference="periods" label={translate('resources.weekEntryLines.fields.week_selection')}>
                                <AutocompleteArrayInput fullWidth multiple={false} />
                            </ReferenceArrayInputObj>
                        </Grid>
                        <Box className='additional-hour-tagline'>
                                    <Stack direction='row' className='amount-avg-text'>
                                        <Icon width={20} height={20} icon="ri:error-warning-fill" fr='' /> 
                                        <Typography variant="caption" color="textSecondary">{translate('resources.weekEntryLines.total_hours_enter_text')}</Typography>
                                    </Stack>
                        </Box>
                        </Grid>

                        <Grid className='add-time-col-right' item lg={8} md={8} xs={12}>
                        <Grid className={`${propayId ? 'add-time-column-box' : 'add-time-no-column-box'}`}   item lg={12} md={12} sm={12} xs={12}>
                            <ArrayInput source="weekly_entry_lines" label={false}>
                            <StyledSimpleFormGroupIteratorAddtime
                                    groupBy={'period_id'}
                                    removeButton={<RemoveItemWithConfirmation />}
                                    disableReordering
                                    disableAdd={false}
                                    disableRemove={false}
                                >
                                    <FormDataConsumer label='resources.weekEntryLines.workers'>
                                        {({ formData, getSource, scopedFormData, ...rest }) => {
                                            return (
                                                <StyledReferenceInput
                                                    {...rest}
                                                    source={getSource('employee_id')}
                                                    reference="employees"
                                                    validate={required()}
                                                    filter={getFilterForEmployee(formData, scopedFormData)}
                                                    disabled={scopedFormData.id ? true : false}
                                                    variant="standard"
                                                    label='resources.weekEntryLines.worker'
                                                    className='add-time-worker-select'
                                                >
                                                    <AutocompleteInput fullWidth />
                                                </StyledReferenceInput>);
                                        }}
                                    </FormDataConsumer>
                                    <FormDataConsumer label={translate('resources.weekEntryLines.add_hours')}>
                                        {({ formData, getSource, scopedFormData, ...rest }) => {
                                           return (
                                                <StyledStack direction='row' className='add-time-worker-select add-time-hours-select'>
                                                    <HoursInput variant='standard' source={getSource('hours')} label='resources.weekEntryLines.hh' />
                                                    {/* <Typography>:</Typography> */}
                                                    <MinutesInput variant='standard' source={getSource('minutes')} label='resources.weekEntryLines.mm' />
                                                </StyledStack>
                                            )
                                        }}
                                    </FormDataConsumer>
                                    <FormDataConsumer label={translate('resources.weekEntryLines.total_hours')}>
                                        {({ formData, getSource, scopedFormData, ...rest }) => {
                                            return (
                                                <Field name={getSource('propay_hours')}>
                                                    {({ input: { onChange } }) => {
                                                        return (<Stack direction="row" spacing={1}>
                                                        <CustomFormDisplayField source={getSource('propay_hours')} >
                                                            <NumberToTimeField label={translate('resources.weekEntryLines.total_hours')} source={getSource('propay_hours')} size="small" />
                                                        </CustomFormDisplayField>
                                                        {scopedFormData.id && scopedFormData.propay_hours &&
                                                            <>
                                                                <UpdatePropayHoursComponent record={scopedFormData} onSuccess={onChange}/>
                                                            </>}
                                                    </Stack>)
                                                    }}
                                                </Field>
                                                
                                            )
                                        }}
                                    </FormDataConsumer>
                                </StyledSimpleFormGroupIteratorAddtime>
                            </ArrayInput>
                        </Grid>
                        </Grid>
                        <Grid className='muitoolbar-addtime' container columnSpacing={0} sx={{ marginTop:0 }}>
                            <StyleToolbar
                                sx={{
                                    bottom: 0,
                                    marginBottom: 0,
                                    marginLeft: 3,
                                    marginRight: 3,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: '#FFF',
                                    flex: 1,
                                    position: 'relative',
                                    justifyContent: 'space-between',
                                }}
                                record={formProps.record}
                                invalid={formProps.invalid}
                                handleSubmit={formProps.handleSubmit}
                                handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                                saving={formProps.saving}
                                basePath={''}>
                                
                                {!showNextOtInput || !identity?.company?.has_overtime_config ? <SaveButton className='addtime-next-btn' saving={!isPropayApproveLoading && isLoading} disabled={!isPropayApproveLoading && isLoading || !propayId} onSave={onSave} /> : null}
                                {identity?.company?.has_overtime_config && showNextOtInput ?
                                    <StyledSaveButton
                                        variant='outlined'
                                        size="small"
                                        disabled={true}
                                        onSave={onSave}
                                        className='addtime-save-btn'                                        
                                         /> : null}
                                {identity?.company?.has_overtime_config && showNextOtInput ?
                                    <SavedPrimaryButton onSave={nextOvertimeInputScreen} iconLabel='Next' className='addtime-next-btn' /> : null}
                            </StyleToolbar>
                        </Grid>
                    </Grid>
                    </div>
            );
        }}

        />) 
   
};
  
export const OvertimeInputScreen = (props: any) => {
    const {propayId,setOvertimeInput,setPropayId,onClose,setTotalHours,redirect:redirectTo,payrollIds,isFromPropayCard,selectedIds} = props;
    var filter = {id: { _in: payrollIds },status: {_neq: 'paid'}}

    const { data: previousPayrollData, isLoading: payrollLodaing }: any = useGetList('payrolls', {
        sort: { field: 'period_id', order: 'DESC' },
        filter: filter
        });

    const hideBackButton = props.hideBackButton || false
    const [update,{isLoading}] = useUpdate();
    const queryClient = useQueryClient();
    const translate = useTranslate();
    const notify = useNotify();
    const [hasOvertimeEmployee, setOvertimeEmployee] = useState(0);
    const redirect = useRedirect();
    const { loaded, identity } = useGetIdentity();
    const unselectAll = useUnselectAll('attendances');
    const PayrollData = getPayrollData(previousPayrollData,identity?.company?.has_daily_overtime_configured, identity?.company?.period_schedule)

    const callAction = (props:any) => {
        const {onSuccess,data,resource} = props;
        update(
            resource,
            data,
            {
                mutationMode: 'pessimistic',
                onSuccess: (result: any) => {
                    if (onSuccess){
                        onSuccess()
                    }
                    if(isFromPropayCard) {
                        setPropayId(propayId)
                    }
                },
                onError: (error: any) => {
                    notify(`Element Failed Updated ${error.message}`);
                },
            }
        );
    };

    const getOvertimeEmployee = (ot_payroll_ids:any) => {
        return _.size(_.find(ot_payroll_ids, function (ot_payroll_id) {
            return ot_payroll_id.has_overtime === true;
        }));
    };
    const onChangeOtPayrollIds = (fieldValue: any, name: string, allValues: any): any => {
        if (allValues?.ot_payroll_ids){
            const result = getOvertimeEmployee(allValues?.ot_payroll_ids || [])
            setOvertimeEmployee(result)
        }else{
            setOvertimeEmployee(0)
        }
        return {}
    };
  
    const onSaveOvertimeInput = (data: any) => {
        callAction({ data: prepareOTData(data,PayrollData,identity?.company?.submit_hours_id),onSuccess:() => {
            if (selectedIds) {
                if (onClose) {
                    onClose();
                }
                redirect(redirectTo+'/paybonus', '', null,{}, { selectedIds: selectedIds,redirectTo:redirectTo,isFromPayrollCard:props.isFromPayrollCard}); 
            }
            if (onClose) {
                onClose();
            }
        },resource:'submitHours'})
    };

    const nextTotalHoursInputScreen = (data:any) => {
        callAction({ data: prepareOTData(data,PayrollData,identity?.company?.submit_hours_id),onSuccess:() => {
            setTotalHours(true)
            setOvertimeInput(false)
        },resource:'submitHours'})
    };
    
    const backFirstScreen = () => {
        setOvertimeInput(false)
    };
    const decorator = useMemo(() => {
        return [
            createDecorator(
                {
                    field: 'ot_payroll_ids',
                    updates: onChangeOtPayrollIds,
                }
                ),
            ];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    if (payrollLodaing){
        return null;
    };
    if (!loaded) return null;
    return (
        <ResourceContextProvider value='submitHours'>
            <FormWithRedirect
                decorators={decorator}
                {...props}
                initialValues={{ id:identity?.company?.submit_hours_id,ot_payroll_ids: PayrollData}}
                render={(formProps: any) => {
                    return (
                        <Grid className='set-over-time-grid' item lg={12} md={12} sm={12} xs={12} spacing={3}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{p:1}}>
                                <ArrayInput source="ot_payroll_ids" label={false}>
                                    <StyledSimpleFormGroupIterator
                                        groupBy={'period_id'}
                                        disableReordering
                                        disableAdd={true}
                                        disableRemove={true}
                                    >
                                        <CustomFormDisplayField source="period_id" reference="periods" sx={{ minWidth: 215 }}>
                                            <ReferenceField
                                                source="period_id"
                                                reference="periods"
                                                link={false}
                                            >
                                                {/* <TextField source="name" /> */}
                                                <PeriodField />
                                            </ReferenceField>
                                        </CustomFormDisplayField>
                                        <StyledReferenceInput
                                            source="employee_id"
                                            filter={{active: {_eq: true}}}
                                            reference="employees"
                                            disabled={true}
                                            variant="standard"
                                            label='resources.weekEntryLines.worker'
                                        >
                                            <AutocompleteInput fullWidth />
                                        </StyledReferenceInput>
                                        <StyledBooleanInput variant='standard' source="has_overtime" label= {translate('resources.weekEntryLines.overtime_record_of_worker')} />
                                    </StyledSimpleFormGroupIterator>
                                </ArrayInput>
                            </Grid>
                            <Grid className='overtime-action-footer' container columnSpacing={3} sx={{ marginTop: 0 }}>
                                <StyleToolbar
                                    sx={{
                                        bottom: 0,
                                        marginBottom: 0,
                                        marginLeft: 0,
                                        marginRight: 0,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: '#FFF',
                                        flex: 1,
                                        position: 'relative',
                                        justifyContent: 'flex-start',
                                    }}
                                    {...formProps}>
                                    {!hideBackButton ? <Stack direction='row' spacing={1} sx={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <StyledLoadingButton
                                            className='back-add-time'
                                            variant='outlined'
                                            size='small'
                                            onClick={backFirstScreen}
                                        >
                                            Back
                                        </StyledLoadingButton>
                                    </Stack> :
                                        <Stack></Stack>}
                                        {hasOvertimeEmployee  ?
                                        <SavedPrimaryButton iconLabel='Next' onSave={nextTotalHoursInputScreen} className='next-overtime-btn' />
                                        :
                                        <SaveButton onSave={onSaveOvertimeInput} className='save-overtime-btn' />}
                                </StyleToolbar>
                            </Grid>
                        </Grid>
                    );
                }}
            />
        </ResourceContextProvider>
    )
};

export const WeeklyAddTimeForm = (props: any) => {    
    const [hasOvertimeInput, setOvertimeInput] = useState(props?.hasOvertimeInput || false);
    const [hasTotalHours, setTotalHours] = useState(false);
    const [propayId, setPropayId] = useState(props?.propay_id?.id);
    const isFirstScreen = !hasOvertimeInput && !hasTotalHours;
    const [payrollIds, setPayrollIds] = useState(props?.propay_id ? getPayrollsIds(props?.propay_id?.attendance_only_ids) : props?.payrollIds);
    return (
        <>
            {isFirstScreen &&
                <AttedanceInputScreen  {...props} propayId={propayId} setPropayId={setPropayId} setPayrollIds={setPayrollIds} setOvertimeInput={setOvertimeInput} />
            }
            {hasOvertimeInput &&
                <OvertimeInputScreen  {...props} propayId={propayId} setPropayId={setPropayId} payrollIds={payrollIds} 
                setOvertimeInput={setOvertimeInput} setTotalHours={setTotalHours} />
            }
            {hasTotalHours &&
                <OvertimeTotalHoursInputScreen  {...props} propayId={propayId} setPropayId={setPropayId} payrollIds={payrollIds} onClose={props?.onClose} 
                setOvertimeInput={setOvertimeInput} setTotalHours={setTotalHours}/>
            }
       </>
    )
};
