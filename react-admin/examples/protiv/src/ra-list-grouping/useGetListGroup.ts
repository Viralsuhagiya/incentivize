import {
    useQuery,
    UseQueryOptions,
    UseQueryResult,
    useQueryClient,
} from 'react-query';

import { Record, GetListParams } from 'react-admin';
import { useDataProvider } from 'react-admin';


export const useGetListGroup = <RecordType extends Record = Record>(
    resource: string,
    params: Partial<GetListParams & {groupBy:String[], fields:String[], lazy?: boolean}> = {},
    options?: UseQueryOptions<{ data: RecordType[]; total: number }, Error>
): UseGetListGroupHookValue<RecordType> => {
    const {
        pagination = { page: 1, perPage: 25 },
        sort = { field: 'id', order: 'DESC' },
        filter = {},
        groupBy = [],
        fields = [],
        lazy = true,
    } = params;
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const result = useQuery<
        { data: RecordType[]; total: number },
        Error,
        { data: RecordType[]; total: number }
    >(
        [resource, 'getListGroup', { groupBy, fields, lazy, pagination, sort, filter }],
        () =>
            (dataProvider
                .getListGroup(resource, { groupBy, fields, lazy, pagination, sort, filter }) as any)
                .then(({ data, total }) => ({ data, total })),
        {
            onSuccess: ({ data }) => {
                // optimistically populate the getOne cache
                data.forEach(record => {
                    queryClient.setQueryData(
                        [resource, 'getListGroup', String(record.id)],
                        record
                    );
                });
            },
            ...options,
        }
    );

    return (result.data
        ? {
              ...result,
              data: result.data?.data,
              total: result.data?.total,
          }
        : result) as UseQueryResult<RecordType[], Error> & { total?: number };
};

export type UseGetListGroupHookValue<
    RecordType extends Record = Record
> = UseQueryResult<RecordType[], Error> & { total?: number };
