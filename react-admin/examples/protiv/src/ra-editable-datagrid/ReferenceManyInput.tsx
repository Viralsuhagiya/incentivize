import React, { useMemo } from 'react';
import { ReferenceManyInputContext } from './ReferenceManyInputContext';
import { ReferenceManyFieldProps, ReferenceManyField, useRecordContext } from 'react-admin';

const ReferenceManyInput = (props: ReferenceManyFieldProps) => {
    const { resource } = props;
    const record = useRecordContext(props);
    const createContext = useMemo(
        () => ({
            resource: resource,
            record: record
        }),
        [resource, record]
    );
    return (
        <ReferenceManyInputContext.Provider value={createContext}>
            <ReferenceManyField {...props} />
        </ReferenceManyInputContext.Provider>
    );
};
export default ReferenceManyInput;
