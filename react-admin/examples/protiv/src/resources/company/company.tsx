import React from 'react';
import { Button } from '@mui/material';
import {
    TextField,
    TextInput,
    EditButton,
    SimpleForm,
    Create,
    Title,
    CRUD_UPDATE,
    FunctionField,
    required,
    useMutation,
    useRedirect,
    useNotify,
    SelectField,
    BooleanInput,
    email,
    useTranslate
} from 'react-admin';
import { List } from '../../layout/List';
import { Edit } from '../../layout/Edit';
import { DefaultDatagrid, EmailInput } from '../../components/fields';

import { BooleanListInput } from '../../components/fields/BooleanInputList';
import { PhoneInput } from '../../components/fields/PhoneInput';
import { useIdentityContext } from '../../components/identity';
const onboarding_states = [{id:'not_started',name:'Not Started'},{id:'started',name:'Started'},{id:'completed',name:'Completed'}];
const CompanyFilter = [
    <TextInput source='name._ilike' label='filter.search' alwaysOn size='medium' />,
];

export const CompanyList = (props: any) => {
    const notify = useNotify();
    const redirectTo = useRedirect();
    const translate = useTranslate();
    const [mutate] = useMutation();

    const switchCompany = async (record: any) => {
        return mutate(
            {
                type: 'update',
                resource: 'company',
                payload: {
                    id: record.id,
                    action: 'switchCompany',
                    data: {},
                },
            },
            {
                mutationMode: 'pessimistic',
                action: CRUD_UPDATE,
                onSuccess: (data: any, variables: any = {}) => {
                    notify('You have successfully switched company');
                    redirectTo('/');
                    window.location.reload();
                },
                onFailure: error => {
                    console.log('There is error ', error.message);
                    notify(`Failure ! ${error.message}`);
                },
            }
        );
    };

    return (
        <List
            filters={CompanyFilter}
            titleActionProps={{ showCreate: true }}
            filter={{ id: { _neq: 1 } }}
        >
            <DefaultDatagrid>
                <TextField source='name' />
                <FunctionField
                    label={('resources.companies.fields.enable_onboarding')}
                    render={(record:any) => (
                        <>
                        {record.onboarding_state==='not_started'&&<BooleanListInput source='force_onboarding' record={record}/>}
                        {(!record.onboarding_state || record.onboarding_state!=='not_started')&&<SelectField source='onboarding_state' choices={onboarding_states}/>}
                        </>
                    )}/>

                <FunctionField
                    label={('dashboard.switch_company')}
                    textAlign='right'
                    render={(record: any) => (
                        <Button
                            variant='outlined'
                            color='primary'
                            size='small'
                            onClick={() => switchCompany(record)}
                        >
                            {translate('dashboard.switch_company')}
                        </Button>
                    )}
                />
                <EditButton />
            </DefaultDatagrid>
        </List>
    );
};
export const CompanyEdit = (props: any) => (
    <Edit {...props} mutationMode={'pessimistic'}>
        <SimpleForm>
            <TextInput
                source='name'
                style={{ width: '700px' }}
                validate={[required()]}
            />
            <BooleanInput
                    sx={{ paddingTop: 2, paddingLeft: 2 }}
                    source='allow_salesforce_api'
                    label='resources.companies.fields.allow_salesforce_api'
                    helperText={false}
                />
                <BooleanInput
                    sx={{ paddingTop: 2, paddingLeft: 2 }}
                    source='allow_zapier_api'
                    label='resources.companies.fields.allow_zapier_api'
                    helperText={false}
                />
            <BooleanInput
                    sx={{ paddingTop: 2, paddingLeft: 2 }}
                    source='allow_vericlock_api'
                    label='resources.companies.fields.allow_vericlock_api'
                    helperText={false}
                />
                <BooleanInput
                    sx={{ paddingTop: 2, paddingLeft: 2 }}
                    source='allow_dataverse'
                    label='resources.companies.fields.allow_dataverse'
                    helperText={false}
                />
                <BooleanInput
                    sx={{ paddingTop: 2, paddingLeft: 2 }}
                    source='show_propay_detail_report'
                    label='resources.companies.fields.show_propay_detail_report'
                    helperText={false}
                />
        </SimpleForm>
    </Edit>
);

export const CompanyCreate = (props: any) => {
    const validateEmail = email();
    return  (
    <Create {...props} title={<Title />}>
        <SimpleForm redirect='list'>
            <TextInput
                source='name'
                style={{ width: '700px' }}
                validate={[required()]}
            />
            <TextInput
                source='admin_first_name'
                style={{ width: '700px' }}
                validate={[required()]}
            />
            <TextInput
                source='admin_last_name'
                style={{ width: '700px' }}
                validate={[required()]}
            />
            
            <EmailInput
                source='email'
                style={{ width: '700px' }}
                validate={[required(),validateEmail]}
            />
            <PhoneInput
                source='phone'
                style={{ width: '700px' }}
            />
        </SimpleForm>
    </Create>
    );
};

export const useGetBackend = () => {
    const identity = useIdentityContext();
    return identity?.company?.is_integrated_company
};

export const HasBackendConnected = ({children,...rest}:any) => {
    const backend = useGetBackend()
    if (!backend) return null;
    return (
        React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child );
            }
            return child;
        })
    )
};

export const HasBackendNotConnected = ({children,...rest}:any) => {
    const backend = useGetBackend()
    if (backend) return null;
    return (
        React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child );
            }
            return child;
        })
    )
};
