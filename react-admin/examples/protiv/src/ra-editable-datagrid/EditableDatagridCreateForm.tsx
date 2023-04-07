import {
    cloneElement,
    useCallback,
    ReactElement,
    ReactNode,
    useMemo,
} from 'react';

import PropTypes from 'prop-types';
import {
    useCreate,
    useNotify,
    Record,
    useSaveModifiers,
    SaveContextProvider,
    useResourceContext,
    RecordContextProvider,
    useListContext
} from 'react-admin';

import { CreateRowContext } from './CreateRowContext';

const EditableDatagridCreateForm = (props: EditableDatagridCreateFormProps&{allowResequence}) => {
    const {
        basePath,
        expand,
        hasBulkActions,
        createForm,
        hasStandaloneCreateForm,
        isStandaloneCreateFormVisible,
        closeStandaloneCreateForm,
        onSuccess,
        allowResequence
    } = props;

    const notify = useNotify();
    const resource = useResourceContext(props);
    const {
        refetch:parentListRefetch
    } = useListContext(props);

    const [create, { isLoading: saving }] = useCreate(resource, {});
    const hideCreateForm = useCallback((): void => {
        if (hasStandaloneCreateForm) {
            closeStandaloneCreateForm();
        } else {
           
        }
    }, [closeStandaloneCreateForm, hasStandaloneCreateForm]);

    const defaultOnSuccess = useCallback(() => {
        notify('ra.notification.created', 'info', {
            smart_count: 1,
        });
        //refresh();
        if(onSuccess){
            onSuccess();
        }
        if(parentListRefetch){
            parentListRefetch();
        }
        hideCreateForm();
    }, [hideCreateForm, notify, onSuccess, parentListRefetch]);

    const defaultOnFailure = useCallback(
        error => {
            notify(
                typeof error === 'string'
                    ? error
                    : error.message || 'ra.notification.http_error',
                'warning'
            );
        },
        [notify]
    );

    const {
        onSuccessRef,
        setOnSuccess,
        onFailureRef,
        setOnFailure,
        transformRef,
        setTransform,
    } = useSaveModifiers({
        onFailure: defaultOnFailure,
        onSuccess: defaultOnSuccess,
    });

    const save = useCallback(
        (
            data: Partial<Record>,
            _, // unused redirectTo
            {
                onSuccess: onSuccessFromSave,
                onFailure: onFailureFromSave,
                transform: transformFromSave,
            } = {}
        ) =>
            Promise.resolve(
                transformFromSave
                    ? transformFromSave(data)
                    : transformRef.current
                    ? transformRef.current(data)
                    : data
            ).then(data => {
                return create(
                    resource,
                    { data: data },
                    {
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : !!onSuccessRef.current
                            ? onSuccessRef.current
                            : defaultOnSuccess,
                        onError: onFailureFromSave
                            ? onFailureFromSave
                            : !!onFailureRef.current
                            ? onFailureRef.current
                            : defaultOnFailure,
                    }
                );
            }),
        [create, defaultOnFailure, defaultOnSuccess, onFailureRef, onSuccessRef, resource, transformRef]
    );

    const saveContext = {
        save,
        saving,
        setOnSuccess,
        setOnFailure,
        setTransform,
        onSuccessRef,
        onFailureRef,
        transformRef,
    };

    const createContext = useMemo(
        () => ({
            close: hideCreateForm,
        }),
        [hideCreateForm]
    );
    const record = {};
    const createFormElement = (
        <SaveContextProvider value={saveContext}>
            <CreateRowContext.Provider value={createContext}>
                <RecordContextProvider value={record}>
                {cloneElement(createForm as ReactElement, {
                    expand,
                    hasBulkActions,
                    id: 'new_record',
                    quitEditMode: hideCreateForm,
                    record: record,
                    resource,
                    basePath,
                    save,
                    saving,
                    selectable: false,
                    parent: props.parent,
                    allowResequence:allowResequence,
                })}
                </RecordContextProvider>
            </CreateRowContext.Provider>
        </SaveContextProvider>
    );
    if (hasStandaloneCreateForm) {
        // create form triggered by state
        return isStandaloneCreateFormVisible && createFormElement || <></>;
    }
    //TODO: this is not working as top level create on same list, needs to fix this.
    // create form in a route
    // return <Route path={`${basePath}/create`}>{createFormElement}</Route>;
    return <></>;
};

export interface EditableDatagridCreateFormProps {
    basePath?: string;
    expand?: ReactNode;
    hasBulkActions?: boolean;
    resource?: string;
    createForm?: ReactElement;
    hasStandaloneCreateForm?: boolean;
    isStandaloneCreateFormVisible: boolean;
    closeStandaloneCreateForm: () => void;
    parent?: {resource:string, record: Record};
    onSuccess?: () => void;
}

EditableDatagridCreateForm.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.any,
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    resource: PropTypes.string,
    createForm: PropTypes.element,
    hasStandaloneCreateForm: PropTypes.bool,
    isStandaloneCreateFormVisible: PropTypes.bool.isRequired,
    closeStandaloneCreateForm: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};

export default EditableDatagridCreateForm;
