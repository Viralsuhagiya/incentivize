import {
    DataProvider,
    fetchUtils,
    GetOneParams as RaGetOneParams,
    GetManyReferenceParams as RaGetManyReferenceParams,
    UpdateParams as RaUpdateParams,
    Identifier,
    UpdateManyParams as RaUpdateManyParams,
    CreateParams as RaCreateParams,
} from 'react-admin';
import _ from 'lodash';
import { NUMBER } from '../utils/Constants/MagicNumber';

const httpClient = fetchUtils.fetchJson;
const processFilters = (filters: object): [string, string, any][] => {
    let domain: [string, string, any][] = [];
    domain = _.toPairs(filters)
        .filter((keyPair: [string, any]) => keyPair[0] !== 'q')
        .map((keyPair: [string, any]) => [keyPair[0], '=', keyPair[1]]);
    const q = _.get(filters, 'q');
    if (q !== undefined) {
        domain = _.concat(domain, [['name', 'ilike', q]]);
    }
    console.log('processFilters ', filters, domain);
    return domain;
};
function getUserContext() {
    const userData = localStorage.getItem('loginUser')
        ? JSON.parse(localStorage.getItem('loginUser')||'{}')
        : {};
    return userData['user_context'];
}

function getBodyFromParams(data:any, includeKW = true) {
    return JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: includeKW
            ? {
                  kwargs: { context: getUserContext() },
                  ...data,
              }
            : data,
    });
}
async function search_read(
    model: string,
    domain: any,
    fields: any,
    sortField: string,
    sortOrder: string,
    page: any,
    perPage: any
) {
    if (fields === undefined || fields.length === 0) {
        throw new Error('Please specify fields to select');
    }
    //TODO: support for domain filter: JSON.stringify(params.filter),
    const url = `/web/dataset/search_read`;
    const requestParams = getBodyFromParams(
        {
            offset: (page - 1) * perPage,
            limit: perPage,
            model: model,
            sort: `${sortField} ${sortOrder}`,
            domain: domain,
            fields: fields,
        },
        false
    );
    // console.log(ReqParams);
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Content-Range',
        Accept: 'application/json',
    });
    const { json } = await httpClient(url, {
        method: 'POST',
        headers: headers,
        body: requestParams,
    });
    if (json.error) {
        console.log(
            `Error received for ${model} ${domain} ${fields} ${sortField} ${sortOrder} ${page} ${perPage} => `,
            json.error
        );
        throw odooError(json.error);
    } else {
        return json.result;
    }
}
function odooError(error:any) {
    console.log(_.get(error, 'data.debug'));
    return new Error(error.message);
}
async function readOne(
    model: string,
    ids: number[],
    fields: string[]
): Promise<any> {
    const result: any[] = await read(model, ids, fields);
    const resultOne: any = result[0];
    return resultOne;
}
async function read(
    model: string,
    ids: Identifier[],
    fields: string[]
): Promise<any[]> {
    const newIds: number[] = _.reduce(
        ids,
        (newIds:any, value, key) => {
            if (_.isSafeInteger(value)) {
                newIds.push(value);
            }
            return newIds;
        },
        []
    );
    if (!_.isEmpty(newIds)) {
        const { json } = await httpClient(
            `/web/dataset/call_kw/${model}/read`,
            {
                method: 'POST',
                body: getBodyFromParams({
                    args: [newIds, fields || ['id', 'name']],
                    method: 'read',
                    model: model,
                }),
            }
        );
        if (json.result) {
            return json.result;
        } else {
            console.log(
                `Error received for ${model} ${newIds} ${fields} => `,
                json.error
            );
            throw odooError(json.error);
        }
    } else {
        return [];
    }
}
/**
 * We needs to only send updated fields for that we are going to find updated keys here
 * and send them as new record.
 * also many2many fields will be converted into [[6,0,ids]] format as needed by odoo.
 * @param data
 * @param previousData
 * @returns
 */
export const transformForSubmit = (
    data: object,
    previousData?: object
): object => {
    console.log('Transform record ', data, previousData);
    const checkUpdated = (
        value: any,
        key: string
    ): { isUpdated: boolean; oldValue: any } => {
        let isUpdated: boolean = false;
        let oldValue = undefined;
        if (!_.startsWith(key, '@')) {
            oldValue = _.get(previousData, key);
            isUpdated = !_.isEqual(value, oldValue);
        } else {
            isUpdated = false;
            console.log(`Pick Skip ${key} as its internal key starting with @`);
        }
        return { isUpdated, oldValue };
    };
    const prepareMany2ManyField = (value: any, key: string, oldValue: any) => {
        let newValue: any[] = [[NUMBER.SIX, false, value]];
        return newValue;
    };
    let newRecord: object = _.create({});
    newRecord = _.reduce(
        data,
        (newRecord: object, value: any, key: string) => {
            const { isUpdated, oldValue } = checkUpdated(value, key);
            if (isUpdated) {
                if (
                    (_.isArray(value) || _.isArray(oldValue)) &&
                    (_.isNumber(_.head(value)) || _.isNumber(_.head(oldValue)))
                ) {
                    //this is array of integers so its many2many field
                    //find difference of array and prepare the m2m fields
                    value = prepareMany2ManyField(value, key, oldValue);
                }
                _.set(newRecord, key, value);
            }
            return newRecord;
        },
        newRecord
    );
    console.log('Transform updated fields => ', newRecord);
    return newRecord;
};

