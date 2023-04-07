import { Icon } from '@iconify/react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import { styled } from '@mui/material/styles';
import { AutocompleteInput, FormWithRedirect,FormDataConsumer,FunctionField, ReferenceField, ResourceContextProvider, SaveButton, useGetIdentity, useGetList, useNotify, useRedirect, useTranslate, useUnselectAll, useUpdate } from 'react-admin';
import { useQueryClient } from 'react-query';
import { ArrayInput } from '../../components/ArrayInput';
import { StyledSimpleFormGroupIterator } from '../../components/ArrayInput/SimpleFormGroupIterator';
import { CustomFormDisplayField } from '../../components/fields/CustomFormDisplayField';
import { InfoLabel } from '../../components/fields/InfoLabel';
import { MaskedTimeInput, validateTime } from '../../components/fields/MaskedTimeInput';
import { convertNumToTime } from '../../utils/formatter';
import { PeriodField, StyledTypography } from './Payrolls';
import { getPayrollData, parseTime, StyledLoadingButton, StyledReferenceInput, StyleToolbar } from './weeklyEntries';
import lodashMemoize from 'lodash/memoize';

const StyledMaskedTimeInput = styled(MaskedTimeInput)({
    alignItems: "center",
    width:55
});

type Memoize = <T extends (...args: any[]) => any>(
    func: T,
    resolver?: (...args: any[]) => any
) => T;

export const memoize: Memoize = (fn: any) =>
    lodashMemoize(fn, (...args) => JSON.stringify(args));


export const validateTotalHours =  memoize((propay_hours) => (value, values) => {
    const errorMessage = validateTime(value)
    if (errorMessage){
        return errorMessage
    }
    const parseValue = parseTime(value)
    return parseValue && parseValue < propay_hours? 'The total hours cannot be less than the sum of propay hours and manually added hours..': undefined
});

export const prepareOTData = (data:any,previousData:{},submit_hours_id:any) => {
    data.ot_payroll_ids.map((payroll) => {
        _.set(payroll, 'total_worked_hours',parseTime(payroll.total_worked_hours) || 0.0)
    });
return {id: submit_hours_id, data: {id: data.submit_hours_id,ot_payroll_ids:data.ot_payroll_ids}, previousData: {id: submit_hours_id,ot_payroll_ids:previousData}}
}


