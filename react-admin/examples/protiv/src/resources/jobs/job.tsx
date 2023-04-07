import CloseIcon from '@mui/icons-material/Close';
import { Button, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import React from 'react';
import { AutocompleteInput, AutocompleteInputProps, Create, CRUD_UPDATE, FunctionField, ListActions,Edit, NumberInput,useEditSuggestionContext, Record, required, 
    ResourceContextProvider, SaveButton, SimpleForm, TextField, TextInput, Toolbar, useCreateSuggestionContext, useMutation, useNotify, useResourceContext, useTranslate
} from 'react-admin';
import { Outlet, Routes, Route, Link } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { MoneyField, MoneyInput, PercentField, StyledEditableDatagrid } from '../../components/fields';
import { List } from '../../layout/List';
import { Title } from '../../layout/Title';
import EditableField from '../../ra-editable-datagrid/EditableField';
import FieldForm from '../../ra-editable-datagrid/FieldForm';
import { canAccess, usePermissions } from '../../ra-rbac';
import { StatusButtonGroup } from '../propays';
import { StyledDialog } from '../propays/Propay';
import DeleteRowButton from '../../ra-editable-datagrid/buttons/DeleteRowButton';
import { HasPermission } from '../payrolls/Payrolls';
import { useIdentityContext } from '../../components/identity';
import { NUMBER } from '../../utils/Constants/MagicNumber';

const JobFilter = [
    <TextInput source='q' label='Search' size='medium' alwaysOn />,
];

export const JobNameInput = (props: AutocompleteInputProps) => {
    const { loading, permissions } = usePermissions();
    if (loading) return null;
    if (canAccess({
        permissions,
        resource: 'jobs',
        action: 'revenue',
    })) {
        return <>
            <AutocompleteInput
                optionText={(record?: Record) =>
                    record?.id
                        ? record.id === '@@ra-create'? 'Create' :`${record.full_name}${record.revenue ? `($${record.revenue})` : '' }`
                        : ''
                }
                {...props}
            />
        </>;
    } else {
        return <> <AutocompleteInput source='full_name' {...props} /></>
    };
}

export const JobNameField = (props: any) => {
    const { loading, permissions } = usePermissions();
    if(loading) return null;
    if (canAccess({
        permissions,
        resource: 'jobs',
        action: 'revenue',
    })) {
        return (<FunctionField render={record => `${record.full_name} ($${record.revenue})`} />);
    }else{
        return (<TextField source='full_name' />)
    }
}

const TitleActions = (props: any): React.ReactElement => {
    const { label, showCreate, createButtonProps } = props;
    return (
        <>
            {(showCreate) && <Button variant='contained' component={Link} to={'/jobs/create'} size='medium' {...createButtonProps}>{label}</Button>}
        </>
    );
};

const EditableNameField = (props: any) => {
    const { identity} = props
    return !identity?.company?.allow_zapier_api ?
         <TextInput source='name' variant='standard' label='' />:
         <TextField source='full_name'  label='' />
};

export const JobList = (props: any) => {
    const { loading, permissions } = usePermissions();
    const identity = useIdentityContext();
    const translate = useTranslate();
    if(loading) return null;
    return (
        <>
        <ResourceContextProvider value='jobReport'>
            <List
                {...props}
                actions={<ListActions exporter={false} />}
                titleActionProps={{ showCreate: !loading && canAccess({
                    permissions,
                    resource: 'jobs',
                    action: 'create',
                }) && !identity?.company?.allow_salesforce_api && !identity?.company?.allow_vericlock_api && !identity?.company?.allow_dataverse}}
                titleAction={TitleActions}
                filters={JobFilter}
            >
                <StyledEditableDatagrid
                    size='medium'
                    noDelete
                    noEditButton
                    showFooter
                >
                    <EditableField source='full_name' label={translate('resources.jobs.fields.name')} noSaveButton form={<FieldForm><EditableNameField /></FieldForm>}>
                        <TextField source='full_name'/>
                    </EditableField>
                    <EditableField groupBy label={translate('resources.jobs.fields.revenue')} source='revenue' noSaveButton form={<FieldForm><MoneyInput source='revenue' variant='standard' label='' /></FieldForm>}>
                        <MoneyField source='revenue' groupBy/>
                    </EditableField>
                    <MoneyField source='labor_cost' label={translate('resources.jobs.fields.labor_cost')} groupBy/>
                    <MoneyField source='burden' label={translate('resources.jobs.fields.burden')} groupBy/>
                    <MoneyField source='total_labor' label={translate('resources.jobs.fields.total_labor')} groupBy/>
                    <PercentField source='total_labor_per' label={translate('resources.jobs.fields.total_labor_per')} groupBy/>
                    <HasPermission action='delete' resource='jobs'>
                            <FunctionField
                                sortable
                                render={(record: any) => {
                                    return <>
                                        {record.type === 'manual' &&
                                            <DeleteRowButton
                                                record={record}
                                                resource='jobs'
                                            />}
                                        </>
                                }}
                        />
                    </HasPermission>
                </StyledEditableDatagrid>
            </List>
            </ResourceContextProvider>
        </>
    );
};

const isRequired = [required()];

export const JobCreate = (props: any) => {
    return (
        <ResourceContextProvider value='jobs'>
            <Create {...props} title={<Title />}>
                <SimpleForm redirect='list'>
                    <TextInput source='name' validate={isRequired} />
                    <NumberInput source='revenue' />
                </SimpleForm>
            </Create>
        </ResourceContextProvider>
    );
};

export const JobToolbar = (props:any) => {
    const {onSuccess, ...rest} = props;
    return (
        <Toolbar {...rest}>
            <SaveButton {...rest} onSuccess={onSuccess}/>
        </Toolbar>
    )
}

const CreateJobForm = (props: any) => {
    const { filter,onCreate} = useCreateSuggestionContext();
    const notify = useNotify();
    const onCreateSuccess = (data:any) => {
        notify(`Element Created`);
        onCreate(data);
    }
    return <Create component='div' title='Add Job' resource='jobs'>
        <SimpleForm toolbar={<JobToolbar onSuccess={onCreateSuccess}/>} submitOnEnter={false} redirect={false} initialValues={{name:filter }}>
            <TextInput source='name' validate={isRequired} />
            <NumberInput source='revenue' />
        </SimpleForm>
    </Create>
}

export const JobEditToolbar = props => (
    <Toolbar {...props} >
        <SaveButton />
    </Toolbar>
);

const EditJobForm = (props: any) => {
    const { record, onEdit } = useEditSuggestionContext();
    return <Edit mutationOptions={{
        onSuccess: data => {
            onEdit(data);
        },
    }} mutationMode='pessimistic' component='div' id={record.id} resource='jobs'>
        <SimpleForm toolbar={<JobEditToolbar/>} submitOnEnter={false} redirect={false}>
            <TextInput source='name' validate={isRequired} />
            <NumberInput source='revenue' />
        </SimpleForm>
    </Edit>
}

export const JobDialog = ({title,component,onCancel,contentProps }: any) => {
    const handleClose = () => {
        onCancel()
    };
    return (
        <StyledDialog className='common-diaglog-modal' open>
            <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
                <Stack flexDirection={'row'} justifyContent={'space-between'}>
                    {title}
                    <IconButton
                        color='primary'
                        aria-label='upload picture'
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{...(contentProps || {})}}>{component}</DialogContent>
        </StyledDialog>
    );
};

export const CreateJob = () => {
    const {onCancel} = useCreateSuggestionContext();
    return <JobDialog contentProps={{ maxHeight:325, height: window.innerHeight / NUMBER.TWO}} onCancel={onCancel} component={<CreateJobForm/>} title='Add Job'/>
};

export const EditJob = () => {
    const {onCancel} = useEditSuggestionContext();
    return <JobDialog contentProps={{ maxHeight:325, height: window.innerHeight / NUMBER.TWO}} onCancel={onCancel} component={<EditJobForm/>} title='Edit Job'/>
};

const JobReportList = (props: any) => {
    return (
        <Routes>
            <Route path='/*' element={<Outlet />}>
                <Route path='' element={<JobList />}></Route>
                <Route path='create' element={<JobCreate />} />
            </Route>
        </Routes>

    );
};

export default JobReportList;
