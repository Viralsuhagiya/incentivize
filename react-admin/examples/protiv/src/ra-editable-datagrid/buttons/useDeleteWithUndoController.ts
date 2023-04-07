import { useCallback, SyntheticEvent } from 'react';
import {
    useDelete,
    useNotify,
    Record,
    RedirectionSideEffect,
    useListContext,
    useShowContext,
} from 'react-admin';

/**
 * @deprecated use react-admin's useDeleteWithUndoController instead
 */
const useDeleteWithUndoController = ({
    resource,
    record,
    basePath,
    redirect: redirectTo = 'list',
}: UseDeleteWithUndoControllerParams): UseDeleteWithUndoControllerReturn => {
    const notify = useNotify();
    const { refetch: parentListRefetch } = useListContext();
    const { refetch: parentShowRefetch } = useShowContext();

    const [deleteOne, { isLoading }] = useDelete(
        resource,
        {
            id:record && record.id,
            previousData:record
        },
        {
            mutationMode: 'undoable',
            onSuccess: (): void => {
                notify(
                    'ra.notification.deleted',
                    'info',
                    { smart_count: 1 },
                    true
                );
                // redirect(redirectTo, basePath);
                //refresh();
                if(parentListRefetch){
                    parentListRefetch();
                }
                if(parentShowRefetch){
                    parentShowRefetch();
                }
            },
            onError: (error: any): void =>
                notify(
                    typeof error === 'string'
                        ? error
                        : error.message || 'ra.notification.http_error',
                    'warning'
                )
            
        }
    );
    const handleDelete = useCallback(
        (event: SyntheticEvent) => {
            event.stopPropagation();
            deleteOne();
        },
        [deleteOne]
    );

    return { isLoading, handleDelete };
};

interface UseDeleteWithUndoControllerParams {
    basePath?: string;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
}

interface UseDeleteWithUndoControllerReturn {
    isLoading: boolean;
    handleDelete: (event: SyntheticEvent) => void;
}

export default useDeleteWithUndoController;
