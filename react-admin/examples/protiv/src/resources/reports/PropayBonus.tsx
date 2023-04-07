import moment from 'moment';
import {
    ReferenceField,
    ResourceContextProvider,
    TextField, useTranslate, AutocompleteArrayInput, TopToolbar
} from 'react-admin';
import { Datagrid } from '../../components/datagrid';
import { MoneyField } from '../../components/fields/fields';
import { ListGroup } from '../../layout/List';
import { Title } from '../../layout/Title';
import { StyledReferenceArrayInput } from '../payrolls/Payrolls';
import { GroupByExportButton } from './GroupByExportButton';
import { ProPayBonusExporter } from './ProPayBonusExporter';

const ReportFilter = [
    <StyledReferenceArrayInput
        source="paid_period_id._in"
        reference="periods"
        label="resources.PropayBonusReport.paid_period"
        alwaysOn
        sort={{ field: 'start_date', order: 'DESC' }}
        filter={{ start_date: { _lte: moment().format('YYYY-MM-DD') },payroll_ids: {performance_bonus: {_gt: 0}} }}
    >
        <AutocompleteArrayInput source="name" />
    </StyledReferenceArrayInput>,
    <StyledReferenceArrayInput
        source="period_id._in"
        reference="periods"
        label="resources.PropayBonusReport.work_period"
        alwaysOn
        sort={{ field: 'start_date', order: 'DESC' }}
        filter={{ start_date: { _lte: moment().format('YYYY-MM-DD') },payroll_ids: {performance_bonus: {_gt: 0}} }}
    >
        <AutocompleteArrayInput source="name" />
    </StyledReferenceArrayInput>,
    <StyledReferenceArrayInput
        size="medium"
        source="employee_id._in"
        reference="employees"
        label="resources.PropayBonusReport.worker"
        alwaysOn
    >
        <AutocompleteArrayInput source="name" />
    </StyledReferenceArrayInput>
 ];

 const ListActions = (props: any) => (
    <TopToolbar>
        <GroupByExportButton labelResource="PropayBonusReport" />
    </TopToolbar>
);
export const PropayBonusList = (props: any) => {
    const translate = useTranslate();
    return (
        <ResourceContextProvider value="attendances">
            <ListGroup
                title={<Title title="ProPay Bonus Report"/>}
                lazy={false}
                filters={ReportFilter}
                exporter={ProPayBonusExporter(translate)}
                actions={<ListActions/>}
                groupBy={['propay_id', 'employee_id','paid_period_id','period_id']}
                filter= {{status: {_eq: 'paid'},type: {_eq: 'is_performance_bonus'}}}
                fields={[
                    'employee_id',
                    'propay_id',
                    'paid_period_id',
                    'period_id',
                    'performance_bonus',
                    'status'
                ]}
            >
                <Datagrid bulkActionButtons={false}  showFooter>
                    <ReferenceField
                        reference="employees"
                        source="employee_id"
                        label="resources.PropayBonusReport.fields.employee_id"
                        link={false}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <ReferenceField
                        reference="propay"
                        source="propay_id"
                        label="resources.PropayBonusReport.fields.propay_id"
                        link={false}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <ReferenceField
                        reference="periods"
                        source="paid_period_id"
                        label="resources.PropayBonusReport.fields.paid_period_id"
                        link={false}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <ReferenceField
                        reference="periods"
                        source="period_id"
                        label="resources.PropayBonusReport.fields.period_id"
                        link={false}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <MoneyField source="performance_bonus" label="resources.PropayBonusReport.fields.performance_bonus" groupBy />
                </Datagrid>
            </ListGroup>
        </ResourceContextProvider>
    );
};
