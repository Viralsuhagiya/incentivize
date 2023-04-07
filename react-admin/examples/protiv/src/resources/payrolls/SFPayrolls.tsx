
import {
    Grid
} from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { AutocompleteInput, Button, DateField, Edit, FormDataConsumer, FormWithRedirect, ReferenceField, ReferenceInput, required, ResourceContextProvider, 
    SaveButton, SimpleForm, TextField, useGetList, useRedirect, useTranslate } from 'react-admin';
import { useLocation } from 'react-router';
import { ArrayInput } from '../../components/ArrayInput';
import DialogForm from '../../components/DialogForm';
import { FormatTimeField, NumberToTimeField, ReferenceInputObj } from '../../components/fields';
import { CustomFormDisplayField } from '../../components/fields/CustomFormDisplayField';
import { useIdentityContext } from '../../components/identity';
import { transformForSubmit } from '../../ra-data-odoo/DataProvider';
import { JobNameField } from '../jobs/job';
import { StyledSimpleFormIterator } from '../propays/Propay';
import { CustomToolbar } from './BonusPayrolls';
import { StyleToolbar } from './weeklyEntries';

export const ActionLinkProPayForm = (props: any) => {
    const redirect = useRedirect();
    const handleClick = (data:any)  => {
        redirect(props.redirectpathname+'/link-propay', '', null,{}, { record: data.payroll_id_obj}); 
    };
    return (
        <>
        <FormWithRedirect
            render={(formProps: any) => {
                return (
                    <Grid>
                        <Grid className='sf-payroll-link-propay' item lg={12} xs={12}>
                            <ReferenceInputObj source='payroll_id'
                                validate={[required()]}
                                filter={{'total_hours': {_gt: 0}}}
                                reference='payrolls' label='Payrolls' >
                                <AutocompleteInput
                                />
                          
                            </ReferenceInputObj>
                            <StyleToolbar
                                {...formProps}
                            >
                                <SaveButton label='Next' onSave={handleClick}/>
                            </StyleToolbar>
                        </Grid>
                    </Grid>
                );
            }}
        />
    </>
    );
};
export const PayrollProPayLinkForm = (props: any) => {
    const {state:{record}} = useLocation();
    return <LinkProPayForm {...props} record={record}/>
};

const LinkProPayForm = (props: any) => {
    const { record } = props;
    const translate = useTranslate();
    const identity = useIdentityContext();
    const { data: attendance_only_ids_obj}: any = useGetList('attendances', {
        filter:  {id: { _in: record.attendance_only_idsIds }}
        });
    const transform = (data: any)=>{
        const updateData = transformForSubmit(data.attendance_only_ids_obj, data.previous_attendance_only_ids);
        const updated_attendance_only_ids = _.map(updateData, (item:any) => {
            return {'id':item.id,'propay_id':item.propay_id}
        });
        _.unset(data,'attendance_only_ids_obj')
        _.unset(data,'previous_attendance_only_ids')
        var values = _.values(_.merge(_.keyBy(data.attendance_ids, 'id'), _.keyBy(updated_attendance_only_ids, 'id')))
        return {...data,attendance_ids:values};
    }
    return (
        <ResourceContextProvider value='payrolls'>
            <Edit
                {...props}
                actions={false}
                transform={transform}
                component='div' 
                id={record.id}
                mutationMode={'pessimistic'}
            >
                <SimpleForm 
                    toolbar={<CustomToolbar {...props} success_msg='ProPay Changed.'/>}
                    initialValues={{ attendance_only_ids_obj: attendance_only_ids_obj,previous_attendance_only_ids:attendance_only_ids_obj }}
                    >
                        <TextField source='name' label={false}/>
                        <ArrayInput source='attendance_only_ids_obj' label={false}>
                            <StyledSimpleFormIterator
                                disableReordering
                                disableAdd
                                disableRemove
                            >
                                <CustomFormDisplayField source='date' >
                                    <DateField source='date' />
                                </CustomFormDisplayField>
                                {identity?.company?.show_job_page &&   
                                <CustomFormDisplayField source='job_id' reference='jobs'>
                                    <ReferenceField source='job_id' reference='jobs' link={false}>
                                        <JobNameField />
                                    </ReferenceField>
                                </CustomFormDisplayField>}
                                <FormDataConsumer label='ProPay'>
                                    {({ formData,getSource,scopedFormData, ...rest }) => {
                                        var filter = { status: {_in:['pending','approved']} }
                                        if (scopedFormData.employee_id){
                                            filter['selected_employee_ids'] = {_in:[scopedFormData.employee_id]}
                                        };
                                        if (scopedFormData.job_id){
                                            filter['job_id'] = {_eq:[scopedFormData.job_id]}
                                        };
                                        return <ReferenceInput
                                            source={getSource('propay_id')}
                                            reference='propays'
                                            variant='standard'
                                            helperText={false}
                                            label={''}
                                            allowEmpty
                                            emptyText={translate('resources.propays.no_propay')}
                                            emptyValue={0}
                                            filter={filter}
                                            link={false}
                                        >
                                            <AutocompleteInput source='propay_id' options={{ blurOnSelect: false }} />
                                        </ReferenceInput>
                                    }}
                                </FormDataConsumer>
                                <CustomFormDisplayField source='hours' >
                                    <FormatTimeField source='hours' textAlign='right' />
                                </CustomFormDisplayField>
                            </StyledSimpleFormIterator>
                        </ArrayInput>
                </SimpleForm>
            </Edit>
        </ResourceContextProvider>
    );
};

export const PropayLinkButton = (props:any) => {
    const openDialog = () => {
        dialogRef.current.open()
    };
    const dialogRef: any = React.useRef();
    return (
        <>
            <Button
                onClick={openDialog}
                sx={{minWidth:'unset',paddingLeft:1,marginLeft:1, whiteSpace: 'nowrap'}}
                variant='outlined'
                label='Link Propay'
            />
            <DialogForm title='Link Propay' ref={dialogRef}>
                <LinkProPayForm {...props} onSuccess={() => {
                        dialogRef.current.close();
                    }}/>
            </DialogForm>
        </>
    );
};
