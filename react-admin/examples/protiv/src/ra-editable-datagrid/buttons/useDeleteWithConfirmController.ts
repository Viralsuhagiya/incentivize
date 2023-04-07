import { useState, useCallback, SyntheticEvent, ReactEventHandler } from 'react';
import {
    useDelete,
    useNotify,
    Record,
    RedirectionSideEffect,
    useShowContext,
    MutationMode,
    useListContext
} from 'react-admin';


const useDeleteWithConfirmController = ({
    mutationMode,
    resource,
    record,
    redirect: redirectTo = 'list',
    basePath,
    onSuccess,
}: UseDeleteWithConfirmControllerParams): UseDeleteWithConfirmControllerReturn => {
    const [open, setOpen] = useState(false);
    const notify = useNotify();
    const { refetch: parentListRefetch } = useListContext({resource:resource});
    const { refetch: parentShowRefetch } = useShowContext();

    const params = { id: record.id, previousData: record };
    const options = {
        mutationMode: 'pessimistic',
        onSuccess: (data:any,
            variables:any,
            context:any) => {
            notify('ra.notification.deleted', 'info', { smart_count: 1 });
            // redirect(redirectTo, basePath);
            if(onSuccess){
                onSuccess();
            }
            if(parentListRefetch){
                parentListRefetch();
            }
            if(parentShowRefetch){
                parentShowRefetch();
            }
            setOpen(false);
            
        },
        onError: (error: Error) => {
            setOpen(false);

            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                {
                    type: 'warning',
                    messageArgs: {
                        _:
                            typeof error === 'string'
                                ? error
                                : error && error.message
                                ? error.message
                                : undefined,
                    },
                }
            );
            // refresh();
            if(parentListRefetch){
                parentListRefetch();
            }
        },
    }
    const [deleteOne, { isLoading }] = useDelete(resource, params, options as any);

    const handleClick = (e: SyntheticEvent): void => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = (e: SyntheticEvent): void => {
        setOpen(false);
        e.stopPropagation();
    };

    const handleDelete = useCallback((): void => {
        deleteOne();
    }, [deleteOne]);

    return { open, isLoading, handleClick, handleDialogClose, handleDelete };
};

export interface UseDeleteWithConfirmControllerParams {
    mutationMode?: MutationMode;
    basePath?: string;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    onSuccess?: ()=>void;
}

export interface UseDeleteWithConfirmControllerReturn {
    open: boolean;
    isLoading: boolean;
    handleClick: (e: SyntheticEvent) => void;
    handleDialogClose: (e: SyntheticEvent) => void;
    handleDelete: ReactEventHandler<any>;
}

export default useDeleteWithConfirmController;
