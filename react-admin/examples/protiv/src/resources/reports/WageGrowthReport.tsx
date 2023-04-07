import React from 'react';
import {
    FunctionField,
    ReferenceField,
    ResourceContextProvider,
    TextField,
    AutocompleteArrayInput,
    useTranslate,
    TopToolbar,
} from 'react-admin';
import { ListGroup } from '../../layout/List';
import { MoneyField, NumberField } from '../../components/fields/fields';
import { StyledReferenceArrayInput } from '../payrolls/Payrolls';
import { Datagrid } from '../../components/datagrid';
import WageGrowthReportExporter from './WageGrowthReportExporter';
import { DateField } from '../../components/fields/DateField';
import { Title } from '../../layout/Title';
import { GroupByExportButton } from './GroupByExportButton';

const WageGrowthReportFilter = [
    <StyledReferenceArrayInput
        source="period_id._in"
        reference="periods"
        label="resources.protivWageGrowthReport.payroll_periods"
        alwaysOn
    >
        <AutocompleteArrayInput source="name" />
    </StyledReferenceArrayInput>,
    <StyledReferenceArrayInput
        size="medium"
        source="employee_id._in"
        reference="employees"
        label="resources.protivWageGrowthReport.worker"
        alwaysOn
    >
        <AutocompleteArrayInput source="name" />
    </StyledReferenceArrayInput>
];
const ListActions = (props: any) => (
    <TopToolbar>
        <GroupByExportButton labelResource="protivWageGrowthReport" />
    </TopToolbar>
);

export const WageGrowthReportList = (props: any) => {
    const translate = useTranslate();
    return (
        <ResourceContextProvider value="attendances">
            <ListGroup
            title={<Title title="Wage Growth Report"/>}
                filters={WageGrowthReportFilter}
                lazy={false}
                groupBy={['employee_id', 'standard_wage']}
                filter= {{propay_id_obj: {status: {_eq: 'paid'}}}}
                fields={[
                    'period_id',
                    'period_end_date',
                    'period_start_date',
                    'employee_id',
                    'standard_wage',
                    'hours',
                    'earning',
                    'pay_rate',
                    'wage_growth',
                    'wage_growth_per',
                ]}
                actions={<ListActions/>}
                exporter={WageGrowthReportExporter(translate)}
            >
                <Datagrid bulkActionButtons={false}  showFooter>
                    <FunctionField
                        source="period_start_date"
                        label="resources.protivWageGrowthReport.fields.period_start_date"
                        render={(record: any) => {
                            return (
                                <>
                                    <DateField source="period_start_date" />
                                    ~
                                    <DateField source="period_end_date" />
                                </>
                            );
                        }}
                    />
                    <ReferenceField
                        reference="employees"
                        source="employee_id"
                        label="resources.protivWageGrowthReport.fields.employee_id"
                        link={false}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <MoneyField source="standard_wage" groupBy/>
                    <MoneyField source="pay_rate"  groupBy/>
                    <MoneyField source="wage_growth" groupBy/>
                    <NumberField
                        source="wage_growth_per"
                        options={{ style: 'percent' }}
                        groupBy
                        textAlign='right'
                    />
                </Datagrid>
            </ListGroup>
        </ResourceContextProvider>
    );
};
