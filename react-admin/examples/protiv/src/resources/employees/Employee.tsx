import React, {
    Fragment,
} from 'react';
import {
    Stack,
	Button,
} from '@mui/material';

import moment from 'moment';
import {
    Create,
    ReferenceField,
    required,
	Button as RaButton,
    SelectInput,
    BooleanInput,
    useNotify,
    FunctionField,
    SimpleForm,
    TextField,
    TextInput,
    ReferenceInput,
    Record,
    Toolbar,
    SaveButton,
    useGetList,
    SelectField,
    minValue,
    AutocompleteInput as RaAutocompleteInput,
    ResourceContextProvider,
    FormDataConsumer,
	useRedirect,
	useListContext,
	useMutation,
	CRUD_UPDATE,
	useUnselectAll,
	ListActions,
    useTranslate
} from 'react-admin';
import { List } from '../../layout/List';
import { Edit } from '../../layout/Edit';
import BooleanLabelField from '../../components/BooleanLabelField';
import { styled } from '@mui/material/styles';
import {
    EmailInput,
    MoneyInput,
    StyledDatagrid,
} from '../../components/fields';
import { AutocompleteInput } from '../../components/fields';
import { DatePickerInput } from '../../components/fields/inputs';
import { canAccess } from '../../ra-rbac';
import { CreateJobPosition, EditJobPosition } from '../jobs/jobPosition';
import { BooleanListInput } from '../../components/fields/BooleanInputList';
import EmployeeMoreMenu from './EmployeeMoreMenu';
import BulkArchiveButton from './BulkArchiveButton';
import { BulkActionProps, CreateButton, ExportButton, RadioButtonGroupInput, TopToolbar } from 'ra-ui-materialui';
import BulkActivateButton from './BulkActivateButton';

import { Route, Routes } from 'react-router';
import { EmployeeInviteDialog, EmployeeStatus } from './EmployeeInvite';
import { PhoneInput } from '../../components/fields/PhoneInput';
import { Field } from 'react-final-form';
import { DialogFormWithRedirect, DialogTitleForRecord } from '../../components/dialog-form';
import { useIdentityContext } from '../../components/identity';
import { usePermissionsOptimized } from '../../components/identity';
import { ResponsiveFilterGusser } from '../../layout/ResponsiveFilter';
import { useGetBaseLocationForCurrentRoute } from '../../hooks/useGetBaseLocationForCurrentRoute';
import { EmptyTitle } from '../../layout/Title';
import { useQueryClient } from 'react-query';
import { EmployeeSaveToolbar } from './EmployeeSaveToolbar';

export const EmployeeFullNameField = ({ record }: any) => (
    <span>
        {record.first_name} {record.last_name}
    </span>
);
export const NameField = ({ record }: any) => <span>{record.name}</span>;

export const user_type_selection = [
    {'id':'admin','name':'resources.employees.choices.user_type.admin'},
    {'id':'manager','name':'resources.employees.choices.user_type.manager'},
    {'id':'worker','name':'resources.employees.choices.user_type.worker'},
]

const StyledReferenceInput = styled(ReferenceInput)({
    'min-width': '150px',
});

const StyledReferenceField = styled(ReferenceField)({
    'min-width': '150px',
});

const EmployeeFilter = [
    <TextInput source='name._ilike' label='Search' size='medium' alwaysOn alwaysOnMobile/>,
    <StyledReferenceInput
        alwaysOn
        source='position_id._eq'
        reference='positions'
        label={'Position'}
        size='medium'
    >
        <AutocompleteInput />
    </StyledReferenceInput>,
    <SelectInput sx={{minWidth:'100px'}} translateChoice allowEmpty={false} size='medium' alwaysOn label='Status' source='active._eq' 
    choices={[{id:true, name:'resources.employees.choices.active.active'},{id:false, name:'resources.employees.choices.active.inactive'}]}/>,
    <SelectInput sx={{minWidth:'150px'}} size='medium' alwaysOn label='ProPay User?' source='is_propay_user._eq' 
    choices={[{id:true, name:'ProPay Users'},{id:false, name:'Non ProPay Users'}]}/>,
];



