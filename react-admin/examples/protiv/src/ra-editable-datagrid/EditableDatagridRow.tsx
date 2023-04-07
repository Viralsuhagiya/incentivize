import * as React from 'react';
import {
    cloneElement,
    MouseEvent,
    ReactElement,
    ReactNode,
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    DatagridRow,
    Identifier,
    Record,
    SaveContextProvider,
    useShowContext,
    useNotify,
    useSaveModifiers,
    useUpdate,
    RecordContextProvider
} from 'react-admin';
import { DatagridClasses } from 'ra-ui-materialui';
import { EditRowContext } from './EditRowContext';
import EditViewDatagridCell from './EditViewDatagridCell';

const EditableRow = ({
    form,
    resource,
    id,
    record,
    basePath,
    children,
    rowClick,
    undoable,
    isRowEditable,
    onSuccess,
    isDragging,
    innerRef,
    allowResequence,
    draggableProps,
    dragHandleProps,
    ...rest
}: EditableRowProps) => {
    const [isEdit, setEdit] = useState(false);
    const openEditMode = useCallback((): void => {
        setEdit(true);
    }, []);
    const closeEditMode = useCallback((): void => {
        setEdit(false);
    }, []);
    const notify = useNotify();
    const [update, { isLoading: saving }] = useUpdate(
        resource,
        { id:id, data:record , previousData:{} as any}
    );
    const { refetch: parentRefetch } = useShowContext();
    const defaultOnSuccess = useCallback(() => {
        notify(
            'ra.notification.updated',
            'info',
            {
                smart_count: 1,
            },
            undoable
        );
        closeEditMode();
        if(onSuccess){
            onSuccess();
        }
        
        if(parentRefetch){
            console.log("Callling parent refetch");
            parentRefetch();
        }
    }, [notify, undoable, closeEditMode, parentRefetch, onSuccess]);

    const defaultOnFailure = useCallback(
        (error): void => {
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

    const handleClick = useCallback(
        (event: MouseEvent<HTMLElement>): void => {
            const { tbody, row, column } = getTableClickEventPosition(event);
            openEditMode();
            // once the row is replaced by a form, focus the input inside the cell clicked
            setTimeout(() => {
                // No way to know the markup of the form in advance, as developers
                // can inject a form element of their own. The only valid assumption
                // is that the form should have the same number of columns as the row.
                // So we select the input based on the column it's in.
                const input = tbody.querySelector(
                    `tr:nth-child(${row}) td:nth-child(${column}) input`
                ) as HTMLInputElement;
                input && input.focus && input.focus();
            }, 100); // FIXME not super robust
        },
        [openEditMode]
    );

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
                    : !!transformRef.current
                    ? transformRef.current(data)
                    : data
            ).then(data =>
                update(
                    resource,
                    { id, previousData: record, data:data },
                    {
                        mutationMode: 'pessimistic',
                        onSuccess: onSuccessFromSave
                            ? onSuccessFromSave
                            : !!onSuccessRef.current
                            ? onSuccessRef.current
                            : defaultOnSuccess,
                        onError: onFailureFromSave
                            ? onFailureFromSave
                            : !!onFailureRef.current
                            ? onFailureRef.current
                            : defaultOnFailure
                    }
                )
            ),
        [transformRef, update, resource, id, record, onSuccessRef, defaultOnSuccess, onFailureRef, defaultOnFailure]
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

    const rowContext = useMemo(
        () => ({
            open: openEditMode,
            close: closeEditMode,
        }),
        [openEditMode, closeEditMode]
    );

    return (
        <EditRowContext.Provider value={rowContext}>
            {isEdit ? (
                <SaveContextProvider value={saveContext}>
                    <RecordContextProvider value={record}>
                    {cloneElement(form, {
                        id,
                        quitEditMode: closeEditMode,
                        resource,
                        record,
                        basePath,
                        save,
                        saving,
                        undoable,
                        allowResequence,
                        innerRef:innerRef,
                        isDragging,
                        draggableProps,
                        dragHandleProps,
                        ...rest,
                    })}
                    </RecordContextProvider>
                </SaveContextProvider>
            ) : (
                <DatagridRow
                    cell={<EditViewDatagridCell isDragging={isDragging} onSuccess={onSuccess} isRowEditable={isRowEditable}/>}
                    resource={resource}
                    id={id}
                    record={record}
                    basePath={basePath}
                    ref={innerRef}
                    {...draggableProps}
                    {...dragHandleProps}
                    {...rest}
                    className={DatagridClasses.rowCell}
                    onClick={
                        (rowClick === 'edit' && (typeof isRowEditable == "function" ? isRowEditable(record) : true))
                            ? handleClick
                            : (): void => undefined
                    }
                >
                    {children}
                </DatagridRow>
            )}
        </EditRowContext.Provider>
    );
};

/**
 * Based on a MouseEvent triggered by a click on a table row,
 * get the tbody element, the row and column number of the cell clicked.
 *
 * @param {MouseEvent} event
 */
const getTableClickEventPosition = (
    event: MouseEvent<HTMLElement>
): { tbody: HTMLElement; row: number; column: number } => {
    const target = event.target as HTMLElement;
    const td = target.closest('td');
    const tr = td?.parentNode;
    const columns = tr?.children as HTMLCollection;
    let column: number = 0;
    for (let index = 0; index < columns.length; index++) {
        if (columns.item(index) === td) {
            column = index + 1;
        }
    }
    const tbody = tr?.parentNode as HTMLElement;
    const rows = tbody.children as HTMLCollection;
    let row: number = 0;
    for (let index = 0; index < rows.length; index++) {
        if (rows.item(index) === tr) {
            row = index + 1;
        }
    }
    return { tbody, row, column };
};

export interface EditableRowProps {
    form: ReactElement;
    resource?: string;
    id?: Identifier;
    record?: Record;
    basePath?: string;
    children?: ReactNode;
    undoable?: boolean;
    rowClick?: string;
    isRowEditable?: (record: Record) => boolean;
    isRowDeletable?: (record: Record) => boolean;
    [key: string]: any;
}

// const useStyles = makeStyles(
//     {
//         td: {
//             '& td:last-of-type > *': {
//                 visibility: 'hidden',
//             },
//             '&:hover td:last-of-type > *': {
//                 visibility: 'visible',
//             },
//         },
//     },
//     {
//         name: 'RaEditableDatagridRow',
//     }
// );

export default EditableRow;
