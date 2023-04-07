import { SaveButton, Toolbar } from 'react-admin';

export const ToolbarSaveOnly = (props:any) => {
    const {
        alwaysEnableSaveButton,
        handleSubmit,
        handleSubmitWithRedirect,
        invalid,
        pristine,
        redirect,
        saving,
        submitOnEnter = true,
        validating,
    } = props; 
    const disabled = !valueOrDefault(alwaysEnableSaveButton,!pristine && !validating);
    return (
        <Toolbar {...props} >
            {/** TODO: add disable button into toolbar */}
            <SaveButton
                handleSubmitWithRedirect={
                    handleSubmitWithRedirect || handleSubmit
                }
                disabled={disabled}
                invalid={invalid}
                redirect={redirect}
                saving={saving || validating}
                submitOnEnter={submitOnEnter}            
            />
        </Toolbar>
    )
}

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;