const CustomToolbar = (props: any) => {
    const notify = useNotify();
    const onSuccess = (data : any) => {
        notify('Employee Updated!');
        props.onEditSuccess(data);
    };
    return (
        <Toolbar {...props}>
            <SaveButton {...props} onSuccess={onSuccess} />
        </Toolbar>
    );
};

export const EmployeeUpdateForm = (props: any) => {
    const {  emptyFields, id } = props
    return (
            <Edit
                component='div'
                actions={false}
                resource='employees'
                id={id}
                mutationMode={'pessimistic'}
                title={<></>}
            >
                <SimpleForm
                    toolbar={<CustomToolbar onEditSuccess={props?.onEditSuccess} />}
                >
                    {
                        (emptyFields?.Wages) && (
                            <>
                                <MoneyInput sx={{width:255}} source='base_wage' validate={[required(), minValue(1)]} />
                            </>
                        )
                    }
                    {
                        (emptyFields?.Position) && (
                            <StyledReferenceInput source='position_id' reference='positions'>
                                <RaAutocompleteInput
                                    label='Position'
                                    showCreateButton={true}
                                    create={<CreateJobPosition />}
                                    edit={<EditJobPosition/>}
                                />
                            </StyledReferenceInput>

                        )
                    }
                    {
                    (emptyFields?.Mobile_number) && (
                        <PhoneInput source='mobile_number' validate={required()}/>
                    )
                    }
                </SimpleForm>
            </Edit>
    )
};

const UpdateShowList = (props: any) => {
	const { selectedIds} = useListContext();
    const unselectAll = useUnselectAll('employees');
	const [mutate] = useMutation();
	const redirect = useRedirect();
    const queryClient = useQueryClient();
	const notify = useNotify();
	const handleClick = () => {
		mutate(
			{
				type: 'updateMany',
				resource: 'employees',
				payload: { ids: selectedIds, action: 'updateShowList'},
			},
			{
				mutationMode: 'pessimistic',
				action: CRUD_UPDATE,
				onSuccess: (data: any, variables: any = {}) => {
					notify('You have successfully Imported Employee');
					unselectAll()
                    queryClient.invalidateQueries(['employees','getList']);
					redirect('/employees');
				},
				onFailure: error => {
					console.log('>>>>There is error ', error.message);
				},
			}
		);
	}
	return (<RaButton
		label='Import'
		onClick={() => handleClick()}
	/>)
};

const ImportEmployeeListFilter = [
	<TextInput source='name._ilike' label='Search' size='medium' alwaysOn alwaysOnMobile/>,
];

const ImportEmployeeList = (props: any) => {
    const redirect = useRedirect()
	const unselectAll = useUnselectAll('employees');
	return (
        <DialogFormWithRedirect {...props} hideToolbar={true}
            onClose={() => {
                unselectAll()
                redirect('/employees')
            }
            } render={(formProps: any) => {
            return (
					<List
						title={<EmptyTitle />}
						filter={{show_in_list: {_eq: false,},active: {_eq: true,}}}
						filters={<ResponsiveFilterGusser filters={ImportEmployeeListFilter}/>}
						actions={<ListActions exporter={false} />}

					>
						<StyledDatagrid
							bulkActionButtons={<UpdateShowList {...props} />}
						>
							<TextField source='name' />
						</StyledDatagrid>
					</List>
            )
        }} />
    );
}

const ImportEmployeeListActions = (props: any) => {
    const redirect = useRedirect();
    const translate = useTranslate();
    const currentRouteBasePath = useGetBaseLocationForCurrentRoute();
    const identity = useIdentityContext();
    const handleClick = () => {
		redirect(currentRouteBasePath+'/import', '', null,{}, {}); 
    }
	return (
		<TopToolbar sx={{
			minWidth: 'fit-content'
		}}>
			<CreateButton/>
            <ExportButton/>
			{identity?.company?.allow_salesforce_api && <Button
                color='primary'
                variant='contained'
				sx={{ alignItems: 'center', justifyContent: 'center' }}

				onClick={handleClick}
            >
                {translate('resources.employees.fields.import_employee')}
            </Button>}
		</TopToolbar>
	);
}


const EmployeeBulkActionButtons = (props: BulkActionProps) => (
    <Fragment>
        <BulkArchiveButton {...props} />
        <BulkActivateButton {...props} />
    </Fragment>
);

