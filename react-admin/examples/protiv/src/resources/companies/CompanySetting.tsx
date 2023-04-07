import React, { useMemo, useState } from 'react';
import { Title } from '../../layout/Title';
import { FormWithRedirect, required, Toolbar, useRefresh } from 'react-admin';
import { Edit } from '../../layout/Edit';
import { HasPermission } from '../payrolls/Payrolls';
import {
    SelectInput,
    SaveButton,
    NumberInput,
    useUpdate,
    useNotify,
    useRecordContext,
    useTranslate,
    BooleanInput,
    FormDataConsumer
} from 'react-admin';

import { DatePickerInput } from '../../components/fields/inputs';
import { Card, Grid, Typography, CardHeader ,Stack} from '@mui/material';
import { useGetIdentity } from 'ra-core';
import CardTitle from '../../components/CardTitle';
import { SCHEDULE, RATE, WEEKDAY, TIME_FORMAT, ADD_TIME_INTERFACE } from './SelectionInput';
import { PayrollExportDataGrid } from './PayrollReportDataGrid';
import { JobPositionDataGrid } from './JobPositionDataGrid';
import moment from 'moment';
import { Condition } from '../../components/fields';
import { styled } from '@mui/material/styles';
import get from 'lodash/get';
import { useIdentityContext } from '../../components/identity';
import AdditionalOtSettings from './AdditionalOtSettings';
import createDecorator from 'final-form-calculate';
import { HasBackendNotConnected, useGetBackend } from '../company/company';
import { bonusSplitTypeSelection, BudgetChoices } from '../propays/Propay';
import { StyleToolbar } from '../payrolls/weeklyEntries';
import { NUMBER } from '../../utils/Constants/MagicNumber';

export const StyledSaveButton = styled(SaveButton)({
    '.MuiCircularProgress-root':{
        color: '#F4F6F8'
    }
});


export const StyledNumberInput = styled(NumberInput)({
    '.MuiFormHelperText-root': {
        display: 'none',
    },
    '.MuiInputLabel-root':{
        display: 'none',
    },
    'label+.MuiInput-root':{
        marginTop:0,        
    }
});

const HOURS_PER_DAY_SELECTION = [
    { id: '6', name: '6'},
    { id: '8', name: '8' },
    { id: '10', name: '10' },
    { id: '12', name: '12' },
]

const HOURS_FORMAT =[
    {
        id: 'by_time',
        name: 'HH:MM (4:45)',
    },
    {
        id: 'by_decimal',
        name: 'Decimal (4.75)',
    }
];

export const HasFeature = ({enabled=true,feature,children,...rest}:any) => {
    const identity = useIdentityContext();
    const has_feature = get(identity?.company,feature)
    return (has_feature === enabled) ? (
        React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child );
            }
            return child;
        })
    ):null
};

export const StyledSelectInput = styled(SelectInput)({
    '.MuiFormHelperText-root': {
        'display': 'none',
    },
});

const OvertimeConfigLine = ({prefix, order, source, source2}) => {
    const translate = useTranslate();
    return (
    <Stack flexDirection={'row'} justifyContent="space-end" alignItems="center" alignContent="center" sx={{pt:1,pb:1, ml:4}}>
        <Typography variant="body2">{prefix}</Typography>
        <StyledNumberInput
            source={source}
            format ={(v) => !v ? null : v}
            label={false}
            variant="standard"
            sx={{width:'64px', pl:1,pr:1,mt:0}}
            textAlign="center"
            align='center'
            inputProps={{ style: {textAlign: 'center', marginTop:0} }}
            
        />                                    
        <Typography variant="body2">{translate('resources.companies.settings.overtime.hours_for_a')}</Typography>
        <StyledSelectInput
            source={source2}
            label={false}
            allowEmpty
            variant="standard"
            sx={{pl:1,pr:1, minWidth:'64px'}}
            choices={RATE}
        />
        <Typography variant="body2">{translate('resources.companies.settings.overtime.multiple')}</Typography>
    </Stack>
    )    
}

