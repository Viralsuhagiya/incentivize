import * as React from 'react';
import { DateRangeInput, DateRangeInputProps, getStringFromDate } from './DateRangeInput';


export const DateRangeInputFilter = (props: DateRangeInputProps) => {
    return <DateRangeInput {...props} toValue={fromDateRange} format={getDateRange}/>
};

const fromDateRange = (value:any) => {
    return {_gte: getStringFromDate(value[0]), _lte: getStringFromDate(value[1])}
}
const getDateRange = (value:any) => {
    return value && [value._gte,value._lte] || [null, null]

}
