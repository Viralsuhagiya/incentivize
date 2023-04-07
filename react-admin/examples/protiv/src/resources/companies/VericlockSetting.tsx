import { Card, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import {
    Create,
    FormWithRedirect,
    LoadingIndicator,
    required,
    SaveButton,
    useMutation,
    TextInput,
    useCreate,
    useNotify,
    useUpdate,
    CRUD_UPDATE
} from 'react-admin';
import CardTitle from '../../components/CardTitle';
import { PasswordInputField } from '../../components/fields/inputs';
import { useIdentityContext } from '../../components/identity';
import { Edit } from '../../layout/Edit';
import { Title } from '../../layout/Title';
import { StatusButton } from './TSheetSetting';
import { useQueryClient } from 'react-query';

const RESOURCE = 'vericlockBackend';

const VericlockSettingForm = (props: any) => {
    const notify = useNotify();
    const [update] = useUpdate();
    const [create] = useCreate();
    const queryClient = useQueryClient();
    const [mutate] = useMutation();
    const isDisabled = props.record.status === 'connected';
    const isCreate = !props.record.id ? true : false;

    const authenticate = (veticlock_id:string) => {
        mutate(
            {
                type: 'update',
                resource: RESOURCE,
                payload: {
                    id: veticlock_id,
                    action: 'action_authenticate',
                    data: {},
                },
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (data: any, variables: any = {}) => {
                    queryClient.invalidateQueries([RESOURCE, 'getOne',String(data.data.id)])
                    notify('Authorized successfully!');
                },
                onFailure: error => {
                    notify(`Error...! ${error.message}`);
                    console.log('There is error ', error.message);
                },
            }
        );
    };

    const onSave = (values: any, redirect: any) => {
        if (isCreate) {
            const new_vals = { ...values };
            create(
                RESOURCE,
                { data: new_vals },
                {
                    onSuccess: (response: any) => {
                        notify('Element Created');
                        props.onCreateSuccess(response.id);
                        authenticate(response.id);
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
                        authenticate(data.id);
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
                                            <StatusButton {...props} resource='vericlockBackend'/>
                                        </Stack>
                                        <TextInput
                                            fullWidth
                                            source="vericlock_api_public_key"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        <PasswordInputField
                                            fullWidth
                                            source="private_key"
                                            disabled={isDisabled}
                                        />
                                        <TextInput
                                            fullWidth
                                            source="vericlock_domain"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        <TextInput
                                            fullWidth
                                            source="user_name"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        <PasswordInputField
                                            fullWidth
                                            source="password"
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

const VericlockEditForm = (props: any) => {
    return (
        <Edit
            component='div'
            {...props}
            resource={RESOURCE}
            id={props.id}
            title={<Title title='Settings' />}
        >
            <VericlockSettingForm {...props} />
        </Edit>
    );
};

const VericlockCreateForm = (props: any) => {
    return (
        <Create
            component='div'
            {...props}
            resource={RESOURCE}
            title={<Title title='Settings' />}
        >
            <VericlockSettingForm {...props} />
        </Create>
    );
};

export const VericlockSetting = (props: any) => {
    const identity = useIdentityContext();
    const [vericlockId, setVericlockId] = useState(
        identity?.company?.vericlock_backend_id || null
    );
    useEffect(() => {
        if (!vericlockId && identity?.company?.vericlock_backend_id) {
            setVericlockId(identity?.company?.vericlock_backend_id);
        }
    }, [identity, vericlockId]);    

    const onCreateSuccess = (vericlock_id: string) => {
        setVericlockId(vericlock_id);
    };

    if (!identity?.company) {
        return <LoadingIndicator />;
    }

    return vericlockId ? (
        <VericlockEditForm
            {...props}
            id={vericlockId}
            onCreateSuccess={onCreateSuccess}
        />
    ) : (
        <VericlockCreateForm
            initialValues={() => ({
                name: identity.company.name,
                company_id: identity.company.id,
            })}
            onCreateSuccess={onCreateSuccess}
        />
    );
};
