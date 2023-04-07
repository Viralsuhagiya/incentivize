
import { mapperExporter, getReference, moneyField } from '../../components/mapperExporter';

const exportMapper = {
    'employee_id': getReference('employee_id','employees','name'),
    'propay_id': getReference('propay_id','propays','name'),
    'paid_period_id': getReference('paid_period_id','periods','name'),
    'period_id': getReference('period_id','periods','name'),
    'performance_bonus': moneyField(),
}    

export const ProPayBonusExporter = (translate?)=> mapperExporter(['employee_id','propay_id','paid_period_id','period_id','performance_bonus'], exportMapper, translate)

