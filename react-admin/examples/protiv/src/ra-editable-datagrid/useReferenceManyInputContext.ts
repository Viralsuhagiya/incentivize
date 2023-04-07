import { useContext } from 'react';
import { ReferenceManyInputContext } from './ReferenceManyInputContext';

export const useReferenceManyInputContext = () => {
    const context = useContext(ReferenceManyInputContext);
    return context;
};
