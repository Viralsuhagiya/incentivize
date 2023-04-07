import TextField from '@mui/material/TextField';
import moment from 'moment';
import get from 'lodash/get';

const DateTimeTextField = (props: any) => {
    const { record } = props;
    const isLocal = false;
    const value = get(record, 'create_date');
    const date = isLocal ? moment(value): moment.utc(value).local();
    const fullFormat = 'MMM DD, YYYY | h:mm A';
    const dateString = date.format(fullFormat);

    return(
        <>
        <TextField id="outlined-basic" label="Create Date" variant="outlined" value={dateString} disabled />
        </>
    );
};
export default DateTimeTextField;

export const DateTimeTextLink = (props: any) => {
    const { record } = props;
    const isLocal = false;
    const value = get(record, 'create_date');
    const date = isLocal ? moment(value): moment.utc(value).local();
    const fullFormat = 'MMM DD, YYYY | h:mm A';
    const DateAndTime = date.format(fullFormat);

    return(
        <>
        <span>{DateAndTime}</span>
        </>
    );
};
