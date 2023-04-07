import { Card, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    Create,
    FormWithRedirect,
    LoadingIndicator,
    required,
    SaveButton,
    TextInput,
    useCreate,
    useNotify,
    useUpdate,
    useTranslate,
    PasswordInput,
} from 'react-admin';
import CardTitle from '../../components/CardTitle';
import { StatusLabelField } from '../../components/fields';
import { useIdentityContext } from '../../components/identity';
import { Edit } from '../../layout/Edit';
import { Title } from '../../layout/Title';
import { TSHEET_STATUS_COLOR } from './CompanyConstants';

const RESOURCE = 'dataverseConnectors';

export const StatusButton = (props: any) => {
    const { record }: any = props;
    if (!record.id) {
        return null;
    }

    return (
        <StatusLabelField
            colors={TSHEET_STATUS_COLOR}
            source="status"
            resource={props.resource}
            record={record}
        />
    );
};

const DataverseSettingForm = (props: any) => {
    const notify = useNotify();
    const [update] = useUpdate();
    const [create] = useCreate();
    const translate = useTranslate();
    const isDisabled = props.record.status === 'connected';
    const isCreate = !props.record.id ? true : false;
    const testConnection = (id:any) => {
        callUpdate({id:id, is_test_connection:true}, {}, (data)=>{
            //TODO: notify that test successfull
        })
    }

    const onSave = (values: any, redirect: any) => {
        if (isCreate) {
            const new_vals = { ...values };
            create(
                RESOURCE,
                { data: new_vals },
                {
                    onSuccess: (response: any) => {
                        testConnection(values.id)
                        props.onCreateSuccess(response.id);
                    },
                    onError: (error: any) => {
                        notify(`Element Failed Updated ${error.message}`);
                    },
                }
            );
        } else {
            updateConnector(values, props.record);
        }
    };

    const disconnect = ({ record }: any) => {
        const values = { ...record, status: 'pending' };
        callUpdate(values, record);
    };

    const updateConnector = (values: any, old_values: any, onSuccessCallback?:any) => {
        callUpdate(values, old_values, (data)=>{
            if(onSuccessCallback){
                onSuccessCallback(data)
            }
            testConnection(values.id)
        })
    }
    
    const callUpdate = (values: any, old_values: any, onSuccessCallback?:any) => {
        update(
            RESOURCE,
            {
                id: values.id,
                data: values,
                previousData: old_values,
            },
            {
                mutationMode: 'pessimistic',
                onSuccess: (data: any) => {
                    notify('Saved');
                    if(onSuccessCallback){
                        onSuccessCallback(data)
                    }
                },
                onError: (error: any) => {
                    notify(`Element Failed Updated ${error.message}`);
                },
            }
        );
    };

    return (
        <FormWithRedirect
            {...props}
            redirect="/setting/sheet"
            save={onSave}
            render={formProps => {
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Grid container spacing={2}>
                                <Grid item lg={12} xs={12}>
                                    <Card sx={{ p: 3 }}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                        >
                                            <CardTitle title={translate('resources.tsheetConnectors.title')}/>
                                            <StatusButton {...props} resource='tsheetConnectors'/>
                                        </Stack>
                                        <TextInput
                                            fullWidth
                                            autoComplete="new-url" 
                                            source="url"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        <TextInput
                                            fullWidth
                                            autoComplete="new-tenantId" 
                                            source="tenant_id"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        <TextInput
                                            fullWidth
                                            autoComplete="new-clientId" 
                                            source="client_id"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        <PasswordInput
                                            fullWidth
                                            autoComplete="new-clientsecret" 
                                            source="client_secret"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        {props.record.status === 'connected' ? (
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                            >
                                                <SaveButton
                                                    {...props}
                                                    {...formProps}
                                                    saving={formProps.saving}
                                                    label={translate("resources.tsheetConnectors.save")}
                                                    redirect="edit"
                                                />
                                                <SaveButton
                                                    {...props}
                                                    {...formProps}
                                                    saving={false}
                                                    onSave={false}
                                                    onClick={() =>
                                                        disconnect(props)
                                                    }
                                                    label={translate("resources.tsheetConnectors.disconnect")}
                                                />
                                            </Stack>
                                        ) : (
                                            <SaveButton
                                                fullWidth
                                                {...props}
                                                {...formProps}
                                                saving={formProps.saving}
                                                label={translate("resources.tsheetConnectors.save_and_connect")}
                                                redirect="edit"
                                            />)}

                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
};

const DataverseEditForm = (props: any) => {
    return (
        <Edit
            component="div"
            {...props}
            resource={RESOURCE}
            id={props.id}
            title={<Title title="Settings" />}
        >
            <DataverseSettingForm {...props} />
        </Edit>
    );
};

const DataverseCreateForm = (props: any) => {
    return (
        <Create
            component="div"
            {...props}
            resource={RESOURCE}
            title={<Title title="Settings" />}
        >
            <DataverseSettingForm {...props} />
        </Create>
    );
};

export const DataverseSetting = (props: any) => {
    const identity = useIdentityContext();
    const [connectorId, setConnectorId] = useState(
        identity?.company?.dataverse_connector_id || null
    );
    useEffect(() => {
        if (!connectorId && identity?.company?.dataverse_connector_id) {
            setConnectorId(identity?.company?.dataverse_connector_id);
        }
    }, [identity, connectorId]);

    const onCreateSuccess = (tsheet_id: string) => {
        setConnectorId(tsheet_id);
    };

    if (!identity?.company) {
        return <LoadingIndicator />;
    }

    return connectorId ? (
        <DataverseEditForm
            {...props}
            id={connectorId}
            onCreateSuccess={onCreateSuccess}
        />
    ) : (
        <DataverseCreateForm
            initialValues={() => ({
                name: identity.company.name,
                company_id: identity.company.id,
            })}
            onCreateSuccess={onCreateSuccess}
        />
    );
};
