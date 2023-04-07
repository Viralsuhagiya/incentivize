import { Grid, Stack, Typography, Button as MuiButton, IconButton, InputAdornment } from '@mui/material';
import { useMutation, Button, TextInput, FormWithRedirect, TextField, useRecordContext, SaveButton, useRedirect, useRefresh, CRUD_UPDATE } from 'react-admin';
import { useIdentityContext } from '../../components/identity';
import { Edit } from '../../layout/Edit';
import { useQueryClient } from 'react-query';
import { copyTextToClipboard } from '../employees/EmployeeInvite';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ZapierSettingForm = (props: any) => {
    const record = useRecordContext();
    const queryClient = useQueryClient();
    const [mutate, { loading }] = useMutation();
    const handleClick = () => {
        mutate(
            {
                type: 'update',
                resource: 'companies',
                payload: {
                    id: record.id,
                    action: 'generate_apikey',
                    data: {}
                }
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (data: any, variables: any = {}) => {
                    queryClient.invalidateQueries(['companies', 'getOne', String(data.data.id)])
                },
                onFailure: error => {
                    console.log('>>>>There is error ', error.message);
                },
            }
        );
    }

    return (
        <FormWithRedirect
            {...props}
            render={formProps => {
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12}>
                                    <Stack direction='column'>
                                        <TextInput
                                            fullWidth
                                            disabled={true}
                                            source="api_key"
                                            label="Api Key"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            color="primary"
                                                            size="large"
                                                            onClick={() => {
                                                                copyTextToClipboard(record.api_key)
                                                            }}
                                                        >
                                                            <ContentCopyIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <SaveButton
                                            {...props}
                                            {...formProps}
                                            saving={loading}
                                            onSave={handleClick}
                                            label="Generate Api Key"
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
};

export const ZapierSetting = (props: any) => {
    const identity = useIdentityContext();
    return <Edit
        component="div"
        {...props}
        resource="companies"
        id={identity?.company.id}
    >
        <ZapierSettingForm {...props} />
    </Edit>

};