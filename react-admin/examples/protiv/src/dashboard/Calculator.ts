import _ from 'lodash';
import { NUMBER } from '../utils/Constants/MagicNumber';
import { convertNumToTime } from '../utils/formatter'
const getDays = (hours,hours_per_day) => {
    let days = 0;
    if (hours < hours_per_day) {
        days = 0;
    } else {
        days = Math.floor(hours / hours_per_day);
    }
    return days;
};

export const getRemainingHours = (hours,hours_per_day) => {
    let remaining_hours = 0;
    if (hours < hours_per_day) {
        remaining_hours = Math.floor(hours);
    } else {
        remaining_hours = Math.floor(hours % hours_per_day);
    }
    return remaining_hours;
};

const getRemainingMinutes = (hours) => {
    const totalHours = convertNumToTime(hours).split(':')
    const minute = totalHours[1]
    return minute
}

export const getDaysAndHours = (hours,hours_per_day) => {
    if (hours < 0) {
        return '';
    }
    const days = getDays(hours,hours_per_day);
    const remaining_hours = getRemainingHours(hours,hours_per_day);
    const remaining_minutes = getRemainingMinutes(hours)
    if (days === 0 && remaining_hours === 0 && parseInt(remaining_minutes) === 0) {
        return 'No Hours';
    } else if (days === 0 && remaining_hours !== 0) {
        const minutes = parseInt(remaining_minutes) !== 0 ? remaining_minutes + ' Min.' : '';
        return remaining_hours + ' Hours ' + minutes
    } else if (days !== 0 && remaining_hours === 0) {
        return days + ' Days';
    } else {
        return days + ' Days ' + remaining_hours + ' Hours';
    }
};
export default getDays;


export const getMaxHours = (
    PPAmount: number,
    PPEarning: number,
    AvgHours: number,
    WorkedHours: number,
    BudgetType: string,
    BudgetHours: number,
) => {
    if (BudgetType === 'hours') {
        return BudgetHours
    } else {
        // (If no one worked on the job) Maximum hours = ProPay Amount / Average wage
        if (WorkedHours === 0) {
            return AvgHours > 0 ? _.round(PPAmount/AvgHours, NUMBER.TWO) : 0 ;
        } else {
            // If employees worked on the job) Maximum Hours = ((ProPay Amount - Base Pay)/Average wage) + Total current hours worked 
            return AvgHours > 0
                ? _.round((PPAmount - PPEarning) / AvgHours + WorkedHours, NUMBER.TWO)
                : 0;
        }
    }
};
