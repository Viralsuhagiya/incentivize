import get from 'lodash/get';

import { mapperExporter, getReference, formatDate, functionField, percentageField, moneyField } from '../../components/mapperExporter';

export const exportMapper = {
    'dates': functionField((record)=>{
        return formatDate(get(record, 'start_date')) +' - '+ formatDate(get(record, 'end_date'));
    }),
    'employee_id': getReference('employee_id','employees','name'),
    'standard_wage': moneyField(),
    'pay_rate': moneyField(),
    'wage_growth': moneyField(),
    'wage_growth_per': percentageField(),
}    

const exporter = (translate?)=> mapperExporter(['dates','employee_id','standard_wage','pay_rate','wage_growth','wage_growth_per'], exportMapper, translate)

export default exporter;
