import { EditableDatagrid, RowForm } from '../../ra-editable-datagrid';
import {
    SelectInput,
    TextField,
    SelectField,
    TextInput,
    ListBase,
    useNotify
} from 'react-admin';
import { styled } from '@mui/material/styles';
import { MappedField } from './SelectionInput';
import { formStyle } from '../propays/Propay';
const StyledSelectInput = styled(SelectInput)({
    'min-width': '150px',
});

const StyledRowForm = styled(RowForm)({
    ...formStyle,
});

export const PayrollExportDataGrid = (props: any) => {
    return (
        <ListBase
            resource="adpPayrollExportLines"
            actions={false}
            component="div"
            disableSyncWithLocation
            {...props}
            perPage={100}
            sort={{ field: 'sequence', order: 'ASC' }}
        >
            <EditableDatagrid
                data-testid="store-datagrid"
                rowClick="edit"
                defaultTitle={null}
                editForm={<PayrollExportRowForm />}
                createForm={<PayrollExportRowForm />}
                size="medium"
                hasCreate={true}
                bulkActionButtons={false}
                allowResequence
            >
                <TextField source="column_name" label='resources.companies.settings.report.column_name'/>
                <TextField source="adp_code" label='resources.companies.settings.report.code' />
                <SelectField
                    label='resources.companies.settings.report.mapped_field'
                    source="mapped_field"
                    choices={MappedField}
                />
            </EditableDatagrid>
        </ListBase>
    );
};
export const PayrollExportRowForm = (props: any) => {
    const {save} = props
    const notify = useNotify();
    const handleSubmit = values => {
        if (values.adp_code && values.mapped_field) {
            notify('resources.companies.settings.report.notify_for_mapped_field_and_code_together', { type: 'error' });
        }else{
            return save(values);
        }
    };
    return (
        <StyledRowForm {...props} onSubmit={handleSubmit}>
            <TextInput
                source="column_name"
                label='resources.companies.settings.report.column_name'
                variant="standard"
            />
            <TextInput source="adp_code" label='resources.companies.settings.report.code' variant="standard" />
            <StyledSelectInput
                source="mapped_field"
                fullWidth
                allowEmpty
                label='resources.companies.settings.report.mapped_field'
                helperText={false}
                choices={MappedField}
            />
        </StyledRowForm>
    );
};
