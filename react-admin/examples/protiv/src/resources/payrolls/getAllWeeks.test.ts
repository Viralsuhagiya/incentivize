import { getAllWeeks, getWeekNumber,getAllSemiMonthlyWorkedPeriod,getMonday,getPreviousDay } from './getAllWeeks';

describe('testPrepareWeeks', () => {
    describe('getAllWeeks', () => {
        it('return single weeks between two dates', () => {
            const changeSet = getAllWeeks('2022-08-29', '2022-09-04');
            expect(changeSet).toEqual([
                {weekName:'08/29 ~ 09/04',begin: '2022-08-29', end: '2022-09-04'}
                ]);
        });  
        it('return two weeks between two dates', () => {
            const changeSet = getAllWeeks('2022-08-29', '2022-09-11');
            expect(changeSet).toEqual([
                {weekName:'08/29 ~ 09/04',begin: '2022-08-29', end: '2022-09-04'},
                {weekName:'09/05 ~ 09/11',begin: '2022-09-05', end: '2022-09-11'}
                ]);
        });
        it('return three weeks between two dates', () => {
            const changeSet = getAllWeeks('2022-09-07', '2022-09-27');
            expect(changeSet).toEqual([
                {weekName:'09/07 ~ 09/13',begin: '2022-09-07', end: '2022-09-13'},
                {weekName:'09/14 ~ 09/20',begin: '2022-09-14', end: '2022-09-20'},
                {weekName:'09/21 ~ 09/27',begin: '2022-09-21', end: '2022-09-27'},
                ]);
        }); 
        it('return three weeks between two dates', () => {
            const changeSet = getAllWeeks('2021-12-16', '2021-12-31');
            expect(changeSet).toEqual([
                {weekName:'12/16 ~ 12/22',begin: '2021-12-16', end: '2021-12-22'},
                {weekName:'12/23 ~ 12/29',begin: '2021-12-23', end: '2021-12-29'},
                {weekName:'12/30 ~ 12/31',begin: '2021-12-30', end: '2021-12-31'},
                ]);
        });  
        it('return february weeks', () => {
            const changeSet = getAllWeeks('2022-02-16', '2022-02-28');
            expect(changeSet).toEqual([
                {weekName:'02/16 ~ 02/22',begin: '2022-02-16', end: '2022-02-22'},
                {weekName:'02/23 ~ 02/28',begin: '2022-02-23', end: '2022-02-28'}
                ]);
        });  
    });
    describe('getWeekNumber', () => {
        it('return week2', () => {
            const allWeeks = getAllWeeks('2022-08-29', '2022-09-11');
            const weekName = getWeekNumber('2022-09-10',allWeeks)
            expect(weekName).toEqual('09/05 ~ 09/11');
        });   
        it('return week 1', () => {
            const allWeeks = getAllWeeks('2022-08-29', '2022-09-11');
            const weekName = getWeekNumber('2022-08-30',allWeeks)
            expect(weekName).toEqual('08/29 ~ 09/04');
        });  
        it('return null if weeknumber not found', () => {
            const allWeeks = getAllWeeks('2022-08-29', '2022-09-11');
            const weekName = getWeekNumber('2022-08-28',allWeeks)
            expect(weekName).toEqual(null);
        }); 
    });
    describe('test-validate-semi-monthly-weekks', () => {
        it('returns monday from of the selected date', () => {
            let monday = getMonday('2022-08-15')
            expect(monday).toEqual('2022-08-15');
            monday = getMonday('2022-08-16');
            expect(monday).toEqual('2022-08-15');
            monday = getMonday('2022-08-17');
            expect(monday).toEqual('2022-08-15');
            monday = getMonday('2022-08-18');
            expect(monday).toEqual('2022-08-15');
            monday = getMonday('2022-08-19');
            expect(monday).toEqual('2022-08-15');
            monday = getMonday('2022-08-20');
            expect(monday).toEqual('2022-08-15');
            monday = getMonday('2022-08-21');
            expect(monday).toEqual('2022-08-15');
            monday = getMonday('2022-08-22');
            expect(monday).toEqual('2022-08-22');
        });
        it('returns previous day', () => {
            const previousDay = getPreviousDay('2022-02-28');
            expect(previousDay).toEqual('2022-02-27');
    
        });

        it('return two between two dates', () => {
            const changeSet = getAllWeeks('2022-02-14', '2022-02-27');
            expect(changeSet).toEqual([
                {'begin': '2022-02-14', 'end': '2022-02-20', 'weekName': '02/14 ~ 02/20'}, 
                {'begin': '2022-02-21', 'end': '2022-02-27', 'weekName': '02/21 ~ 02/27'}
            ]);
        }); 

        it('returns all worked weeks from semi-monthly period', () => {
            const allWeeks = getAllSemiMonthlyWorkedPeriod('2022-02-16','2022-02-28')
            expect(allWeeks).toEqual([
                {'begin': '2022-02-14', 'end': '2022-02-20', 'weekName': '02/14 ~ 02/20'}, 
                {'begin': '2022-02-21', 'end': '2022-02-27', 'weekName': '02/21 ~ 02/27'}
            ]);
        });

        it('returns the periods for semi-monthly', () => {
            const changeSet1 = getAllSemiMonthlyWorkedPeriod('2021-12-16','2021-12-31')
            expect(changeSet1).toEqual([
                {weekName:'12/13 ~ 12/19', begin: '2021-12-13', end: '2021-12-19' },
                {weekName:'12/20 ~ 12/26', begin: '2021-12-20', end: '2021-12-26' }
            ]);
            const changeSet2 = getAllSemiMonthlyWorkedPeriod('2022-01-01','2022-01-15')
            expect(changeSet2).toEqual([
                {weekName:'12/27 ~ 01/02', begin: '2021-12-27', end: '2022-01-02' },
                {weekName:'01/03 ~ 01/09', begin: '2022-01-03', end: '2022-01-09' }
            ]);
        });

        it('returns the periods for semi-monthly12', () => {
            const changeSet1 = getAllSemiMonthlyWorkedPeriod('2022-08-16','2022-08-31')
            expect(changeSet1).toEqual([
                {weekName:'08/15 ~ 08/21', begin: '2022-08-15', end: '2022-08-21' },
                {weekName:'08/22 ~ 08/28', begin: '2022-08-22', end: '2022-08-28' }
            ]);
            const changeSet2 = getAllSemiMonthlyWorkedPeriod('2022-09-01','2022-09-15')
            expect(changeSet2).toEqual([
                {weekName:'08/29 ~ 09/04', begin: '2022-08-29', end: '2022-09-04' },
                {weekName:'09/05 ~ 09/11', begin: '2022-09-05', end: '2022-09-11' }
            ]);
        });

    });  
});
