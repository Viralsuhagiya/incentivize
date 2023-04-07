import { NUMBER } from '../../utils/Constants/MagicNumber';
import { getHours } from './getHours';

describe('Attendance', () => {
    describe('getHours', () => {
        it('if attendance without checkin and checkout ', () => {
            const {hours} = getHours({'id':'6736'});
            expect(hours).toEqual(0);
        });
        it('if attendance without checkin,checkout and with hours', () => {
            const {hours} = getHours({'id':'6736','hours':5});
            expect(hours).toEqual(NUMBER.FIVE);
        });
        it('if attendance with hours without checkin and checkout', () => {
            const {hours} = getHours({'id':'6736','start':false,'end':false,'hours':NUMBER.FIVE});
            expect(hours).toEqual(NUMBER.FIVE);
        });
        it('if attendance with checkin and without checkout and with hours', () => {
            const {hours} = getHours({'id':'6736','start':'2022-12-30 12:58:00','end':false,'hours':NUMBER.FIVE});
            expect(hours).toEqual(NUMBER.FIVE);
        });
        it('if attendance with checkout and hours without checkin', () => {
            const {hours} = getHours({'id':'6736','start':false,'end':'2022-12-30 12:58:00','hours':NUMBER.FIVE});
            expect(hours).toEqual(NUMBER.FIVE);
        });
        it('if attendance with checkin and without checkout and hours', () => {
            const {hours} = getHours({'id':'6736','start':'2022-12-30 12:58:00','end':false,'hours':0});
            expect(hours).toEqual(0);
        });
        it('if attendance with checkin and checkout without hours', () => {
            const {hours} = getHours({'id':'6736','start':'2022-12-30 10:00:00','end':'2022-12-30 11:00:00','hours':0});
            expect(hours).toEqual(1);
        });
        it('if attendance with checkin,checkout and hours', () => {
            const {hours} = getHours({'id':'6736','start':'2022-12-30 10:00:00','end':'2022-12-30 11:00:00','hours':NUMBER.FIVE});
            expect(hours).toEqual(1);
        });
    })
});
