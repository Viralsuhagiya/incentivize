import jsonExport from 'jsonexport/dist';

import { downloadCSV, Exporter } from 'react-admin';
import get from 'lodash/get';
import pick from 'lodash/pick';
import _ from 'lodash';
import { NUMBER } from '../utils/Constants/MagicNumber';

export const mapperExporter = (headers, customMapper, translate?,customTitle?) => {
    const mapFields = (record) => {
        return _.mapValues(customMapper, (fieldMapper, key) => {
            const value = get(record, key);
            const mappedValue = fieldMapper&&fieldMapper.func?fieldMapper.func(value, key, record):value;
            return mappedValue;
        })
    };
    const exporter: Exporter = (records, fetchRelatedRecords, __, resource) => {
        const wait = _.filter(customMapper, (v,k) => v.type==='getReference').map((v,k) => {
            return new Promise((resolve, reject)=>{
                console.log('Fetching related records for ',v.params.source,v.params.reference);
                fetchRelatedRecords(records, v.params.source,v.params.reference)
                    .then((relatedRecords)=>{
                        console.log('DONE, Fetching related records for ',v.params.source,v.params.reference, relatedRecords);
                        resolve({relatedRecords:relatedRecords, source:v.params.source})
                    }).catch(e=>{
                        console.log('ERROR, Fetching related records for ',v.params.source,v.params.reference, e);
                        return {error:reject(e), source:v.params.source}
                    });
            });
        });
        Promise.all(wait).then((allFetch)=>{
            const data = records.map(record => {
                allFetch.forEach(({relatedRecords, source})=>{
                    record[source] = relatedRecords[get(record,source)];
                })
                return mapFields(record)
            }).map(record => {
                if(translate) {
                    const translatedHeaders = headers.map(header=>{
                        const translated = translate(`resources.${resource}.fields.${header}`);
                        record[translated] = get(record, header);
                        return translated;
                    })
                    
                    record = pick(record, ...translatedHeaders)
                }else{
                    record = pick(record, ...headers)
                }
                return record;
            });

            const finalHeaders = translate?headers.map(header=>{
                    const translated = translate(`resources.${resource}.fields.${header}`);
                    return translated;
                }):headers;
            const customTitleTranslated = translate && customTitle?translate(customTitle):customTitle
            const resourceTitle = translate?translate(`resources.${resource}.name`): resource;
            const title =  customTitleTranslated || resourceTitle
            return jsonExport(data, { 'headers': finalHeaders }, (err, csv) => downloadCSV(csv, title));            
        });        
    };    
    return exporter
};

export const directMapping = undefined;

export const formatDate = (value) => {
    const date = value instanceof Date ? value : new Date(value);
    const dateString = date.toLocaleDateString();
    return dateString;
};
export const dateField = () => {
    return {
        type:'dateField',
        func:(value, key, record) => {
            return formatDate(value);
        }
    };
};
export const getValue = () => {
    return {
        type:'getValue',
        params:{},
        func:(v, key, record) => {
            return get(record, key);
        }
    };
};
export const getReference = (source, reference, key) => {
    return {
        type:'getReference',
        params:{ source, reference, key },
        func:(__, ___, record) => {
            const relatedRecord = get(record, source, {});
            return get(relatedRecord, key);
        }
    };
};
export const functionField = (func) => {
    return {
        type:'functionField',
        func:(__, ___, record)=>{
            return func(record);
        }
    };
};
export const moneyField = () => {
    return {
        type:'moneyField',
        func:(value, ___, ____)=>{
            return _.round(value,NUMBER.TWO);
        }
    };
};
export const percentageField = () => {
    return {
        type:'percentageField',
        func:(value, ___, ____)=>{
            const val=value && _.round(value,NUMBER.TWO) * NUMBER.HUNDRED||0.0;
            return `${val}%`;
        }
    };
};


