import { getReference, getValue,moneyField, functionField,mapperExporter } from '../../components/mapperExporter';
import get from 'lodash/get';
import _ from 'lodash';
import { moneyReferenceField,moneyFunctionField, choiceField } from '../../components/mapperExporterFunctions';
import { PROPAY_STATUS } from '../propays';

const exportMapper = (translate) =>
({
    'propaydetails.job_id.name': getReference('job_id', 'jobs', 'full_name'),
    'propaydetails.job_id.revenue': moneyReferenceField('job_id_obj.id', 'jobs', 'revenue'),
    'propaydetails.name': functionField((record) => get(record, 'name')),
    'propaydetails.amount': moneyFunctionField('amount'),
    'propaydetails.earning': moneyFunctionField('earning'),
    'propaydetails.status': choiceField('status', PROPAY_STATUS,translate),
})
const headers = ['propaydetails.job_id.name',
'propaydetails.name',
'propaydetails.job_id.revenue',
'propaydetails.amount',
'propaydetails.earning',
'propaydetails.status']

const customTitle = "resources.propays.fields.propaydetails.title"

export const ProPayDetailExporter = (translate?)=> mapperExporter( headers , exportMapper(translate), translate,customTitle)

