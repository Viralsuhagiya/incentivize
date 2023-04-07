import _ from 'lodash';
import moment from 'moment';
import { convertDateToString } from '../../components/fields/DateRangeInput';
import { NUMBER } from '../../utils/Constants/MagicNumber';
export const getDaysArray = (start, end) =>  {
    for(var arr=[],dt=moment(start).toDate(); dt<=moment(end).toDate(); dt.setDate(dt.getDate()+1)){
        arr.push(convertDateToString(moment(dt).toDate()));
    }
    return arr;
};

export const getWeekNumber = (date,allWeeks) => {
    let newDate = moment(date).toDate().getTime();
    let result = allWeeks.filter(d => {
        var start = moment(d.begin).toDate().getTime();
        var end = moment(d.end).toDate().getTime();
        return (newDate >= start && newDate <= end)
    });
    return _.size(result) ? result[0].weekName:null
};
export const getAllWeeks = (startDate, endDate) => {
    endDate = moment(endDate).toDate();
    let dates = [];
    const addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    let currentDate = moment(startDate) .toDate()
    while (currentDate <= endDate) {
        let endWeekDate = addDays.call(currentDate, NUMBER.SIX);
        if (moment(endWeekDate).toDate() > endDate) {
            endWeekDate = endDate
    };
        const weekName = moment(currentDate).format('MM/DD')+' ~ ' + moment(endWeekDate).format('MM/DD');
        dates.push({weekName:weekName,begin: convertDateToString(currentDate), end: convertDateToString(endWeekDate)});
      currentDate = addDays.call(currentDate, NUMBER.SEVEN);
     }
return dates;
};

export const getMonday = (d) => {
    d = moment(d).toDate();
    var day = d.getDay(),
    diff = d.getDate() - day + ((day === NUMBER.ZERO || day === '0') ? -NUMBER.SIX : NUMBER.ONE); // adjust when day is sunday
    return convertDateToString(moment(d.setDate(diff)).toDate());
};

export const getPreviousDay = (d) => {
    d = moment(d).toDate();
    d.setDate(d.getDate() - NUMBER.ONE);
    return convertDateToString(d)
};

export const getAllSemiMonthlyWorkedPeriod =(start,end) => {
    let workedStartDate = getMonday(start);
    let work_end_date= getMonday(end);
    work_end_date = getPreviousDay(work_end_date);
    return getAllWeeks(workedStartDate,work_end_date);
};
