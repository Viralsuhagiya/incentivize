import moment from 'moment';
import { Record } from 'react-admin';

export const getHours = (record:Record):any => {
    var hours = record?.hours || 0
    const start = record?.start
    const end = record?.end
    if (start && end) {
        const startTime = moment(start);
        const endTime = moment(end);
        hours = endTime.diff(startTime, "hours", true);
    }
    return {hours};
};