export const EmployeeList = (props: any) => {
    const { permissions } = usePermissionsOptimized();
    const translate = useTranslate();
    const identity = useIdentityContext();
    const allow_all_workers_to_add_time = identity?.company?.allow_all_workers_to_add_time;
    return (
        <>
            <List
                {...props}
                filters={<ResponsiveFilterGusser filters={EmployeeFilter}/>}
                filterDefaultValues={{active:{_eq:true}}}
                titleActionProps={{ showCreate: false }}
				filter= {{show_in_list: {_eq: true}}}
                hasCreate={
                    canAccess({
                        permissions,
                        resource: 'employees',
                        action: 'create',                        
                    })
                }
                className='team-mobile-create-btn'
				actions={<ImportEmployeeListActions />}
            >
                <StyledDatagrid
                    size='medium'
                    bulkActionButtons={<EmployeeBulkActionButtons />}
                    isRowSelectable={(record:Record)=>!record.is_owner}
                >
                    <EmployeeFullNameField
                        source='name'
                        sortBy={'name'}
                        sortable={true}
                    />
                    {identity?.company?.allow_job_position && 
                        <StyledReferenceField
                            source='position_id'
                            reference='positions'
                            link={false}
                        >
                            <TextField source='name' />
                        </StyledReferenceField>
                    }

                    <FunctionField source='user_type' label={translate('resources.employees.fields.role')} render={(record)=>(<>
                            {record.is_owner&&<>{translate('resources.employees.fields.owner')}</>}
                            {!record.is_owner&&<SelectField
                                source='user_type'                   
                                choices={user_type_selection}
                            />}</>)}/>
                    {!(identity?.company?.tsheets_status === 'connected') && allow_all_workers_to_add_time &&
                        <FunctionField source='allow_to_add_time' render={(record)=>{
                            return (<BooleanListInput source='allow_to_add_time' variant='standard' label='' disabled={record.user_type !== 'worker'}/>)
                        }} />                        
                    }

                    <FunctionField
                        label='resources.employees.fields.status'
                        textAlign='right'
                        render={(record: any) => (
                            <>
                                {!record.active&&<BooleanLabelField
                                    source='active'
                                    yes_value={translate('resources.employees.fields.yes_value')}
                                    no_value={translate('resources.employees.fields.no_value')}
                                />}
                                {record.active&&<EmployeeStatus record={record} />}
                            </>                            
                        )}
                    />
                    <FunctionField
                        label=''      
                        textAlign='center'              
                        render={(record: any)=>(
                            <EmployeeMoreMenu record={record}/>
                        )}/>
                    
                </StyledDatagrid>
            </List>
            <Routes>
                <Route path=':id/invite' element={
                    <ResourceContextProvider value='employees'>
                        <EmployeeInviteDialog />
                    </ResourceContextProvider>
                }/>
                <Route path=':id/edit' element={
                    <ResourceContextProvider value='employees'>
                        <EmployeeEditDialog />
                    </ResourceContextProvider>
                }/>                
                <Route path='create' element={
                    <ResourceContextProvider value='employees'>
                        <EmployeeCreateDialog />
                    </ResourceContextProvider>
                }/>  
				<Route path='import' element={
					<ResourceContextProvider value='employees'>
						<ImportEmployeeList />
					</ResourceContextProvider>
				}/>              
            </Routes>            
        </>
    );
};

const StyledReferenceInputFull = styled(ReferenceInput)({
    'width': '100%',
});

