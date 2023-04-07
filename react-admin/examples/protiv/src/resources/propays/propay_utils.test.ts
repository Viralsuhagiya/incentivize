import { NUMBER } from '../../utils/Constants/MagicNumber';
import {hasNewProPayUsers, getCommaSeperatedStringFromArray, getDayAvgAmt, getAvgWage} from './propay_utils';

describe('propay_utils', () => {
    describe('prepareChangeset', () => {
        it('not enabled any propay users', () => {
            const previous = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':false},{'id':2,'name':'emp2','is_propay_user':false}]}
            const data = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':false},{'id':2,'name':'emp2','is_propay_user':false}]};
            const changeSet = hasNewProPayUsers(previous, data);
            expect(changeSet).toEqual([]);
        });
        it('removed user', () => {
            const previous = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':false},{'id':2,'name':'emp2','is_propay_user':false}]}
            const data = {'id':1, 'selected_employee_ids_obj':[{'id':2,'name':'emp2','is_propay_user':false}]};
            const changeSet = hasNewProPayUsers(previous, data);
            expect(changeSet).toEqual([]);
        });
        it('add new user and enable', () => {
            const previous = {'id':1, 'selected_employee_ids_obj':[]}
            const data = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':true},{'id':2,'name':'emp2','is_propay_user':true}]};
            const changeSet = hasNewProPayUsers(previous, data);
            expect(changeSet).toEqual(['emp1','emp2']);
        });
        it('add new all user and enable', () => {
            const previous = {'id':1, 'selected_employee_ids_obj':[]}
            const data = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':true},{'id':2,'name':'emp2','is_propay_user':false}]};
            const changeSet = hasNewProPayUsers(previous, data);
            expect(changeSet).toEqual(['emp1']);
        });
        it('enable all propay users', () => {
            const previous = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':false},{'id':2,'name':'emp2','is_propay_user':false}]}
            const data = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':true},{'id':2,'name':'emp2','is_propay_user':true}]};
            const changeSet = hasNewProPayUsers(previous, data);
            expect(changeSet).toEqual(['emp1','emp2']);
        });
        it('one already enabled and one new enabled', () => {
            const previous = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':true},{'id':2,'name':'emp2','is_propay_user':false}]}
            const data = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':true},{'id':2,'name':'emp2','is_propay_user':true}]};
            const changeSet = hasNewProPayUsers(previous, data);
            expect(changeSet).toEqual(['emp2']);
        });
        it('one already enabled and one new enabled - change order', () => {
            const previous = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':false},{'id':2,'name':'emp2','is_propay_user':true}]}
            const data = {'id':1, 'selected_employee_ids_obj':[{'id':1,'name':'emp1','is_propay_user':true},{'id':2,'name':'emp2','is_propay_user':true}]};
            const changeSet = hasNewProPayUsers(previous, data);
            expect(changeSet).toEqual(['emp1']);
        });

        it('get comma seperated string from array of length one', () => {
            const arrData = ['Test_Mobile_Number'];
            const changeSet = getCommaSeperatedStringFromArray(arrData);
            expect(changeSet).toEqual('test mobile number');
        });

        it('get comma seperated string from array of length two ', () => {
            const arrData = ['Test_Name' ,'Test_Mobile_Number'];
            const changeSet = getCommaSeperatedStringFromArray(arrData);
            expect(changeSet).toEqual('test name and test mobile number');
        });

        it('get comma seperated string from array length three', () => {
            const arrData = ['Name','Mobile_Number_No', 'Test_Address'];
            const changeSet = getCommaSeperatedStringFromArray(arrData);
            expect(changeSet).toEqual('name, mobile number no and test address');
        });
    });
    describe('Validate Average Wage', () => {
        it('retun zero when one of value is zero', () => {
            const changeSet = getDayAvgAmt(NUMBER.EIGHT, 0);
            expect(changeSet).toEqual(0);
            const changeSet2 = getDayAvgAmt(0, NUMBER.EIGHT);
            expect(changeSet2).toEqual(0);
        });
        it('retun value for both having values', () => {
            const changeSet = getDayAvgAmt(NUMBER.EIGHT, NUMBER.EIGHT);
            expect(changeSet).toEqual(NUMBER.SIXTEYFOUR);
        });
        it('retun Avg base wage with empty list', () => {
            const avg_wage = getAvgWage([]);
            expect(avg_wage).toEqual(0);
        });
        it('retun Avg base wage when both employee have no base wage ', () => {
            const employee_wage_ids =[{'id':1,'base_wage':0},{'id':NUMBER.TWO,'base_wage':0}]
            const avg_wage = getAvgWage(employee_wage_ids);
            expect(avg_wage).toEqual(0);
        });
        it('retun Avg base wage with one of employee having base wage ', () => {
            const employee_wage_ids =[{'id':1,'base_wage':NUMBER.TEN},{'id':NUMBER.TWO,'base_wage':0}]
            const avg_wage = getAvgWage(employee_wage_ids);
            expect(avg_wage).toEqual(NUMBER.TEN);
        });
        it('retun Avg base wage when both having base wage ', () => {
            const employee_wage_ids =[{'id':1,'base_wage':NUMBER.TEN},{'id':NUMBER.TWO,'base_wage':NUMBER.TWENTY}]
            const avg_wage = getAvgWage(employee_wage_ids);
            expect(avg_wage).toEqual(NUMBER.FIFTEEN);
        });
        
        
    });
});
