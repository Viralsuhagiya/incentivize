import { DesktopTimePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { styled, TextField as DefaultTextField, FormHelperText } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';
import { FieldTitle, InputProps, useInput, ValidationError } from 'ra-core';
import * as React from 'react';
import { useState } from 'react';

import { InputHelperText, sanitizeInputRestProps } from 'react-admin';
import moment from 'moment';
import { convertNumToTime } from '../../utils/formatter';
import { NUMBER } from '../../utils/Constants/MagicNumber';

export type TimePickerInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'helperText' | 'label'  | 'onChange'
    | 'onBlur'
    | 'onFocus'
    | 'defaultValue'>;

const StyledTextInput = styled(DefaultTextField)({
    '.MuiInputAdornment-root': {
        display: 'none',
    },
});

const formatTime = (value: string | Date) => {
    if (value && typeof value == 'number') {
        return moment(convertNumToTime(value), ['HH:mm']).toDate();
    }
    return value || ''
};

const parseTime = (value: any) => {
    let new_hours = value
    if (value && value?.format() === 'Invalid date') {
        const val = value._i.split(':');
        new_hours = parseInt(val[0]) + (parseInt(val[1]) / NUMBER.SIXTEY);
    }
    else {
        new_hours = moment(value).hours() + (moment(value).minutes() / NUMBER.SIXTEY);
    }
    return new_hours || null
};


const defaultInputLabelProps = { shrink: true };

export const DesktopTimePickerInput = ({
    defaultValue,
    format = formatTime,
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
    parse = parseTime,
    validate,
    variant = 'outlined',
    sx,
    ...rest
}: TimePickerInputProps) => {
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
        validate,
        ...rest,
    });

    const { error, submitError, touched } = meta;
    const [validateMinute, setError] = useState('');
    const setValue = (newValue: any) => {
        let newDate = newValue;
        if (newValue && newValue?.format() === 'Invalid date') {
            const val = newValue._i.split(':');
            let time = val[0].padStart(NUMBER.TWO, '0')
            if (parseInt(val[1]) > 59) {
                setError('Minutes must be less than 60')
            } else {
                setError('')
            }
            if (val.length === 2) {
                time = [time, val[1].padStart(NUMBER.TWO, '0')].join(':')
            }
            newDate = moment(time, 'HH:mm');
        }
        input.onChange(format(newDate))
    };
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <DesktopTimePicker
                id={id}
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
                    return <StyledTextInput {...params}
                        error={!!(touched && (error || submitError))}
                        variant={variant}
                        sx={sx}
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
                        }
                        placeholder='hh:mm'
                    />

                }
                }
                {...options}
                {...sanitizeInputRestProps(rest)}
            />
            {validateMinute && (
                <FormHelperText error>
                    <ValidationError error={validateMinute as string} />
                </FormHelperText>
            )}
        </LocalizationProvider>
    )
};
