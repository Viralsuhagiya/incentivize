import { NUMBER } from '../utils/Constants/MagicNumber';
import getDays, { getRemainingHours, getDaysAndHours, getMaxHours } from './Calculator';

describe('Calculator Testing', () => {
    describe('getDay Testing', () => {
        test('When hours less than 8 hours', () => {
            expect(getDays(NUMBER.SEVEN,NUMBER.EIGHT)).toEqual(0);
        });

        test('When hours eqqual to 8 hours', () => {
            expect(getDays(NUMBER.EIGHT,NUMBER.EIGHT)).toEqual(1);
        });

        test('When hours are in float and more than 8 ', () => {
            expect(getDays(NUMBER.EIGHT_POINT_FIVE,NUMBER.EIGHT)).toEqual(1);
        });

        test('Validate remaining hours when hours are less than 8 ', () => {
            expect(getRemainingHours(NUMBER.SEVEN,NUMBER.EIGHT)).toEqual(NUMBER.SEVEN);
        });

        test('Validate remaining hours when hours equal to 8  ', () => {
            expect(getRemainingHours(NUMBER.EIGHT,NUMBER.EIGHT)).toEqual(0);
        });

        test('Validate remaining hours when hours larger than 8 hours', () => {
            expect(getRemainingHours(NUMBER.NINE,NUMBER.EIGHT)).toEqual(1);
        });

        test('Validate days and remaining hours', () => {
            expect(getDays(NUMBER.NINETY_NINE,NUMBER.EIGHT)).toEqual(NUMBER.TWELVE);
            expect(getRemainingHours(NUMBER.NINETY_NINE,NUMBER.EIGHT)).toEqual(NUMBER.THREE);
        });

        test('Validate format when days and hours are zero', () => {
            expect(getDaysAndHours(NUMBER.ZERO,NUMBER.EIGHT)).toEqual('No Hours');
        });

        test('Validate format when there is hours only', () => {
            expect(getDaysAndHours(NUMBER.SIX,NUMBER.EIGHT)).toEqual('6 Hours ');
        });

        test('Validate format when there is days only', () => {
            expect(getDaysAndHours(NUMBER.EIGHT,NUMBER.EIGHT)).toEqual('1 Days');
        });

        test('Validate format when there is days and hours', () => {
            expect(getDaysAndHours(NUMBER.THIRTEEN,NUMBER.EIGHT)).toEqual('1 Days 5 Hours');
        });

        test('Validate format when there is days and hours with 12', () => {
            expect(getDaysAndHours(NUMBER.ELEVENT,NUMBER.TWELVE)).toEqual('11 Hours ');
        });

        test('Validate format when there is days and hours with 12', () => {
            expect(getDaysAndHours(NUMBER.THIRTEEN,NUMBER.TWELVE)).toEqual('1 Days 1 Hours');
        });

        test('Validate format days and remaining hours when hours is less than zero', () => {
            expect(getDaysAndHours(NUMBER.NEGATIVE_ONE,NUMBER.EIGHT)).toEqual('');
        });
    });

    describe('Get Maximum Hours Testing', () => {

        test('When PPAmount,AvgHours,PPEarning,WorkedHours are zero', () => {
            expect(getMaxHours(0,0,0,0)).toBe(0)
        });

        test('When PPAmount,AvgHours has non zero value,,WorkedHours are zero', () => {
            expect(getMaxHours(NUMBER.HUNDRED,NUMBER.ZERO,NUMBER.TEN,NUMBER.ZERO)).toBe(NUMBER.TEN)
        });

        test('When AvgHours has non zero value,PPAmount,WorkedHours are zero', () => {
            expect(getMaxHours(0,0,NUMBER.TEN,0)).toBe(0)
        });

        test('When PPAmount,PPEarning has non zero value,AvgHours,WorkedHours are zero', () => {
            expect(getMaxHours(NUMBER.HUNDRED,0,0,0)).toBe(0)
        });

        test('When PPAmount,AvgHours,PPEarning,WorkedHours has non zero value', () => {
            expect(getMaxHours(NUMBER.THREE_HUNDRED,NUMBER.HUNDRED_FIFTY,NUMBER.TEN,NUMBER.TEN)).toBe(NUMBER.TWENTY_FIVE)
        });

        test('When PPAmount,PPEarning,WorkedHours has non zero value, AvgHours is zero', () => {
            expect(getMaxHours(NUMBER.THREE_HUNDRED,NUMBER.HUNDRED_FIFTY,0,NUMBER.TEN)).toBe(0)
        });

        test('When AvgHours,PPEarning,WorkedHours has non zero value, PPAmount, is zero', () => {
            expect(getMaxHours(0,NUMBER.HUNDRED_FIFTY,NUMBER.TEN,NUMBER.TEN)).toBe(NUMBER.NEGATIVE_FIVE)
        });

        test('When PPAmount has non zero value and AvgHours,PPEarning,WorkedHours are zero', () => {
            expect(getMaxHours(NUMBER.HUNDRED,0,0,0)).toBe(0)
        });

        test('When PPAmount,AvgHours has non zero value and PPEarning,WorkedHours are zero', () => {
            expect(getMaxHours(NUMBER.HUNDRED,0,NUMBER.TEN,0)).toBe(NUMBER.TEN)
        });

        test('When PPAmount,AvgHours,PPEarning has non zero value WorkedHours are zero', () => {
            expect(getMaxHours(NUMBER.HUNDRED,NUMBER.TEN,NUMBER.TEN,0)).toBe(NUMBER.TEN)
        });

        test('When PPAmount is smaller than PPEarning,with worked hours', () => {
            expect(getMaxHours(NUMBER.HUNDRED,NUMBER.HUNDRED_FIFTY,NUMBER.TEN,NUMBER.TEN)).toBe(NUMBER.FIVE)
        });

        test('When PPAmount is smaller than PPEarning,without worked hours', () => {
            expect(getMaxHours(NUMBER.HUNDRED,0,NUMBER.TEN,0)).toBe(NUMBER.TEN)
        });

    });
});
