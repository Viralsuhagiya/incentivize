import _ from 'lodash';
import pluralize from 'pluralize';
import { ApolloQueryResult } from '@apollo/client';
import buildApolloClient, {
    getResponseParser as getResponseParserImpl
} from 'ra-data-graphql-simple';
import buildVariables from './buildVariables';
import buildGqlQuery from './buildGqlQuery';
import { BuildQueryFactory, IntrospectedResource } from 'ra-data-graphql';
import { DataProvider, DELETE, UPDATE, GET_LIST } from 'ra-core';
import gql from 'graphql-tag';
import inflection from 'inflection';
import {
    IntrospectionType,
} from 'graphql';
import queriesMatch from './queriesMatch';
import {ActionMutation} from './queries';
import queryExpandFields from './queryExpandFields';
const buildVariablesImpl = buildVariables
const buildGqlQueryImpl = buildGqlQuery;

const GET_LIST_GROUP = 'GET_LIST_GROUP';
const getGqlResource = (resource: string) => {
    return _.upperFirst(inflection.singularize(resource))
};

const customBuildQuery: BuildQueryFactory = introspectionResults => {
    const knownResources = introspectionResults.resources.map(r => r.type.name);
    introspectionResults.resources.forEach((resource:IntrospectedResource&{expandFields?:string[]}) => {
        const query = introspectionResults.queries.find(
            ({ name }) =>
                name === `all${pluralize(resource.type.name)}GroupBy`
        );
        if (query) {
            resource[GET_LIST_GROUP] = query;
        }

        resource.expandFields = queryExpandFields[resource.type.name]
    });

    return (raFetchType:any, resourceName, params) => {
        let raFetchType2 = raFetchType;
        if (raFetchType === GET_LIST && params.group) {
            raFetchType2 = GET_LIST_GROUP;
        }
            
        if (raFetchType === DELETE) {
            return {
                query: gql`mutation remove${resourceName}($id: Int!) {
                    remove${resourceName}(id: $id) {
                        id
                    }
                }`,
                variables: { id: params.id },
                parseResponse: ({ data }: ApolloQueryResult<any>) => {
                    if (data[`remove${resourceName}`]) {
                        return { data: { id: params.id } };
                    }

                    throw new Error(`Could not delete ${resourceName}`);
                },
            };
        };

        const methodQueries  = (queriesMatch as any)[raFetchType2] || {};
        if (raFetchType2 === UPDATE && params.action) {
            const customMutationName = `${resourceName}_${params.action}`;
            let customGql = methodQueries[customMutationName];
            if (!customGql) {
                customGql = ActionMutation(customMutationName, ['id']);
            }
            const customQuery = {
                query: gql`${customGql}`,
                variables: {id: params.id, ids: params.ids, propay_id: params.propay_id, employee_id: params.employee_id, base_wage: params.base_wage, selection_options:params.selection_options },
                parseResponse: ({ data }: ApolloQueryResult<any>) => {
                    console.log(`UPDATE ${customMutationName} Response => `, data);                    
                    if (data.data) {
                        return {data: data.data};
                    }
                    throw new Error(`Could not perform ${customMutationName}`);
                },
            };
            console.log(`UPDATE ${customMutationName} Variables => `, customQuery.variables);
            console.log(`UPDATE ${customMutationName} Query => `, customQuery.query);
            
            return customQuery;
        };
    
        const resource:any = introspectionResults.resources.find(
            r => r.type.name === resourceName
        );

        if (!resource) {
            throw new Error(
                `Unknown resource ${resourceName}. Make sure it has been declared on your server side schema. Known resources are ${knownResources.join(
                    ', '
                )}`
            );
        };

        const queryType = resource[raFetchType2];

        if (!queryType) {
            throw new Error(
                `No query or mutation matching fetch type ${raFetchType2} could be found for resource ${resource.type.name}`
            );
        };   
        const customQuery = methodQueries[resource.type.name];
        if (customQuery){
            console.log(`Using custom query for ${resource.type.name}`);
        };

        const variables = buildVariablesImpl(introspectionResults)(
            resource,
            raFetchType,
            params,
            queryType
        );
            //
        const query = customQuery?gql`${customQuery}`:buildGqlQueryImpl(introspectionResults)(
            resource,
            raFetchType,
            queryType,
            variables
        );
        let parseResponse;
        if(raFetchType!==raFetchType2){
            parseResponse = ({ data }: ApolloQueryResult<any>) => {
                if (data.items) {
                    return {data: data.items, total: data.items.length};
                } else {
                    return { data: [], total: 0 };
                }
            };
        } else {
            parseResponse = getResponseParserImpl(introspectionResults)(
                raFetchType,
                resource,
                queryType
            );
        }
        
        console.log(`${raFetchType} ${resource.type.name} ${queryType.name} Variables => `, JSON.stringify(variables));
        console.log(`${raFetchType} ${resource.type.name} ${queryType.name} Query => `, query);

        return {
            query,
            variables,
            parseResponse,
        };  
    };
};

export default async () => {
    const dataProvider = await buildApolloClient({
        clientOptions: {
            uri: '/graphql',
        },
        introspection: {
            operationNames: {
                [DELETE]: (resource: IntrospectionType) =>
                    `remove${resource.name}`,
            },
            exclude: undefined,
            include: undefined,
        },
        buildQuery: customBuildQuery,
    }).then(defaultDataProvider1 =>{
        return  {
            ...defaultDataProvider1,
            getListGroup: (resource, params) => {
                return defaultDataProvider1.getList(resource, {...params, group: true});
            },
            updateMany: (resource, params) => {
                return defaultDataProvider1.update(resource, params);
            },
        };
    });

    return new Proxy<DataProvider>(defaultDataProvider, {
        get: (target, name) => {
            if (typeof name === 'symbol' || name === 'then') {
                return;
            }
            return async (resource: string, params: any) => {
                return dataProvider[name](getGqlResource(resource), params);
            };
        },
    });
};
// Only used to initialize proxy
const defaultDataProvider: DataProvider = {
    create: () => Promise.reject({ data: null }), // avoids adding a context in tests
    delete: () => Promise.reject({ data: null }), // avoids adding a context in tests
    deleteMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getList: () => Promise.resolve({ data: [], total: 0 }), // avoids adding a context in tests
    getMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getManyReference: () => Promise.resolve({ data: [], total: 0 }), // avoids adding a context in tests
    getOne: () => Promise.reject({ data: null }), // avoids adding a context in tests
    update: () => Promise.reject({ data: null }), // avoids adding a context in tests
    updateMany: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
    getListGroup: () => Promise.resolve({ data: [] }), // avoids adding a context in tests
};