export const OvertimeTotalHoursInputScreen = (props: any) => {
    const {propayId,setOvertimeInput,setPropayId,setTotalHours,onClose,redirect:redirectTo,payrollIds,isFromPropayCard,selectedIds} = props;
    var filter = {id: { _in: payrollIds },status: {_neq: 'paid'},has_overtime: {_eq: true}}

    const { data: previousPayrollData, isLoading: payrollLodaing }: any = useGetList('payrolls', {
        sort: { field: 'period_id', order: 'DESC' },
        filter: filter
        });

    const [update,{isLoading}] = useUpdate();
    const notify = useNotify();
    const translate = useTranslate();
    const redirect = useRedirect();
    const queryClient = useQueryClient();
    const { loaded, identity } = useGetIdentity();
    const unselectAll = useUnselectAll('attendances');
    const hasDailyOTConfigured = identity?.company?.has_daily_overtime_configured
    const PayrollData = getPayrollData(previousPayrollData,hasDailyOTConfigured, identity?.company?.period_schedule)

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
    }

    const onSaveOvertimeInput = (data: any) => {
        callAction({ data: prepareOTData(data,PayrollData,identity?.company?.submit_hours_id),onSuccess:() => {
            if (!identity.company.include_ot_from_spent_total && selectedIds) {
                if (onClose) {
                    onClose();
                }
                redirect(redirectTo+'/paybonus', '', null,{}, { selectedIds: selectedIds,redirectTo:redirectTo,isFromPayrollCard:props.isFromPayrollCard}); 
            } else {
                setOvertimeInput(false)
                setTotalHours(false)
                if(_.size(selectedIds)){
                    queryClient.invalidateQueries(['attendances','getList']);
                    unselectAll()
                }
                if(propayId){
                    setPropayId(0)
                }
                if (onClose) {
                    onClose();
                }
                if (redirectTo) {
                    redirect(redirectTo, '', null, null, { _scrollToTop: false });
                }
            }
        },resource:'submitHours'})
    }

    const backToOvertimeScreen = () => {
        setTotalHours(false)
        setOvertimeInput(true)
    }

    
    if (payrollLodaing){
        return null;
    }
    if (!loaded) return null;
    return (
        <ResourceContextProvider value="submitHours">
            <FormWithRedirect
                {...props}
                initialValues={{ id:identity?.company?.submit_hours_id,ot_payroll_ids: PayrollData}}
                render={(formProps: any) => {
                    return (
                        <Grid className='set-over-time-grid' item lg={12} md={12} sm={12} xs={12} spacing={3}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{p:1}}>
                                <Box className='overtime-tooltip' >
                                    <Stack direction="row" spacing={1}>
                                        <Icon className='overtime-tooltip-icon' width={20} height={20} icon="material-symbols:info" fr='' />
                                        <Typography variant="caption" color="textSecondary">{translate("resources.weekEntryLines.total_hours_worked_per_week_days_text")}</Typography>
                                    </Stack>
                                </Box>
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
                                               <PeriodField />
                                            </ReferenceField>
                                        </CustomFormDisplayField>
                                        <StyledReferenceInput
                                            source="employee_id"
                                            filter={{active: {_eq: true}}}
                                            reference="employees"
                                            disabled={true}
                                            variant="standard"
                                            label='Worker'
                                        >
                                            <AutocompleteInput fullWidth />
                                        </StyledReferenceInput>
                                        {hasDailyOTConfigured && 
                                            <StyledMaskedTimeInput
                                                textAlign="center"
                                                source="overtime_1_5_mul"
                                                label='resources.payrolls.fields.overtime_1_5_mul'
                                                variant="standard" 
                                            />}
                                        {hasDailyOTConfigured && <StyledMaskedTimeInput
                                                textAlign="center"
                                                source="overtime_2_mul"
                                                label='resources.payrolls.fields.overtime_2_mul'
                                                variant="standard" 
                                            />
                                        }
                                        <FormDataConsumer label='resources.payrolls.fields.total_worked_hours'>
                                            {({ getSource, scopedFormData, ...rest }) => {
                                                return (
                                                    <>
                                                    <StyledMaskedTimeInput
                                                        {...rest}
                                                        source={getSource('total_worked_hours')}
                                                        variant="standard" 
                                                        validate={[validateTotalHours(scopedFormData.total_man_and_prop_hrs)]}
                                                    />
                                                    <>
                                                        <InfoLabel>
                                                            <StyledTypography>{
                                                                'Total (Propay + Manual) Hrs: '+ convertNumToTime(scopedFormData.total_man_and_prop_hrs)
                                                            } </StyledTypography>
                                                        </InfoLabel>
                                                        </>
                                                    </>)
                                                }}
                                        </FormDataConsumer>
                                    </StyledSimpleFormGroupIterator>
                                </ArrayInput>
                            </Grid>
                            <Grid className='overtime-action-footer' container columnSpacing={2} sx={{ marginTop:0 }}>
                                <StyleToolbar
                                    sx={{
                                        bottom: 0,
                                        padding:0,
                                        marginBottom: 0,
                                        marginLeft: 0,
                                        marginRight: 0,
                                        left: 0,
                                        right: 0,
                                        backgroundColor: '#FFF',
                                        flex: 1,
                                        position: 'relative',
                                        justifyContent: 'space-between',
                                    }}
                                    {...formProps}>
                                    <Stack className='overtime-btn-cancel-save' direction="row" spacing={1} sx={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                        <StyledLoadingButton
                                        className='overtime-back-btn'
                                            variant='outlined'
                                            size="small"
                                            onClick={backToOvertimeScreen}
                                        >
                                            Back
                                        </StyledLoadingButton>
                                    </Stack>
                                    <SaveButton className='save-btn-overtime' saving={isLoading} onSave={onSaveOvertimeInput} />
                                </StyleToolbar>
                            </Grid>
                        </Grid>
                    );
                }}
            />
        </ResourceContextProvider>
    )
};