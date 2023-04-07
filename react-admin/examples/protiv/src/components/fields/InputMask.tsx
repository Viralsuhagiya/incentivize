import TextField, { TextFieldProps } from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { FieldTitle, InputProps, useInput } from 'ra-core';
import * as React from 'react';
import { InputHelperText, sanitizeInputRestProps } from 'react-admin';
import InputMask from 'react-input-mask';
import { NUMBER } from '../../utils/Constants/MagicNumber';

export const validateMinutes = (values: any) => {
    if (values && parseInt(values) > NUMBER.FIFTY_NINE) {
        return 'Minutes must be less than 60';
    } else {
        return undefined;
    }
};

const defaultInputLabelProps = { shrink: true };

export interface CustomInputMaskProps{
    mask: string;
};

export interface InputMaskProps
    extends TextInputProps, CustomInputMaskProps {
};

export const MinutesInput = (props: TextInputProps) => {
    return <RaInputMask mask="99" textAlign="center" sx={{width: 40}} validate={validateMinutes}  {...props}/>
};

export const HoursInput = (props: TextInputProps) => {
    return <RaInputMask mask="99" textAlign="center" sx={{width: 40}}  {...props}/>
};

const RaInputMask = (props: InputMaskProps) => {
    const {
        label,
        format,
        helperText,
        onBlur,
        onFocus,
        onChange,
        options,
        parse,
        resource,
        source,
        validate,
        ...rest
    } = props;
    const {
        id,
        input,
        isRequired,
        meta: { error, submitError, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'text',
        validate,
        ...rest,
    });    
    return (
        <>
            <InputMask
                mask="99"
                id={id}
                {...input}
                error={!!(touched && (error || submitError))}
                helperText={
                    <InputHelperText
                        touched={touched}
                        error={error || submitError}
                        helperText={helperText}
                    />
                }
                maskChar={null} 
                InputLabelProps={defaultInputLabelProps}
                {...options}
                {...sanitizeInputRestProps(rest)}
            >
                {() =>
                    <TextField
                        id={id}
                        {...input}
                        label={
                            <FieldTitle
                                label={label}
                                source={source}
                                resource={resource}
                                isRequired={isRequired}
                            />
                        }
                        InputLabelProps={defaultInputLabelProps}
                        error={!!(touched && (error || submitError))}
                        helperText={
                            <InputHelperText
                                touched={touched}
                                error={error || submitError}
                                helperText={helperText}
                            />
                        }
                        {...options}
                        style={props.sx}
                        {...sanitizeInputRestProps(rest)}
                    />
                }</InputMask>
        </>
    );
};

RaInputMask.propTypes = {
    className: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

RaInputMask.defaultProps = {
    options: {},
};


export type TextInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'label' | 'helperText'>;
