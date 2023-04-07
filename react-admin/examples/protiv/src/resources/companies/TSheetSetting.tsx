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
    BooleanInput,
    useTranslate,
} from 'react-admin';
import CardTitle from '../../components/CardTitle';
import { StatusLabelField } from '../../components/fields';
import { PasswordInputField } from '../../components/fields/inputs';
import { useIdentityContext } from '../../components/identity';
import { Edit } from '../../layout/Edit';
import { Title } from '../../layout/Title';
import { TSHEET_STATUS_COLOR } from './CompanyConstants';

const RESOURCE = 'tsheetConnectors';

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

const TSheetSettingForm = (props: any) => {
    const notify = useNotify();
    const [update] = useUpdate();
    const [create] = useCreate();
    const translate = useTranslate();
    const isDisabled = props.record.status === 'connected';
    const isCreate = !props.record.id ? true : false;

    const authenticate = (client_id: string, tsheet_id: string) => {
        // eslint-disable-next-line no-native-reassign
        origin = window.location.origin;
        //uncooment this if you want this for local
        // origin = 'http://localhost:8069';
        const redirect_url = `${origin}/api/tsheet-connect`;
        var tsheetLink = `https://rest.tsheets.com/api/v1/authorize?response_type=code&redirect_uri=${redirect_url}&client_id=${client_id}&state=${tsheet_id}`;
        window.open(tsheetLink);
    };

    const onSave = (values: any, redirect: any) => {
        if (isCreate) {
            let origin = window.location.origin;
            let redirect_uri = `${origin}/api/tsheet-connect`;
            const new_vals = { ...values, redirect_uri: redirect_uri };
            create(
                RESOURCE,
                { data: new_vals },
                {
                    onSuccess: (response: any) => {
                        notify('Element Created');
                        authenticate(response.client_id, response.id);
                        props.onCreateSuccess(response.id);
                    },
                    onError: (error: any) => {
                        notify(`Element Failed Updated ${error.message}`);
                    },
                }
            );
        } else {
            updateTSheet(values, props.record);
        }
    };

    const disconnect = ({ record }: any) => {
        const values = { ...record, status: 'pending' };
        updateTSheet(values, record);
    };

    const updateTSheet = (values: any, old_values: any) => {
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
                        authenticate(data.client_id, data.id);
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
                                            autoComplete="new-clientId" 
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
                                            source="company_identifier"
                                            validate={required()}
                                            disabled={isDisabled}
                                        />
                                        <BooleanInput
                                            fullWidth
                                            source="is_propay_selection_required"
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

const TSheetEditForm = (props: any) => {
    return (
        <Edit
            component="div"
            {...props}
            resource={RESOURCE}
            id={props.id}
            title={<Title title="Settings" />}
        >
            <TSheetSettingForm {...props} />
        </Edit>
    );
};

const TSheetCreateForm = (props: any) => {
    return (
        <Create
            component="div"
            {...props}
            resource={RESOURCE}
            title={<Title title="Settings" />}
        >
            <TSheetSettingForm {...props} />
        </Create>
    );
};

export const TSheetSetting = (props: any) => {
    const identity = useIdentityContext();
    const [tsheetId, setTsheetId] = useState(
        identity?.company?.backend_id || null
    );
    useEffect(() => {
        if (!tsheetId && identity?.company?.backend_id) {
            setTsheetId(identity?.company?.backend_id);
        }
    }, [identity, tsheetId]);

    const onCreateSuccess = (tsheet_id: string) => {
        setTsheetId(tsheet_id);
    };

    if (!identity?.company) {
        return <LoadingIndicator />;
    }

    return tsheetId ? (
        <TSheetEditForm
            {...props}
            id={tsheetId}
            onCreateSuccess={onCreateSuccess}
        />
    ) : (
        <TSheetCreateForm
            initialValues={() => ({
                name: identity.company.name,
                company_id: identity.company.id,
            })}
            onCreateSuccess={onCreateSuccess}
        />
    );
};
