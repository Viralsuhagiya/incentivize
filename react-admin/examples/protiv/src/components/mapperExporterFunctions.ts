import { functionField } from './mapperExporter';
import _ from 'lodash';
import { NUMBER } from '../utils/Constants/MagicNumber';

export const moneyFieldFormater = (record,key) => '$'+_.round(_.get(record,key) || 0,NUMBER.TWO);
export const moneyFunctionField = (key) => {
    return functionField((record)=>moneyFieldFormater(record,key))
};
export const moneyReferenceField = (source,reference,key) => {
    return {
        type:'getReference',
        params:{ source, reference, key },
        func:(__, ___, record) => {
            const relatedRecord = _.get(record, source, {});
            return moneyFieldFormater(relatedRecord,key)
        }
    };
};
export const choiceField = (key,choices,translate)=>{
    const choicesById = _.keyBy(choices,'id')
    return functionField((record)=>{
        const value = _.get(record,key)
        const name = _.get(_.get(choicesById,value),'name')
        return translate?translate(name):name
    });
};

export const choiceReferenceField = (source,reference,key,choices,translate) => {
    const choicesById = _.keyBy(choices,'id')
    return {
        type:'getReference',
        params:{ source, reference, key },
        func:(__, ___, record) => {
            const relatedRecord = _.get(record, source, {});
            const value = _.get(relatedRecord,key)
            const name = _.get(_.get(choicesById,value),'name')
            return translate?translate(name):name
        }
    };
};


