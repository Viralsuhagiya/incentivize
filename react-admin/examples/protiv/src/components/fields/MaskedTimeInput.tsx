import * as React from 'react';
import PropTypes from 'prop-types';
import { useInput, FieldTitle, InputProps } from 'ra-core';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { InputHelperText, sanitizeInputRestProps } from 'react-admin';
import { convertNumToTime } from '../../utils/formatter';
import InputMask from 'react-input-mask';
import { VALIDATION } from '../../utils/Constants/ValidationMessages';
import { NUMBER } from '../../utils/Constants/MagicNumber';

 const formatTime = (value: any) => {
    if (value && typeof value == 'number'){
        return convertNumToTime(value as number)
    } else {
        return value ||  ''
    };
};

export const validateTime = (values: any) => {
    if (values && typeof values == 'string' && !/^\d*:?\d*$/.test(values)) {
        return 'Please enter a valid number in the format hh:mm';
    }

    if (values && typeof values == 'string'){
        const [_hours, minutes] = values.split(':');
        if (minutes && parseInt(minutes) > NUMBER.FIFTY_NINE) {
            return VALIDATION.MINUTES_VALIDATION;
        } else {
            return undefined
        };
    } else {
        return undefined
    };
};

const defaultInputLabelProps = { shrink: true };

export const MaskedTimeInput = (props: TextInputProps) => {
    const {
        label,
        format=formatTime,
        helperText,
        onBlur,
        onFocus,
        onChange,
        options,
        parse,
        resource,
        source,
        validate=validateTime,
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
                        placeholder='hh:mm'
                    />
                }</InputMask>
        </>

    );
};

MaskedTimeInput.propTypes = {
    className: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

MaskedTimeInput.defaultProps = {
    options: {},
};

export type TextInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'label' | 'helperText'>;
