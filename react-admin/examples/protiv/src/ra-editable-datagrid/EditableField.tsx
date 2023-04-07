import * as React from 'react';
import {
    cloneElement,
    ReactElement,
    ReactNode,
} from 'react';
import {
    Identifier,
    Record} from 'react-admin';

const EditableField = ({
    form,
    basePath,
    children,
    rowClick,
    undoable,
    isEditable=true,
    onSuccess,
    autoSave,
    resource,
    record,
    ...rest
}: EditableFieldProps) => {

    return(
        <>
            {React.Children.map(children, (field, index) =>
                React.isValidElement(field) ? (
                    <>
                        {cloneElement(field, {
                            resource,
                            record,
                            ...rest
                        })}
                    </>
                ) : null
            )}
        </>
    );
};

/**
 * Based on a MouseEvent triggered by a click on a table row,
 * get the tbody element, the row and column number of the cell clicked.
 *
 * @param {MouseEvent} event
 */
export interface EditableFieldProps {
    form: ReactElement;
    resource?: string;
    id?: Identifier;
    record?: Record;
    basePath?: string;
    children?: ReactNode;
    undoable?: boolean;
    autoSave?: boolean;
    rowClick?: string;
    isEditable?: boolean;
    isRowDeletable?: (record: Record) => boolean;
    [key: string]: any;
}


export default EditableField;
