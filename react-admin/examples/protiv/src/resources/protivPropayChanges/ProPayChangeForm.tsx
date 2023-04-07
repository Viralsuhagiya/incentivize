/* eslint-disable no-eval */
import { Helmet } from 'react-helmet-async';
import _ from 'lodash';
import {
    List as MuiList, Box, Grid, ListItem, ListItemText, Typography
} from '@mui/material';
import { FunctionField, Labeled, ReferenceField, ResourceContextProvider, Show, TextField, useRecordContext } from 'react-admin';
import { StyledFieldWithLabel } from '../propays';
import { MoneyField } from '../../components/fields';
import { JobNameField } from '../jobs/job';
import { styled } from '@mui/material/styles';
import { DialogFormWithRedirect } from '../../components/dialog-form';
import { DateTimeTextLink } from '../../components/fields/DateTimeTextField';

const StyledLabeled = styled(Labeled)({
    '.MuiInputLabel-root': {
        fontWeight: 'bold',
        color:'#919EAB',
        fontSize: '0.9rem'
    }
});

export const MailMessageChanges = (props:any) => {
    return (
        <ResourceContextProvider value='MailMessage'>
            <Show title={<></>}>
                <MailMessageChangesView />
            </Show>
        </ResourceContextProvider>
    );
}

const TaskList = (props:any) => {
    const {tasklist,label} =props;
    return (<Box>
        <StyledLabeled label={label} sx={{
            fontWeight: 'bold',
            color: '#637381'
        }}>
            <MuiList>
                {tasklist.map(task => (
                    <ListItem>
                        <ListItemText
                            primary={`${task}`}
                        />
                    </ListItem>
                ))}
            </MuiList>
        </StyledLabeled>
</Box>)
}

export const getTrackingValues = (mail_message_obj:any) => {
    const tracking_value_ids = _.get(mail_message_obj,'tracking_value_ids')
    const name_tracking_dict = _.find(tracking_value_ids, ['field', 'name'])
    const task_names_tracking_dict = _.find(tracking_value_ids, ['field', 'task_names'])
    const job_id_tracking_dict = _.find(tracking_value_ids, ['field', 'job_id'])
    const amount_tracking_dict = _.find(tracking_value_ids, ['field', 'amount'])
    return {
        old_name:_.get(name_tracking_dict,'old_value_char'),
        new_name:_.get(name_tracking_dict,'new_value_char'),
        old_amount:_.get(amount_tracking_dict,'old_value_float'),
        new_amount:_.get(amount_tracking_dict,'new_value_float'),
        old_task_names:_.get(task_names_tracking_dict,'old_value_char'),
        new_task_names:_.get(task_names_tracking_dict,'new_value_char'),
        old_job_id:_.get(job_id_tracking_dict,'old_value_integer'),
        new_job_id:_.get(job_id_tracking_dict,'new_value_integer'),
    }
}

export const MailMessageChangesView = (props:any) => {
    const record = useRecordContext(props);
    if (!record) return null;
    const trackingValues = getTrackingValues(record);
    const new_record = {...record,...trackingValues}
    const old_tasks = new_record?.old_task_names ? eval(new_record?.old_task_names) : []
    const new_tasks = new_record?.new_task_names ?  eval(new_record?.new_task_names) : []
    const redirectTo = `/propay/propay`
    return (
        <ResourceContextProvider value='MailMessage'>
            <DialogFormWithRedirect {...props} hideToolbar={true} record={new_record} redirect={redirectTo} render={(formProps: any) => {
                return (
                    <Box className='propay-change-modal-box' sx={{ px: 1, overflowY: 'auto' }}>
                        <Grid item xs={12}>
                            <Typography variant='h6' gutterBottom align='center' className='propay-change-modal-heading'>
                                Propay details have been modified!
                            </Typography>
                            <Typography variant='subtitle2' gutterBottom align='center'>
                                Here is the breakdown of the changes at <FunctionField
                                     textAlign='right'
                                     source='create_date'
                                     label=''
                                     render={(record: any) => (
                                     <DateTimeTextLink record={record} />
                                  )}
                               />
                            </Typography>
                        </Grid>
                        {(new_record.old_name || new_record.new_name) && new_record.old_name !== new_record.new_name ?
                            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <StyledFieldWithLabel>
                                        <FunctionField 
                                         source='old_name'
                                         render={record => `${record.old_name !== 'false' ? record.old_name : ''}`}
                                        />
                                    </StyledFieldWithLabel>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <StyledFieldWithLabel>
                                        <TextField source='new_name' />
                                    </StyledFieldWithLabel>
                                </Grid>
                            </Grid> : <></>
                        }
                        {(new_record.old_amount || new_record.new_amount) && new_record.old_amount !== new_record.new_amount ?
                            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <StyledFieldWithLabel><MoneyField source='old_amount' /></StyledFieldWithLabel>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <StyledFieldWithLabel><MoneyField source='new_amount' /></StyledFieldWithLabel>
                                </Grid>
                            </Grid> : <></>
                        }
                        {(new_record.old_job_id || new_record.new_job_id) && new_record.old_job_id !== new_record.new_job_id ?
                            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <StyledFieldWithLabel>
                                        <ReferenceField source='old_job_id' reference='jobs' link={false}>
                                            <JobNameField />
                                        </ReferenceField>
                                    </StyledFieldWithLabel>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <StyledFieldWithLabel>
                                        <ReferenceField source='new_job_id' reference='jobs' link={false}>
                                            <JobNameField />
                                        </ReferenceField>
                                    </StyledFieldWithLabel>
                                </Grid>
                            </Grid> : <></>
                        }
                        {(new_record.old_task_names || new_record.new_task_names) && new_record.old_task_names !== new_record.new_task_names ?
                            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TaskList tasklist={old_tasks} label='Old Tasks' />

                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TaskList tasklist={new_tasks} label='New Tasks' />
                                </Grid>
                            </Grid> : <></>
                        }
                        <Helmet>
                            <title>ProPay Changes</title>
                        </Helmet>
                    </Box>
                )
        }} />
        </ResourceContextProvider>
    );
};
