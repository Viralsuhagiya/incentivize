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
    useUpdate
} from 'react-admin';
import CardTitle from '../../components/CardTitle';
import { PasswordInputField } from '../../components/fields/inputs';
import { useIdentityContext } from '../../components/identity';
import { Edit } from '../../layout/Edit';
import { Title } from '../../layout/Title';
import { StatusButton } from './TSheetSetting';

const RESOURCE = 'salesForceBackends';

const SalesForceSettingForm = (props: any) => {
    const notify = useNotify();
    const [update] = useUpdate();
    const [create] = useCreate();
    const isDisabled = props.record.status === 'connected';
    const isCreate = !props.record.id ? true : false;

    const authenticate = (client_id: string, salesforce_id: string,domain_url:string) => {
        // eslint-disable-next-line no-native-reassign
        origin = window.location.origin;
        //uncooment this if you want this for local
        // origin = 'http://localhost:8069';
        const redirect_url = `${origin}/api/salesforce-connect`;
        var salesFroceLink = `${domain_url}/services/oauth2/authorize?response_type=code&redirect_uri=${redirect_url}&client_id=${client_id}&state=${salesforce_id}`;
        window.open(salesFroceLink);
    };

    const onSave = (values: any, redirect: any) => {
        if (isCreate) {
            let origin = window.location.origin;
            let redirect_uri = `${origin}/api/salesforce-connect`;
            const new_vals = { ...values, redirect_uri: redirect_uri };
            create(
                RESOURCE,
                { data: new_vals },
                {
                    onSuccess: (response: any) => {
                        notify('Element Created');
                        authenticate(response.client_id, response.id,response.domain_url);
                        props.onCreateSuccess(response.id);
                    },
                    onError: (error: any) => {
                        notify(`Element Failed Updated ${error.message}`);
                    },
                }
            );
        } else {
            updateSalesForce(values, props.record);
        }
    };

    const disconnect = ({ record }: any) => {
        const values = { ...record, status: 'pending' };
        updateSalesForce(values, record);
    };

    const updateSalesForce = (values: any, old_values: any) => {
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
                    notify('Element Updated');
                    if (old_values.status === 'pending') {
                        authenticate(data.client_id, data.id,data.domain_url);
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
                                            <CardTitle title="Configuration" />
                                            <StatusButton {...props} resource='salesForceBackends'/>
                                        </Stack>
                                        <TextInput
                                            fullWidth
                                            autoComplete="new-clientId" 
                                            label="Client Id"
                                            source="client_id"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        <PasswordInputField
                                            fullWidth
                                            source="client_secret"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        <TextInput
                                            fullWidth
                                            label="Domain"
                                            source="domain_url"
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
                                                    label="Save"
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
                                                    label="Disconnect"
                                                />
                                            </Stack>
                                        ) : (
                                            <SaveButton
                                                fullWidth
                                                {...props}
                                                {...formProps}
                                                saving={formProps.saving}
                                                label="Save & Connect"
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

const SalesForceEditForm = (props: any) => {
    return (
        <Edit
            component="div"
            {...props}
            resource={RESOURCE}
            id={props.id}
            title={<Title title="Settings" />}
        >
            <SalesForceSettingForm {...props} />
        </Edit>
    );
};

const SalesForceCreateForm = (props: any) => {
    return (
        <Create
            component="div"
            {...props}
            resource={RESOURCE}
            title={<Title title="Settings" />}
        >
            <SalesForceSettingForm {...props} />
        </Create>
    );
};

export const SalesForceSetting = (props: any) => {
    const identity = useIdentityContext();
    const [salesForceId, setSalesForceId] = useState(
        identity?.company?.salesforce_backend_id || null
    );
    useEffect(() => {
        if (!salesForceId && identity?.company?.salesforce_backend_id) {
            setSalesForceId(identity?.company?.salesforce_backend_id);
        }
    }, [identity, salesForceId]);

    const onCreateSuccess = (salesforce_id: string) => {
        setSalesForceId(salesforce_id);
    };

    if (!identity?.company) {
        return <LoadingIndicator />;
    }

    return salesForceId ? (
        <SalesForceEditForm
            {...props}
            id={salesForceId}
            onCreateSuccess={onCreateSuccess}
        />
    ) : (
        <SalesForceCreateForm
            initialValues={() => ({
                name: identity.company.name,
                company_id: identity.company.id,
            })}
            onCreateSuccess={onCreateSuccess}
        />
    );
};
