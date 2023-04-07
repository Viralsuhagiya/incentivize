import { Record } from 'react-admin';

//taken from useUpdate onSuccess
export const updateCache = <RecordType extends Record = Record>({ queryClient, resource, id, data }) => {
    
    // hack: only way to tell react-query not to fetch this query for the next 5 seconds
    // because setQueryData doesn't accept a stale time option
    const now = Date.now();
    const updatedAt = now;

    const updateColl = (old: RecordType[]) => {
        if (!old) 
        {
            return;
        }
            const index = old.findIndex(
            // eslint-disable-next-line eqeqeq
            record => record.id == id
        );
        if (index === -1) {
            return old;
        }
        return [
            ...old.slice(0, index),
            { ...old[index], ...data },
            ...old.slice(index + 1),
        ];
    };

    type GetListResult = { data?: RecordType[]; total?: number };

    queryClient.setQueryData(
        [resource, 'getOne', String(id)],
        (record: RecordType) => ({ ...record, ...data }),
        { updatedAt }
    );
    queryClient.setQueriesData(
        [resource, 'getList'],
        (res: GetListResult) =>
            res && res.data
                ? { data: updateColl(res.data), total: res.total }
                : res,
        { updatedAt }
    );
    queryClient.setQueriesData(
        [resource, 'getMany'],
        (coll: RecordType[]) =>
            coll && coll.length > 0 ? updateColl(coll) : coll,
        { updatedAt }
    );
    queryClient.setQueriesData(
        [resource, 'getManyReference'],
        (res: GetListResult) =>
            res && res.data
                ? { data: updateColl(res.data), total: res.total }
                : res,
        { updatedAt }
    );
};