export interface GetOneParams extends RaGetOneParams {
    fields: string[];
}
export interface GetManyReferenceParams extends RaGetManyReferenceParams {
    fields: string[];
}

export interface UpdateParams<T = any> extends RaUpdateParams<T> {
    fields: string[];
}
export interface UpdateManyParams<T = any> extends RaUpdateManyParams<T> {
    fields: string[];
}
export interface CreateParams<T = any> extends RaCreateParams<T> {
    fields: string[];
}
const getInt = (id: any): number => {
    if (!_.isNumber(id)) {
        id = _.parseInt(id as string);
    }
    return id;
};
export default (apiUrl: string): DataProvider => ({
    getList: async (resource, params:any) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const domain = processFilters(params.filter);
        const result = await search_read(
            resource,
            domain,
            params.fields,
            field,
            order,
            page,
            perPage
        );
        return {
            data: result.records,
            total: result.length,
        };
    },

    getOne: (resource, params: any) => {
        console.log(
            `getMany ${resource} ${params.id} [${params.fields}] => `,
            params
        );
        return readOne(
            resource,
            [getInt(params.id)],
            params.fields || ['id', 'name']
        ).then(result => ({
            data: result,
        }));
    },

    getMany: (resource, params:any) => {
        console.log(
            `getMany ${resource} [${params.ids}] [${params.fields}] => `,
            params
        );
        return read(resource, params.ids, params.fields || ['id', 'name']).then(
            result => ({
                data: result,
                total: result.length,
            })
        );
    },

    getManyReference: async (resource, params: any) => {
        const { target, id, filter } = params;
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const domain = processFilters(_.set(filter, target, id));
        const result = await search_read(
            resource,
            domain,
            params.fields,
            field,
            order,
            page,
            perPage
        );
        return {
            data: result,
            total: result.length,
        };
    },

    update: async (resource, params: any) => {
        console.log('Update params', params);
        const { data, id, previousData } = params;
        const ids = [getInt(id)];
        const updateData = transformForSubmit(data, previousData);
        const { json } = await httpClient(
            `/web/dataset/call_kw/${resource}/write`,
            {
                method: 'POST',
                body: getBodyFromParams({
                    args: [ids, updateData || {}],
                    method: 'write',
                    model: resource,
                }),
            }
        );
        if (json.error) {
            console.log(
                `Error received for ${resource} [${ids}] [${params.fields}] => `,
                data,
                previousData,
                json.error
            );
            throw odooError(json.error);
        } else {
            const result: any = await readOne(
                resource,
                [getInt(id)],
                params.fields
            );
            return { data: result };
        }
    },

    updateMany: async (resource, params: any) => {
        const { json } = await httpClient(
            `/web/dataset/call_kw/${resource}/write`,
            {
                method: 'POST',
                body: getBodyFromParams({
                    args: [params.ids, params.data || {}],
                    method: 'write',
                    model: resource,
                }),
            }
        );
        if (json.error) {
            throw odooError(json.error);
        } else {
            const result: any[] = await read(
                resource,
                params.ids,
                params.fields
            );
            return { data: result, total: result.length };
        }
    },

    create: async (resource, params: any) => {
        const { json } = await httpClient(
            `/web/dataset/call_kw/${resource}/create`,
            {
                method: 'POST',
                body: getBodyFromParams({
                    args: [params.data || {}],
                    method: 'create',
                    model: resource,
                }),
            }
        );
        if (json.result) {
            const result: any = readOne(
                resource,
                [json.result],
                params.fields || ['id', 'name']
            );
            return { data: result };
        } else {
            throw odooError(json.error);
        }
    },

    //<RecordType extends Record = Record>(resource: string, params: DeleteParams<RecordType>) => Promise<DeleteResult<RecordType>>;
    delete: async (resource: string, params: any): Promise<any> =>  {
        const { json } = await httpClient(
            `/web/dataset/call_kw/${resource}/unlink`,
            {
                method: 'POST',
                body: getBodyFromParams({
                    args: [getInt(params.id)],
                    method: 'unlink',
                    model: resource,
                }),
            }
        );
        if (json.error) {
            throw odooError(json.error);
        } else {
            return {};
        }
    },

    deleteMany: async (resource, params:any) => {
        const { json } = await httpClient(
            `/web/dataset/call_kw/${resource}/unlink`,
            {
                method: 'POST',
                body: getBodyFromParams({
                    args: [params.ids],
                    method: 'unlink',
                    model: resource,
                }),
            }
        );
        if (json.error) {
            throw odooError(json.error);
        } else {
            return {};
        }
    },
});