const CompanySettingForm = (props: any) => {
    const translate = useTranslate();
    const notify = useNotify();
    const backend = useGetBackend();
    const refresh = useRefresh();
    const [update,{isLoading}] = useUpdate();
    const [show_job_page,setShowJobPage] = useState(props.record.show_job_page)
    const has_backend = useGetBackend(); 
    const record = useRecordContext();
    const { loaded,identity } = useGetIdentity();

    const onChangeIncludeOtFromSpentTotal = (fieldValue:any, name:string, allValues:any):any => {
        const result:any = {}
        if (fieldValue === true && allValues?.remove_ot_diff === false) {
            result['remove_ot_diff'] = true
        }
        return result;
    };
    
    const oncangeDecorator = useMemo(() => {
        return [
            createDecorator(
                {
                    field: 'include_ot_from_spent_total',
                    updates: onChangeIncludeOtFromSpentTotal,
                }
            )
        ];
    }, []);

    if (!loaded) {
        return null;
    }
    const reload = (data,flag) => {
        if (get(data,flag) !== get(record,flag)){
            window.location.reload()
        };
    };
    
    const onSave = (values: any, redirect: any) => {
        update(
            'company',
            { id: props.record.id, data: values, previousData: props.record },
            {
                mutationMode: 'pessimistic',
                onSuccess: (data: any) => {
                    notify('Element Updated');
                    reload(data,'allow_all_workers_to_add_time');
                    reload(data,'add_time_interface');
                    reload(data,'show_job_page');
                    reload(data,'allow_job_position');
                },
                onError: (error: any) => {
                    notify(`Element Failed Updated ${error.message}`);
                },
            }
        );
    };
    const maxDate = moment().subtract(1, 'days');
    const minDate = moment().subtract(NUMBER.TWO, 'weeks').startOf('week');

    return (
        <FormWithRedirect
            {...props}
            redirect="/setting"
            decorators={oncangeDecorator}
            save={onSave}
            render={formProps => {
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12}>
                                    <Card sx={{ p: 3 }}>
                                        <CardTitle title={translate('resources.companies.settings.overtime.title')} />
                                        <Stack flexDirection={'row'} alignItems="left">
                                            <Typography variant="body2"><b>{translate('resources.companies.settings.overtime.weekly_overtime')}</b> </Typography>
                                        </Stack>
                                        <OvertimeConfigLine prefix={translate('resources.companies.settings.overtime.first_threshold_at')} order="First" source="ot_weekly_first_threshold" source2="ot_weekly_first_threshold_rate"/>
                                        <OvertimeConfigLine prefix={translate('resources.companies.settings.overtime.second_threshold_at')} order="Second" source="ot_weekly_sec_threshold" source2="ot_weekly_sec_threshold_rate"/>
                                        <Stack flexDirection={'row'} alignItems="left">
                                            <Typography variant="body2"><b>{translate('resources.companies.settings.overtime.daily_overtime')}</b> </Typography>
                                        </Stack>
                                        <OvertimeConfigLine prefix={translate('resources.companies.settings.overtime.first_threshold_at')} order="First" source="ot_daily_first_threshold" source2="ot_daily_first_threshold_rate"/>
                                        <OvertimeConfigLine prefix={translate('resources.companies.settings.overtime.second_threshold_at')} order="Second" source="ot_daily_sec_threshold" source2="ot_daily_sec_threshold_rate"/>
                                        <Stack flexDirection={'row'} alignItems="center">
                                            <Typography variant="body2"><b>{translate('resources.companies.settings.overtime.seventh_consecutive_overtime')}</b> </Typography>
                                            <BooleanInput
                                                sx={{paddingLeft:2}}
                                                source="ot_seventh_day_full_ot"
                                                label=""
                                                helperText={false}
                                            />
                                        </Stack>
                                        <Condition when="ot_seventh_day_full_ot" is={true}>                                        
                                            <Stack sx={{ml:4}} flexDirection={'row'} justifyContent="flex-start" alignItems="center">
                                                <Typography variant="body2">{translate('resources.companies.settings.overtime.first_eight_hours_at')}</Typography>
                                                <StyledSelectInput
                                                    source="ot_seventh_day_first_threshold_rate"
                                                    label={false}
                                                    allowEmpty
                                                    variant="standard"
                                                    sx={{pl:1,pr:1}}
                                                    choices={RATE}
                                                    /> <Typography variant="body2">{translate('resources.companies.settings.overtime.times_of_hourly_rate')}</Typography>
                                            </Stack> 
                                            <Stack sx={{ml:4}} flexDirection={'row'} justifyContent="flex-start" alignItems="center">
                                                <Typography variant="body2">{translate('resources.companies.settings.overtime.there_after_at')}</Typography>
                                                <StyledSelectInput
                                                    source="ot_seventh_day_sec_threshold_rate"
                                                    label={false}
                                                    allowEmpty
                                                    variant="standard"
                                                    sx={{pl:1,pr:1}}
                                                    choices={RATE}
                                                    /> <Typography variant="body2">{translate('resources.companies.settings.overtime.times_of_hourly_rate')}</Typography>
                                            </Stack>   
                                        </Condition>
                                        <Stack sx={{ml:-2}} flexDirection={'row'} justifyContent="flex-start" alignItems="center">
                                            <AdditionalOtSettings/>
                                        </Stack>   
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <Card sx={{ p: 3 }}>
                                        <CardTitle title={translate('resources.companies.settings.additional_settings.title')} />
                                        <Grid container spacing={2}>
                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <SelectInput
                                                    label='resources.companies.fields.time_format'
                                                    source="time_format"
                                                    fullWidth
                                                    helperText={false}
                                                    choices={TIME_FORMAT}
                                                />
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <SelectInput
                                                    source="hours_per_day"
                                                    fullWidth
                                                    helperText={false}
                                                    choices={HOURS_PER_DAY_SELECTION}
                                                />
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <SelectInput
                                                    source="default_bonus_split_type"
                                                    fullWidth
                                                    choices={bonusSplitTypeSelection}
                                                />
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <SelectInput
                                                    source="default_budget_type"
                                                    fullWidth
                                                    choices={BudgetChoices}
                                                />
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={12} xs={12} >
                                                <SelectInput
                                                    source="hours_format"
                                                    fullWidth
                                                    choices={HOURS_FORMAT}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <Card sx={{ p: 3 }}>
                                        <CardTitle title={translate('resources.companies.settings.worker_view.title')} />
                                        <Grid container spacing={2}>
                                            <Grid item lg={12} xs={12}>
                                                {(identity?.company?.allow_zapier_api || !identity?.company?.is_integrated_company) &&
                                                    <Stack flexDirection={'row'} alignItems="center">
                                                        <Typography variant="body2">{translate('resources.companies.fields.allow_all_workers_to_add_time')}</Typography>
                                                        <BooleanInput
                                                            sx={{ paddingTop: 2, paddingLeft: 2 }}
                                                            source="allow_all_workers_to_add_time"
                                                            label=""
                                                            helperText={false}
                                                        />

                                                    </Stack>
                                                }
                                                <Stack flexDirection={'row'} alignItems="center">
                                                    <Typography variant="body2">{translate('resources.companies.fields.hide_bonuses_from_other_workers')} </Typography>
                                                    <BooleanInput
                                                        sx={{ paddingLeft: 2 }}
                                                        source="hide_bonuses_from_other_workers"
                                                        label=""
                                                        helperText={false}
                                                    />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={12}>
                                    <Card sx={{ p: 3 }}>
                                        <CardTitle title={translate('resources.companies.settings.period.title')} />
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SelectInput
                                                    label='resources.companies.settings.period.payroll_cycyle'
                                                    source="period_schedule"
                                                    fullWidth
                                                    allowEmpty
                                                    helperText={false}
                                                    choices={SCHEDULE}
                                                />
                                            </Grid>
                                            <FormDataConsumer>
                                                {({ formData, ...rest }) => formData.period_schedule!== 'semi-monthly' &&
                                                    <Grid
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SelectInput
                                                            source="payroll_week_day"
                                                            fullWidth
                                                            allowEmpty
                                                            helperText={false}
                                                            choices={WEEKDAY}
                                                            disabled={record.has_closed_period || false}
                                                        />
                                                    </Grid>}   
                                            </FormDataConsumer>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <DatePickerInput
                                                    source="last_closing_date"
                                                    fullWidth
                                                    validate={!record.has_periods && required()}
                                                    minDate={minDate}
                                                    helperText={record.has_closed_period && 'resources.companies.settings.period.after_period_closed_cannot_change'}
                                                    maxDate={maxDate}
                                                    disabled={record.has_closed_period || false}
                                                />
                                            </Grid>
                                            {!backend && <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                              >
                                             <SelectInput
                                                    source="add_time_interface"
                                                    fullWidth
                                                    helperText={false}
                                                    choices={ADD_TIME_INTERFACE}
                                                />
                                            </Grid>}
                                        </Grid>                                        
                                    </Card>
                                </Grid>
                                <Grid item xs={12} lg={12}>
                                    <Card sx={{ p: 3 }}>
                                    <HasBackendNotConnected>
                                        <HasPermission resource="menu-jobs" action="list">
                                            <Stack flexDirection={'row'} alignItems="center">
                                                <CardHeader sx={{paddingTop:2}} title={translate('resources.companies.fields.job_page')} />
                                                <BooleanInput
                                                    sx={{paddingTop:2}}
                                                    source="show_job_page"
                                                    label=""
                                                    helperText={false}
                                                    onChange={(newValue) => setShowJobPage(newValue)}
                                                />
                                            </Stack>
                                        </HasPermission>
                                    </HasBackendNotConnected>
                                        <Stack flexDirection={'row'} alignItems="center">
                                            <CardHeader title={translate('resources.companies.fields.job_ids')} />
                                            <BooleanInput
                                                sx={{paddingTop:3,paddingLeft:3}}
                                                source="allow_job_position"
                                                label=""
                                                helperText={false}
                                                />
                                        </Stack>
                                        <Condition when="allow_job_position" is={true}>                                        
                                            <Grid item xs={12} lg={12}>
                                                <JobPositionDataGrid filter={{company_id:{_eq:record.id}}} show_job_page={show_job_page || has_backend}/>
                                            </Grid>
                                        </Condition>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <Card sx={{ p: 3 }}>
                                <CardHeader title={translate('resources.companies.settings.report.title')}/>
                                <Grid item xs={12} lg={12}>
                                    <PayrollExportDataGrid  filter={{company_id:{_eq:record.id}}}/>
                                </Grid>
                            </Card>
                        </Grid>
                        <Grid item lg={12} xs={12}>
                            <StyleToolbar
                                sx={{
                                    backgroundColor: '#FFF',
                                }}
                                {...formProps}
                                mutationMode="undoable"
                                redirect="/setting"
                                invalid={formProps.invalid}
                                handleSubmit={formProps.handleSubmit}
                                saving={formProps.saving}
                                resource="company"
                            >
                                <StyledSaveButton  
                                        saving={isLoading} onSave={onSave} />
                            </StyleToolbar>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
};

export const CompanySetting = (props: any) => {
    const { loaded, identity } = useGetIdentity();
    const translate = useTranslate();
    if (!loaded) {
        return null;
    }
    return (
        loaded && (
            <Edit
                component="div"
                {...props}
                resource="companies"
                id={identity?.company.id}
                title={<Title title={translate("resources.companies.settings.title")} />}
            >
                <CompanySettingForm {...props} />
            </Edit>
        )
    );
};
