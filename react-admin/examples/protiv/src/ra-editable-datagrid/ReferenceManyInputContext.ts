import { createContext } from 'react';
import { Record } from 'react-admin';

export const ReferenceManyInputContext = createContext<ReferenceManyInputContextValue>({} as ReferenceManyInputContextValue);

export type ReferenceManyInputContextValue = {
    resource: string | undefined;
    record: Record;
};
