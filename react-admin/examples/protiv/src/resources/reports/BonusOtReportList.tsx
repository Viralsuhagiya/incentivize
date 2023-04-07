import { transform } from 'inflection';
import moment from 'moment';
import {
    ReferenceField,
    ListActions,
    ResourceContextProvider,
    TextField, AutocompleteArrayInput, useTranslate
} from 'react-admin';
import { Datagrid } from '../../components/datagrid';
import { MoneyField } from '../../components/fields/fields';
import { ListGroup } from '../../layout/List';
import { Title } from '../../layout/Title';
import { StyledReferenceArrayInput } from '../payrolls/Payrolls';


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
        size="medium"
        source="employee_id._in"
        reference="employees"
        label="resources.PropayBonusReport.worker"
        alwaysOn
    >
        <AutocompleteArrayInput source="name" />
    </StyledReferenceArrayInput>
 ];

export const BonusOtReportList = (props: any) => {
    const translate = useTranslate();
    return (
        <ResourceContextProvider value="attendances">
            <ListGroup
                title={<Title title={translate("resources.PropayBonusReport.title")}/>}
                lazy={false}
                filters={ReportFilter}
                actions={<ListActions exporter={false} />}
                groupBy={['paid_period_id', 'employee_id']}
                filter= {{status: {_eq: 'paid'}, type: {_eq: 'is_performance_bonus'}}}
                fields={[
                    'paid_period_id',
                    'performance_bonus',
                    'bonus_ot_diff_amt',
                    'employee_id',
                    'bonus_earning',
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
                        reference="periods"
                        source="paid_period_id"
                        label="resources.PropayBonusReport.fields.paid_period_id"
                        link={false}
                    >
                        <TextField source="name" />
                    </ReferenceField>
                    <MoneyField source="performance_bonus" label="resources.PropayBonusReport.fields.performance_bonus" groupBy />
                    <MoneyField source="bonus_ot_diff_amt" label="resources.PropayBonusReport.fields.bonus_ot_diff_amt" groupBy />
                    <MoneyField source="bonus_earning" label="resources.PropayBonusReport.fields.bonus_earning" groupBy />
                </Datagrid>
            </ListGroup>
        </ResourceContextProvider>
    );
};
