import * as React from 'react';
import PropTypes from 'prop-types';
import { useInput, FieldTitle, InputProps, ValidationError } from 'ra-core';
import { TextFieldProps } from '@mui/material/TextField';
import { InputHelperText, ResettableTextField, sanitizeInputRestProps } from 'react-admin';
import { convertNumToTime } from '../../utils/formatter';
import { FormHelperText } from '@mui/material';
import { NUMBER } from '../../utils/Constants/MagicNumber';

/**
 * An Input component for a string
 *
 * @example
 * <TextInput source='first_name' />
 *
 * You can customize the `type` props (which defaults to 'text').
 * Note that, due to a React bug, you should use `<NumberField>` instead of using type='number'.
 * @example
 * <TextInput source='email' type='email' />
 * <NumberInput source='nb_views' />
 *
 * The object passed as `options` props is passed to the <ResettableTextField> component
 */

 const formatTime = (value: string | Date) => {
    if (value && typeof value == 'number'){
        return convertNumToTime(value as number)
    };
    return value || ''
};

const parseTime = (value: any) => {
    const [hours, minutes] = value.split(':');
    if (minutes) {
        if (parseInt(minutes) < NUMBER.SIXTEY){
            const strminutes = parseFloat(minutes)/NUMBER.SIXTEY || 0.0;
            const time = parseInt(hours) + strminutes;
            return time;
        } else {
            return value;
        }
    } else {
        return parseFloat(value);
    }
};

export const TimeInput = (props: TextInputProps) => {
    const {
        label,
        format=formatTime,
        helperText,
        onBlur,
        onFocus,
        onChange,
        options,
        parse=parseTime,
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
    const [validateMinute, setError] = React.useState('');
    const setValue = (newValue:any) =>{
        const [hours, minutes] = newValue.target.value.split(':');
        if (minutes && parseInt(minutes) > NUMBER.FIFTYNINE) {
            setError('Minutes must be less than 60')
        } else {
            setError('')
        };
        return input.onChange(format(newValue))  
    };
    return (
        <>
        <ResettableTextField
            id={id}
            {...input}
            onChange={(newValue) => setValue(newValue)}
            label={
                label !== '' &&
                label !== false && (
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                )
            }
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
        {validateMinute && (
                <FormHelperText error>
                    <ValidationError error={validateMinute as string} />
                </FormHelperText>
            )}
        </>
        
    );
};

TimeInput.propTypes = {
    className: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

TimeInput.defaultProps = {
    options: {},
};

export type TextInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'label' | 'helperText'>;
