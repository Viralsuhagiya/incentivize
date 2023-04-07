import {
    ReferenceField,
    ResourceContextProvider,
    TextField, useTranslate, AutocompleteArrayInput
} from 'react-admin';
import { Datagrid } from '../../components/datagrid';
import { FormatTimeField, MoneyField, StatusLabelField } from '../../components/fields/fields';
import { List } from '../../layout/List';
import { StyledReferenceArrayInput } from '../payrolls/Payrolls';
import { ProPayStatusExporter } from './PropayStatusExporter';

const ReportFilter = [
    <StyledReferenceArrayInput
        size="medium"
        source="employee_id._in"
        reference="employees"
        label="resources.propayEmployeeWages.fields.PropayStatusReport.fields.employee_id"
        alwaysOn
    >
        <AutocompleteArrayInput source="name" />
    </StyledReferenceArrayInput>,
    <StyledReferenceArrayInput
        size="medium"
        source="propay_id._in"
        reference="propays"
        label="resources.propayEmployeeWages.fields.PropayStatusReport.fields.propay_id"
        alwaysOn
    >
        <AutocompleteArrayInput source="name" />
    </StyledReferenceArrayInput>,
    <StyledReferenceArrayInput
        size="medium"
        source="job_id._in"
        reference="jobs"
        label="resources.propayEmployeeWages.fields.PropayStatusReport.fields.job_id"
        alwaysOn
    >
        <AutocompleteArrayInput source="name" />
    </StyledReferenceArrayInput>
 ];

export const PropayStatusReportList = (props: any) => {
    const translate = useTranslate();
    return (
        <ResourceContextProvider value="propayEmployeeWages">
            <List
                title={translate("resources.propayEmployeeWages.fields.PropayStatusReport.title")}
                bulkActionButtons={false}
                filters={ReportFilter}
                filter={{ hours: { _gt: 0 },propay_id_obj: {id: {_is_null: false}}}}
                exporter={ProPayStatusExporter(translate)}
            >
                <Datagrid bulkActionButtons={false}  showFooter>
                    <ReferenceField
                        reference="employees"
                        source="employee_id"
                        label="resources.propayEmployeeWages.fields.PropayStatusReport.fields.employee_id"
                        link={false}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <ReferenceField
                        reference="propays"
                        source="propay_id"
                        label="resources.propayEmployeeWages.fields.PropayStatusReport.fields.propay_id"
                        link={false}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <ReferenceField
                        reference="jobs"
                        source="job_id"
                        label="resources.propayEmployeeWages.fields.PropayStatusReport.fields.job_id"
                        link={false}
                    >
                        <TextField source="full_name" />
                    </ReferenceField>
                    <FormatTimeField source="hours" label="resources.propayEmployeeWages.fields.PropayStatusReport.fields.hours" groupBy />
                    <MoneyField source="performance_bonus" label="resources.propayEmployeeWages.fields.PropayStatusReport.fields.performance_bonus" groupBy/>
                    <ReferenceField
                        reference="propays"
                        source="propay_id"
                        label="resources.propayEmployeeWages.fields.PropayStatusReport.fields.status"
                        link={false}
                    >
                        <StatusLabelField source="status" colors={{paid:'success'}}/>
                    </ReferenceField>
                </Datagrid>
            </List>
        </ResourceContextProvider>
    );
};
