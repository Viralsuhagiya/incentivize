import { getReference, getValue,moneyField, functionField,mapperExporter } from '../../components/mapperExporter';
import get from 'lodash/get';
import _ from 'lodash';
import { moneyReferenceField,moneyFunctionField, choiceField, choiceReferenceField } from '../../components/mapperExporterFunctions';
import { PROPAY_STATUS } from '../propays';

const exportMapper = (translate) =>
({
    'PropayStatusReport.fields.employee_id': getReference('employee_id', 'employees', 'name'),
    'PropayStatusReport.fields.propay_id': getReference('propay_id', 'propays', 'name'),
    'PropayStatusReport.fields.job_id': getReference('job_id', 'jobs', 'full_name'),
    'PropayStatusReport.fields.hours': functionField((record) => _.round(get(record, 'hours'),2)),
    'PropayStatusReport.fields.performance_bonus': moneyFunctionField('performance_bonus'),
    'PropayStatusReport.fields.status': choiceReferenceField('propay_id_obj.id', 'propays', 'status',PROPAY_STATUS,translate),

})

const headers = [
    'PropayStatusReport.fields.employee_id',
    'PropayStatusReport.fields.propay_id',
    'PropayStatusReport.fields.job_id',
    'PropayStatusReport.fields.hours',
    'PropayStatusReport.fields.performance_bonus',
    'PropayStatusReport.fields.status'
]

const customTitle = "resources.propayEmployeeWages.fields.PropayStatusReport.title"

export const ProPayStatusExporter = (translate?)=> mapperExporter( headers , exportMapper(translate), translate,customTitle)

