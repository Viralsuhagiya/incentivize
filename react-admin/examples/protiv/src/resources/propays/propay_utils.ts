/* eslint-disable eqeqeq */
import { Record } from 'react-admin';
import _ from 'lodash';
import { NUMBER } from '../../utils/Constants/MagicNumber';


export const getAvgWage = (wage_ids:any) => {
    const employee_wage_ids = _.filter(wage_ids, wage => wage.base_wage > 0 );
    const avg_base_wage = _.sumBy(employee_wage_ids, 'base_wage')/_.size(employee_wage_ids);
    return avg_base_wage || 0.0
};

export const getDayAvgAmt = (avg_base_wage,hours_day_ref) => {
    return avg_base_wage*hours_day_ref || 0.0
};

export const hasNewProPayUsers = (previous:Record, data:Record, )=>{
    var notProPayUsers = _.keyBy(previous.selected_employee_ids_obj, 'id');
    var propayUsers = _.chain(data.selected_employee_ids_obj)
        .filter((item) => item.is_propay_user && !_.get(notProPayUsers,item.id,{}).is_propay_user)
        .map('name')
        .value();
    return propayUsers 
};

export const getCommaSeperatedStringFromArray = (data) => {
    data = _.map(data, (item, i: number) => { 
        item = _.replace(item, new RegExp('_', 'g'), ' ').toLowerCase();
        if (data.length > NUMBER.TWO && data.length-1 != i) item = item + ((data.length-NUMBER.TWO == i ) ? ' and' : ',');
        else if (data.length == NUMBER.TWO && i == 0) item = item + ' and'
        return item
    });
    return data.join(' ');
};
