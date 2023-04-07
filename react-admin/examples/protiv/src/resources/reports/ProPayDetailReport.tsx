import {
    AutocompleteArrayInput, ReferenceField, ResourceContextProvider, TextField,
    TextInput, useTranslate
} from 'react-admin';
import { Datagrid } from '../../components/datagrid';
import { MoneyField, StatusLabelField } from '../../components/fields';
import { List } from '../../layout/List';
import { StyledReferenceArrayInput } from '../payrolls/Payrolls';
import { PROPAY_STATUS } from '../propays';
import { StyledSelectInput } from '../propays/Propay';
import { ProPayDetailExporter } from './ProPayDetailReportExporter';

const PropayDetailReportFilter = [
    <StyledReferenceArrayInput
    source="job_id._in"
    reference="jobs"
    label="Job"
    alwaysOn
    >
        <AutocompleteArrayInput optionText="full_name" />
    </StyledReferenceArrayInput>,
    <TextInput source="name._ilike" label="ProPay" alwaysOn size="medium" />,
    <StyledSelectInput
        size="medium"
        source="status._eq"
        label="Status"
        choices={PROPAY_STATUS}
        alwaysOn />,
    
];
export const ProPayDetailReportList = (props: any) => {
    const translate = useTranslate();

    return (
        <ResourceContextProvider value="propays">
            <List
                exporter={ProPayDetailExporter(translate)} 
                title="ProPay Detail"
                sort={{ field: 'job_id', order: 'DESC' }}
                filters={PropayDetailReportFilter}
            >
                <Datagrid bulkActionButtons={false}  showFooter>
                    <ReferenceField
                        reference="jobs"
                        source="job_id"
                        label="resources.propays.fields.propaydetails.job_id.name"
                        link={false}
                    >
                        <TextField source="full_name" />
                    </ReferenceField>
                    <ReferenceField
                        reference="jobs"
                        source="job_id"
                        sortable={false}
                        label="resources.propays.fields.propaydetails.job_id.revenue"
                        link={false}
                    >
                        <MoneyField source="revenue" />
                    </ReferenceField>
                    <TextField source="name" label="resources.propays.fields.propaydetails.name" />
                    <MoneyField source="amount" label="resources.propays.fields.propaydetails.amount" groupBy/>
                    <MoneyField source="earning" label="resources.propays.fields.propaydetails.earning" groupBy/>
                    <StatusLabelField source="status" colors={{paid:'success'}} label="resources.propays.fields.propaydetails.status"/>
                </Datagrid>
            </List>
        </ResourceContextProvider>
    );
};
