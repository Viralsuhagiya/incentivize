import React, {isValidElement,cloneElement,ReactNode,ReactElement,useEffect,useCallback} from 'react';
import { Form, FormProps } from 'react-final-form';
import {Record,Identifier,ExpandRowButton,OnFailure,OnSuccess,TransformData,useSaveContext} from 'react-admin';
import { TableRow, TableCell, Checkbox } from '@mui/material';
import CancelEditButton from './buttons/CancelEditButton';
import ReorderRoundedIcon from '@mui/icons-material/ReorderRounded';
import { NUMBER } from '../utils/Constants/MagicNumber';
import AutoSave from './AutoSave';

const AutoSaveInlineForm = (props: RowFormProps) => {
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
    const handleAutoSave = useCallback(
        ({handleSubmit, invalid, dirty}: { handleSubmit:()=>void, invalid:boolean, dirty:boolean}): void => {
            setTimeout(()=>{
                
                if (dirty && invalid) {
                    return;
                }
                if (!dirty) {
                    quitEditMode();
                    return;
                }

                handleSubmit();
        
                if (undoable && quitEditMode) {
                    quitEditMode();
                }
        
            },NUMBER.HUNDRED);
            
        },
        [undoable, quitEditMode]
    );

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
        <>
        <Form
            initialValues={{ ...initialValues, ...record }}
            onSubmit={save}
            {...rest}
        >
            {({ handleSubmit, invalid, dirty, errors, form }): ReactElement => {
                return (
                    <>
                    <AutoSaveSpy {...{form, handleAutoSave, handleSubmit, invalid , dirty}}/>
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
                        <TableCell>
                            <CancelEditButton cancel={quitEditMode} />
                        </TableCell>
                    </TableRow>
                    </>
                );
            }
        }
        </Form>
        </>
    );
};
const AutoSaveSpy = (props: any) => {
    const { handleAutoSave, handleSubmit, invalid , dirty } = props;
    const autoSaveCallback = useCallback((vals)=>{
        console.log("Called auto save in auto save spy ");
        handleAutoSave({ handleSubmit, invalid , dirty })
    },[handleAutoSave, handleSubmit, invalid , dirty]);

    return (<AutoSave save={autoSaveCallback}/>);
}

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

export default AutoSaveInlineForm;
