import React, {
    isValidElement,
    cloneElement,
    ReactNode,
    ReactElement,
    useEffect,
    useCallback,
} from 'react';
import { Form, FormProps } from 'react-final-form';
import {
    Record,
    Identifier,
    OnFailure,
    OnSuccess,
    TransformData,
    useSaveContext,
} from 'react-admin';
import SaveFieldButton from './buttons/SaveFieldButton';
import AutoSave from './AutoSave';
import { NUMBER } from '../utils/Constants/MagicNumber';

const FieldForm = (props: FieldFormProps) => {
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
        autoSave=true,
        noSaveButton,
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
    //timeout as well.


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
    //if 

    return (
        <Form
            initialValues={{ ...initialValues, ...record }}
            onSubmit={save}
            {...rest}
        >
            {({ form, handleSubmit, invalid, dirty }): ReactElement => {
            return (
                <>
                    {autoSave && <AutoSaveSpy {...{form, handleAutoSave, handleSubmit, invalid , dirty}}/>}
                <FormRender {...{save, noSaveButton, onKeyDown, saving, basePath, undoable, handleAutoSave, quitEditMode, handleSubmit, children, record,resource, autoSave,invalid , dirty}}/>            
                </>
            )}
        }
        </Form>
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

const FormRender = (props:FieldFormProps) => {
    const {onKeyDown, noSaveButton, saving, basePath, undoable, quitEditMode, handleSubmit, children, record,resource, autoSave,invalid , dirty}= props;

    return (
                <span onKeyDown={onKeyDown(handleSubmit)}>
                    {React.Children.map(children, (field, index) =>
                        isValidElement(field) ? (
                            <>
                                {cloneElement(field, {
                                    key:index,
                                    record,
                                    basePath: field.props.basePath || basePath,
                                    resource,
                                })}
                            </>
                        ) : null
                    )}

                    {!noSaveButton&&<SaveFieldButton
                        dirty={dirty}
                        handleSubmit={handleSubmit}
                        invalid={invalid}
                        autoSave={autoSave}
                        quitEditMode={quitEditMode}
                        saving={saving}
                        undoable={undoable}
                    />}
                </span>                    
    );
};

export interface FieldFormProps extends Omit<FormProps, 'onSubmit'> {
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
    save?: (data: Partial<Record>) => void;
    saving?: boolean;
    selectable?: boolean;
    selected?: boolean;
    transform?: TransformData;
    undoable?: boolean;
    autoSave?: boolean;
    noSaveButton?: boolean;
}

export default FieldForm;
