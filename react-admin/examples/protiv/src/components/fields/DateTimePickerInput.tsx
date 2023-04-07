import { DateTimePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField as DefaultTextField } from '@mui/material';
import { useInput, FieldTitle, InputProps } from 'ra-core';
import { TextFieldProps } from '@mui/material/TextField';
import * as React from 'react';
import { InputHelperText, sanitizeInputRestProps } from 'react-admin';
import moment from 'moment';
import { useIdentityContext } from '../identity';

export type DateTimePicketInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'helperText' | 'label'>;

const formatDateTime = (value: string | Date) => {
    // null, undefined and empty string values should not go through convertDateToString
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return '';
    }
    return moment(value).format('YYYY-MM-DD HH:mm:ss')
};
const parseTime = (value:string)=>{
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
};
const defaultInputLabelProps = { shrink: true };

export const DateTimePickerInput = ({
    defaultValue,
    format=formatDateTime,
    toValue,
    initialValue,
    label,
    name,
    options,
    source,
    resource,
    helperText,
    margin = 'dense',
    onBlur,
    onChange,
    onFocus,
    parse=parseTime,
    validate,
    variant = 'outlined',
    ...rest
}: DateTimePicketInputProps) => {
    const validateDateTime = value => {
        if (value && typeof value === 'string' && value === 'Invalid date') {
            return 'Invalid Date'
        };
        return undefined;
    }
    const newValidate = !validate?validateDateTime:(typeof validate === 'function'? [validate, validateDateTime]:[...validate,validateDateTime]);
    const { id, input, isRequired, meta } = useInput({
        defaultValue,
        format,
        initialValue,
        name,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        validate:newValidate,
        ...rest,
        });
    
        const { error, submitError, touched } = meta;
        const setValue = (newValue:any) =>{
            input.onChange(format(newValue))
        };
    const identity = useIdentityContext();
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <DateTimePicker
                id={id}
                ampm={identity?.time_format === '12' ? true : false}
                {...input}
                onChange={(newValue) => setValue(newValue)}
                variant={variant}
                margin={margin}
                error={!!(touched && (error || submitError))}
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                InputLabelProps={defaultInputLabelProps}
                renderInput={(params) => {
                            return <DefaultTextField 
                            {...input}
                            {...params} 
                            variant={variant}
                            sx={{minWidth:200}}
                            multiline 
                            maxRows={2}                        
                            error={!!(touched && (error || submitError))}
                            label={
                                <FieldTitle
                                    label={label}
                                    source={source}
                                    resource={resource}
                                    isRequired={isRequired}
                                />
                            }
                            helperText={
                            <InputHelperText
                                touched={touched}
                                error={error || submitError}
                                helperText={helperText}
                            />
                            } {...sanitizeInputRestProps(rest)}/>
                        }
                    }
                {...options}
                {...sanitizeInputRestProps(rest)}
            />
        </LocalizationProvider>
    )
};
