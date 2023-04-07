import * as React from 'react';
import PropTypes from 'prop-types';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useInput, FieldTitle, InputProps } from 'ra-core';

import { sanitizeInputRestProps, useTranslate } from 'react-admin';
import { InputHelperText } from 'react-admin';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterMoment';
import { Box, Button, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import { NUMBER } from '../../utils/Constants/MagicNumber';

/**
 * Form input to edit a Date string value in the "YYYY-MM-DD" format (e.g. '2021-06-23').
 *
 * Renders a date picker (the exact UI depends on the browser).
 *
 * @example
 * import { Edit, SimpleForm, DateRangeInput } from 'react-admin';
 *
 * const PostEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *             <DateRangeInput source="published_at" />
 *         </SimpleForm>
 *     </Edit>
 * );
 *
 * @example
 * // If the initial value is a Date object, DateRangeInput converts it to a string
 * // but you must pass a custom parse method to convert the form value
 * // (which is always a date string) back to a Date object.
 * <DateRangeInput source="published_at" parse={val => new Date(val)} />
 */
export const DateRangeInput = ({
    defaultValue,
    format=getDateRange,
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
    parse,
    validate,
    variant = 'outlined',
    ...rest
}: DateRangeInputProps) => {
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
    const [datevalue, setDateValue] = React.useState([null, null]);
    const translate = useTranslate();
    const setValue = (newValue:any) =>{
        input.onChange(toValue?toValue(newValue):newValue);
        setDateValue(newValue);
    };
    
    const { search } = useLocation();
    const firstDate = search?.split('_gte')[NUMBER.ONE]?.slice(NUMBER.NINE,NUMBER.NINETEEN);
    const lastDate = search?.split('_lte')[NUMBER.ONE]?.slice(NUMBER.NINE,NUMBER.NINETEEN);

    React.useEffect(() => {
        if(firstDate || lastDate) 
          {
            setDateValue([firstDate,lastDate])
          };
     },[firstDate, lastDate]);
      
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
                id={id}
                {...input}
                value={datevalue}
                inputFormat={'MMM DD, YYYY'}
                onChange={(newValue) => setValue(newValue)}
                variant={variant}
                margin={margin}
                startText={translate('components.daterangeinput.startText')}
                endText={translate('components.daterangeinput.endText')}
                error={!!(touched && (error || submitError))}
                helperText={
                    <InputHelperText
                        touched={touched}
                        error={error || submitError}
                        helperText={helperText}
                    />
                }
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                InputLabelProps={defaultInputLabelProps}
                renderInput={(startProps, endProps) => (
                    <React.Fragment>
                        <TextField {...startProps} />
                        <Box sx={{ mx: 2 }}> to </Box>
                        <TextField {...endProps} />
                        {(datevalue[0] || datevalue[1]) && <Tooltip title='Clear Date Range' placement="bottom" arrow>
                            <Button className='reset-filter' onClick={() => setValue([null, null])}><Icon icon="charm:refresh" fr='' /></Button>
                        </Tooltip>}
                    </React.Fragment>
                )}
                {...options}
                {...sanitizeInputRestProps(rest)}
            />
            
            </LocalizationProvider>
    );
};

DateRangeInput.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

DateRangeInput.defaultProps = {
    options: {},
};

export type DateRangeInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'helperText' | 'label'>;

/**
 * Convert Date object to String
 *
 * @param {Date} value value to convert
 * @returns {String} A standardized date (yyyy-MM-dd), to be passed to an <input type="date" />
 */
export const convertDateToString = (value: Date) => {
    if (!(value instanceof Date) || isNaN(value.getDate()))
    {
        return '';
    }  
    const pad = '00';
    const yyyy = value.getFullYear().toString();
    const MM = (value.getMonth() + 1).toString();
    const dd = value.getDate().toString();
    return `${yyyy}-${(pad + MM).slice(NUMBER.NEGATIVE_TWO)}-${(pad + dd).slice(NUMBER.NEGATIVE_TWO)}`;
};

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const defaultInputLabelProps = { shrink: true };

const getDateRange = (value:any) => {
    return value || [null, null]
};

export const getStringFromDate = (value: string | Date) => {
    // null, undefined and empty string values should not go through dateFormatter
    // otherwise, it returns undefined and will make the input an uncontrolled one.
    if (value == null || value === '') {
        return '';
    };

    if (value instanceof Date) {
        return convertDateToString(value);
    };

    // valid dates should not be converted
    if (dateRegex.test(value)) {
        return value;
    };

    return convertDateToString(new Date(value));
};