export const EmployeeDialogForm = (props: any) => {
    const { permissions } = usePermissionsOptimized();
    const { data }: any = useGetList('periods', {
        sort: { field: 'end_date', order: 'DESC' },
        filter: {
            status: { _eq: 'closed' },
        },
    });
    var minDate = moment().subtract(1, 'weeks').startOf('week');
    if (data && data.length > 0) {
        minDate = moment(data[0].end_date).add(1, 'day');
    }
    const allow_user_type_access = (canAccess({
            permissions,
            resource: 'employees',
            action: 'allow_user_type_access',
    }))

    const identity = useIdentityContext();

    const allow_all_workers_to_add_time = identity?.company?.allow_all_workers_to_add_time;

    return (
        <DialogFormWithRedirect {...props} 
        toolbar={<EmployeeSaveToolbar/>}
        render={(formProps: any) => {
            return (
                <Stack direction='column'>
                    <Stack direction={{xs:'column',sm:'row'}} sx={{width:'100%'}} className='team-first-last' spacing={2}>
                        <TextInput fullWidth source='first_name' validate={required()} />
                        <TextInput fullWidth source='last_name' validate={required()} />
                    </Stack>
                    <TextInput source='employee_payroll_number' />
                    {identity?.company?.allow_job_position &&
                        <FunctionField
                            source='position_id'
                            fullWidth
                            className='function-field'
                            render={(record: any) => (
                                <Stack direction='row' sx={{width:'100%'}} >
                                    <StyledReferenceInputFull source='position_id' label={'resources.employees.fields.position_id'} reference='positions' fullWidth sx={{pr:1}}>
                                        <RaAutocompleteInput
                                            fullWidth                                                
                                            showCreateButton={true}
                                            create={<CreateJobPosition />}
                                            edit={<EditJobPosition/>} />
                                    </StyledReferenceInputFull>
                                    {record.has_closed_period && record.position_history_ids &&
                                        <Field name={'position_id'} subscription={{ value: true }}>
                                            {({ input: { value } }) => {
                                                return (<>
                                                    {value!==record.position_id && <DatePickerInput
                                                        fullWidth
                                                        sx={{pl:1}}
                                                        source='position_effective_date'
                                                        validate={required()}
                                                        minDate={minDate}
                                                    />}</>
                                                );
                                            }};
                                        </Field>

                                    }
                                </Stack>
                            )}
                    />}
                    <FormDataConsumer>
                        {({ formData: { user_type, is_propay_user } }) => {
                            return (
                                <FunctionField
                                    source='base_wage'
                                    fullWidth
                                    render={(record: any) => (
                                        <Stack direction='row' sx={{width:'100%'}}>
                                            <MoneyInput fullWidth source='base_wage' 
                                            validate={user_type==='worker'||is_propay_user?[minValue(0, 'Must be positive value')]:[]} sx={{pr:1}}/>
                                            {record.has_closed_period &&
                                                <Field name={'base_wage'} subscription={{ value: true }}>
                                                    {({ input: { value } }) =>
                                                    (value != record.base_wage && <DatePickerInput
                                                        fullWidth
                                                        source='effective_date'
                                                        validate={required()}
                                                        minDate={minDate}
                                                        sx={{ pl: 1 }}
                                                    />)}
                                                </Field>
                                            }                                    
                                        </Stack>
                                    )}
                                />                        
                            )}}
                    </FormDataConsumer>                    


                    <FunctionField render={
                        (record)=>(<>
                            {!record.is_owner &&
                                <RadioButtonGroupInput
                                    source='user_type'
                                    variant='standard'
                                    defaultValue={'worker'}
                                    choices={user_type_selection}
                                    validate={required()}
                                    disabled={!allow_user_type_access}
                                    sx={{'.MuiFo1rmHelperText-root': { display: 'none' }}}
                                />}
                        </>
                    )} />
                    <Stack direction='row' sx={{'width':'100%'}}>
                        {allow_user_type_access && <BooleanInput fullWidth source='is_propay_user' sx={{'width':'100%','.MuiF1or1mHelperText-root': { display: 'none' }}}/>}

                        <FunctionField fullWidth sx={{'width':'100%'}} render={
                            (record)=>(<>
                            {!(identity?.company?.tsheets_status === 'connected') && allow_all_workers_to_add_time && record.user_type === 'worker' && 
                                <BooleanInput fullWidth  source='allow_to_add_time' sx={{'width':'100%','.MuiFo1rmH1elperText-root': { display: 'none' }}}/>}
                            </>)}
                        />
                    </Stack>
                    <PhoneInput fullWidth source='mobile_number' />
                    <EmailInput fullWidth source='email' />
                </Stack>
            )
        }} />
    );
};

export const EmployeeCreateDialog = (props: any) => {
    return (
        <Create  {...props} mutationMode={'pessimistic'} component='div' title={<DialogTitleForRecord />} >
            <EmployeeDialogForm {...props}/>
        </Create>
    );
};
export const EmployeeEditDialog = (props: any) => {
    return (
        <Edit {...props} mutationMode={'pessimistic'} component='div' title={<DialogTitleForRecord />}>
            <EmployeeDialogForm {...props}/>
        </Edit>
    );
};
