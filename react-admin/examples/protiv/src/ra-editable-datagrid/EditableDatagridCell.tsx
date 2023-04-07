import * as React from 'react';
import {useMemo,useState, useCallback,MouseEvent,cloneElement} from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
import classnames from 'classnames';
import { Record } from 'ra-core';
import {DatagridCellProps, useUpdate, useNotify,useSaveModifiers,SaveContextProvider} from 'react-admin';
import { EditFieldContext } from './EditFieldContext';
import { NUMBER } from '../utils/Constants/MagicNumber';

export const EditableDatagridCell = React.forwardRef<HTMLTableCellElement, EditableDatagridCellProps>(
    ({ className, field, record, basePath, resource, isRowEditable, onSuccess, autoSave=true, noSaveButton, ...rest }, ref) => {
    const form = field.props.form;

    const [isEdit, setEdit] = useState(false);

    const openEditMode = useCallback((): void => {
        setEdit(true);
    }, []);
    const closeEditMode = useCallback((): void => {
        setEdit(false);
    }, []);
    const notify = useNotify();
    const id = record.id
    const [update, { isLoading: saving }] = useUpdate(
        resource,
        { id:id, data:record , previousData:{} as any}
    );
    const defaultOnSuccess = useCallback(() => {
        notify(
            'ra.notification.updated',
            'info',
            {
                smart_count: 1,
            },
        );
        closeEditMode();
        if(onSuccess){
            onSuccess();
        }
    }, [notify, closeEditMode, onSuccess]);

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
            if(isEdit){
                //here it comes many times specially because of clicks in auto complete items.
                //so we needs to prevent this to going into edit mode if its already in edit mode.
                return;
            }
            const { tbody, row, column } = getTableClickEventPosition(event);
            
            openEditMode();
            // once the row is replaced by a form, focus the input inside the cell clicked
            tbody && setTimeout(() => {
                // No way to know the markup of the form in advance, as developers
                // can inject a form element of their own. The only valid assumption
                // is that the form should have the same number of columns as the row.
                // So we select the input based on the column it's in.
                const input = tbody.querySelector(
                    `tr:nth-child(${row}) td:nth-child(${column}) input`
                ) as HTMLInputElement;
                input && input.focus && input.focus();
            }, NUMBER.HUNDRED); // FIXME not super robust
        },
        [isEdit,openEditMode]
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
        
    return(
        <TableCell
            className={classnames(className, field.props.cellClassName)}
            align={field.props.textAlign}
            ref={ref}
            {...rest}
            onClick={
                ((typeof isRowEditable == 'function' ? isRowEditable(record) : true))
                ? handleClick
                : (): void => undefined
            }
        >
        {isEdit ? (
            <EditFieldContext.Provider value={rowContext}>
                <SaveContextProvider value={saveContext}>
                    <>
                        {cloneElement(form, {
                            id,
                            quitEditMode:closeEditMode,
                            resource,
                            record,
                            basePath,
                            save,
                            saving,
                            autoSave,
                            noSaveButton,
                            ...rest
                        })}
                    </>
                </SaveContextProvider>
            </EditFieldContext.Provider>
        ):React.cloneElement(field, {
            record,
            basePath: field.props.basePath || basePath,
            resource,
        })}
        </TableCell>)
    }
);

EditableDatagridCell.propTypes = {
    className: PropTypes.string,
    field: PropTypes.element,
    // @ts-ignore
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    basePath: PropTypes.string,
    resource: PropTypes.string,
    onSuccess: PropTypes.func,
    isRowEditable: PropTypes.func,
    autoSave: PropTypes.bool,
};

export interface EditableDatagridCellProps extends Omit<DatagridCellProps,'autoSave'> {
    basePath?: string;
    className?: string;
    field?: JSX.Element;
    record?: Record;
    resource?: string;
    onSuccess?: () => void;
    isRowEditable?: (record: Record) => boolean;
    autoSave?: boolean;
    noSaveButton?: boolean;
}

// What? TypeScript loses the displayName if we don't set it explicitly
EditableDatagridCell.displayName = 'RaEditableDatagridCell';



const getTableClickEventPosition = (
    event: MouseEvent<HTMLElement>
): { tbody: HTMLElement; row: number; column: number } => {
    const target = event.target as HTMLElement;
    const td = target.closest('td');
    if(!td){
        return {tbody:null, row:null, column:null};
    }
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
