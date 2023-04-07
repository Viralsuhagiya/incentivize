import React, {
    isValidElement,
    cloneElement,
    ReactNode,
    ReactElement,
    useEffect,
} from 'react';
import { Form, FormProps } from 'react-final-form';
import {
    Record,
    Identifier,
    ExpandRowButton,
    OnFailure,
    OnSuccess,
    TransformData,
    useSaveContext,
} from 'react-admin';
import { TableRow, TableCell, Checkbox } from '@mui/material';

import SaveRowButton from './buttons/SaveRowButton';
import CancelEditButton from './buttons/CancelEditButton';
import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';

/**
 * A form to be rendered as a table row in an <EditableDatagrid>.
 *
 * All the props it expects are injected by <EditableDatagrid>. You should only
 * provide children to be rendered in each table cell.
 *
 * The children should be Input components, just like in a <SimpleForm>. You
 * can also pass a <Field> component as child.
 *
 * <RowForm> should have as many children as the <EditableDatagrid> that calls
 * it, or there will be a colSpan issue.
 *
 * @example
 *
 *     const ArtistForm: FC = props => (
 *         <RowForm {...props}>
 *             <TextField source="id" />
 *             <TextInput source="firstname" validate={required()} />
 *             <TextInput source="name" validate={required()} />
 *             <DateInput source="dob" label="born" validate={required()} />
 *             <SelectInput
 *                 source="prof"
 *                 label="Profession"
 *                 choices={professionChoices}
 *             />
 *         </RowForm>
 *     );
 *
 * @see EditableDatagrid
 */
const RowForm = (props: RowFormProps) => {
    const {
        children,
        record,
        id,
        className,
        quitEditMode,
        expand,
        hasBulkActions,
        initialValues,
        selectable,
        basePath,
        resource,
        save,
        saving,
        selected,
        undoable,
        onSuccess,
        onFailure,
        transform,
        allowResequence,
        innerRef,
        draggableProps,
        dragHandleProps,
        ...rest
    } = props;

    // handle submit by enter
    function onKeyDown(handleSubmit: any) {
        return (event: React.KeyboardEvent<HTMLDivElement>): void => {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                handleSubmit();
            }
        };
    }

    const saveContext = useSaveContext();

    useEffect(() => {
        if (saveContext.setOnFailure && onFailure) {
            saveContext.setOnFailure(onFailure);
        }
        if (saveContext.setOnSuccess && onSuccess) {
            saveContext.setOnSuccess(onSuccess);
        }
        if (saveContext.setTransform && transform) {
            saveContext.setTransform(transform);
        }
    }, [saveContext, onFailure, onSuccess, transform]);

    return (
        <Form
            initialValues={{ ...initialValues, ...record }}
            onSubmit={save}
            {...rest}
        >
            {({ handleSubmit, invalid, dirty, errors }): ReactElement => {
                return (
                    <TableRow
                        className={className}
                        key={id}
                        onKeyDown={onKeyDown(handleSubmit)}
                        {...draggableProps}
                        {...dragHandleProps}
                        ref={innerRef}
                    >
                        {allowResequence && <TableCell><ReorderRoundedIcon /></TableCell>}
                        {expand && (
                            <TableCell padding="none">
                                <ExpandRowButton
                                    expanded={false}
                                    disabled />
                            </TableCell>
                        )}
                        {hasBulkActions && (
                            <TableCell padding="checkbox">
                                {selectable && (
                                    <Checkbox
                                        color="primary"
                                        checked={selected}
                                        disabled />
                                )}
                            </TableCell>
                        )}
                        {React.Children.map(children, (field, index) => isValidElement(field) ? (
                            <TableCell
                                key={index}
                                className={field.props.cellClassName}
                                align={field.props.textAlign}
                            >
                                {cloneElement(field, {
                                    record,
                                    basePath: field.props.basePath || basePath,
                                    resource,
                                })}
                                {errors[field?.props?.label?.toLowerCase()] && (
                                <span className="error-datagrid">{errors[field?.props?.label?.toLowerCase()]}</span>
                                )}
                            </TableCell>
                        ) : null
                        )}
                        {/* className={DatagridClasses.actionColumn} */}
                        <TableCell>
                            <SaveRowButton
                                dirty={dirty}
                                handleSubmit={handleSubmit}
                                invalid={invalid}
                                quitEditMode={quitEditMode}
                                saving={saving}
                                undoable={undoable} 
                                />
                            <CancelEditButton cancel={quitEditMode} />
                        </TableCell>
                    </TableRow>
                );
            }
        }
        </Form>
    );
};

export interface RowFormProps extends Omit<FormProps, 'onSubmit'> {
    basePath?: string;
    children: ReactNode;
    className?: string;
    expand?: boolean;
    hasBulkActions?: boolean;
    id?: Identifier;
    onFailure?: OnFailure;
    onSuccess?: OnSuccess;
    quitEditMode?: () => void;
    record?: Record;
    resource?: string;
    save: (data: Partial<Record>) => void;
    saving?: boolean;
    selectable?: boolean;
    selected?: boolean;
    transform?: TransformData;
    undoable?: boolean;
}

// const useStyles = makeStyles(
//     {
//         actionColumn: {
//             whiteSpace: 'nowrap',
//             width: '5em',
//         },
//     },
//     {
//         name: 'RaRowForm',
//     }
// );

export default RowForm;
