import * as React from 'react';
import { memo, FC } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Typography } from '@mui/material';
import { useRecordContext } from 'ra-core';
import moment from 'moment';

import { sanitizeFieldRestProps } from 'react-admin';
import { DateField as RaDateField, DateFieldProps as RaDateFieldProps } from 'react-admin';

export const DateField: FC<DateFieldProps> = memo(props => {
    const {
        className,
        emptyText,
        locales,
        dateFormat,
        timeFormat,
        showTime = false,
        isLocal,
        source,
        ...rest
    } = props;
    const record = useRecordContext(props);
    if (!record) {
        return null;
    }
    const value = get(record, source);
    if (value == null || value === '') {
        return emptyText ? (
            <Typography
                component="span"
                variant="body2"
                className={className}
                {...sanitizeFieldRestProps(rest)}
            >
                {emptyText}
            </Typography>
        ) : null;
    }

    //Date will always be considered as the local date, so shown as its coming from backend.
    //DateTime as of now because of backend issue, we are expecting datetime to be coming in local timezone so that also shown as it is.
    //TODO: once the datetime starts coming in UTC this will need to be changed so that isLocal is default false
    const date = isLocal ? moment(value): moment.utc(value).local();
    if(locales) {
        date.locale(locales);
    }
    
    const fullFormat = showTime? `${dateFormat} ${timeFormat}`: dateFormat;
    const dateString = date.format(fullFormat);
    console.log(`${source} => ${value} => `, date, dateString);

    return (
        <Typography
            component="span"
            variant="body2"
            className={className}
            {...sanitizeFieldRestProps(rest)}
        >
            {dateString}
        </Typography>
    );
});

DateField.defaultProps = {
    addLabel: true,
    dateFormat:'L',
    timeFormat:'LTS',
    isLocal: true,
};

DateField.propTypes = {
    ...RaDateField.propTypes,
    isLocal: PropTypes.bool,
};

DateField.displayName = 'DateField';

export interface DateFieldProps
    extends Omit<RaDateFieldProps,'options'> {
    dateFormat?: string;
    timeFormat?: string;
    isLocal?: boolean;
}
