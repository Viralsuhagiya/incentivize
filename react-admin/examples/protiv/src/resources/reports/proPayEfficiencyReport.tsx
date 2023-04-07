import React from 'react';
import {
    ListActions,
    ReferenceField,
    ResourceContextProvider,
    TextField,
    useTranslate,
} from 'react-admin';
import { Datagrid } from '../../components/datagrid';
import { DateField } from '../../components/fields/DateField';
import { DateRangeInputFilter } from '../../components/fields/DateRangeInputFilter';
import { FormatTimeField, MoneyField, NumberField, NumberToTimeField, StatusLabelField } from '../../components/fields/fields';
import { ListGroup } from '../../layout/List';
import { Title } from '../../layout/Title';
import { PROPAY_STATUS } from '../propays';
import { StyledSelectInput } from '../propays/Propay';

const proPayEffiencyReportFilter = [
   <StyledSelectInput
        size="medium"
        source="propay_id_obj.status._eq"
        label="resources.propays.fields.status"
        choices={PROPAY_STATUS}
        alwaysOn />,
    <DateRangeInputFilter source='propay_id_obj.from_date' alwaysOn />
];
export const ProPayEfficiencyReportList = (props: any) => {
    const translate = useTranslate();
    return (
        <ResourceContextProvider value="attendances">
            <ListGroup
                filters={proPayEffiencyReportFilter}
                title={<Title title="ProPay Efficiency"/>}
                filter={{ propay_id: { _is_null: false } }}
                actions={<ListActions exporter={false} />}
                lazy={false}
                groupBy={['propay_id']}
                fields={[
                    'propay_id',
                    'standard_wage',
                    'pay_rate',
                    'wage_growth',
                    'wage_growth_per',
                    'group_by_propay_overage',
                    'capacity_hour_growth',
                    'capacity_hour_growth_per',
                    'hours'
                ]}
            >
                <Datagrid bulkActionButtons={false} showFooter>
                    <ReferenceField
                        reference="propays"
                        source="propay_id"
                        label="resources.propays.fields.number"
                        link={false}
                    >
                        <TextField source="number" />
                    </ReferenceField>
                    <ReferenceField
                        reference="propays"
                        source="propay_id"
                        label="resources.propays.fields.status"
                        link={false}
                    >
                        <StatusLabelField source="status" colors={{paid:'success'}}/>
                    </ReferenceField>
                    <ReferenceField
                        reference="propays"
                        source="propay_id"
                        label="resources.propays.fields.from_date"
                        link={false}
                    >
                        <DateField source="from_date" />
                    </ReferenceField>
                    <ReferenceField
                        reference="propays"
                        source="propay_id"
                        label="resources.propays.fields.name"
                        link={false}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <MoneyField source="standard_wage" groupBy />
                    <MoneyField source="pay_rate" groupBy />
                    <FormatTimeField source="hours" label="resources.propays.fields.hours" groupBy />
                    <MoneyField source="wage_growth" groupBy />
                    <NumberField
                        source="wage_growth_per"
                        options={{ style: 'percent' }}
                        groupBy
                        textAlign='right'
                    />
                    <MoneyField source="group_by_propay_overage" groupBy />
                    <FormatTimeField source="capacity_hour_growth" groupBy />
                    <NumberField
                        source="capacity_hour_growth_per"
                        options={{ style: 'percent' }}
                        groupBy
                        textAlign='right'
                    />
                </Datagrid>
            </ListGroup>
        </ResourceContextProvider>
    );
};
