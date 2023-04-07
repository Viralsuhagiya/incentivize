import { hidePropayDetailReport } from "./hidePropayDetailReport";

describe('hidePropayDetailReport', () => {
    it('return true for worker with showpage false', () => {
        expect(hidePropayDetailReport('worker',false)).toEqual(true);
    });
    it('return true for worker with show page true', () => {
        expect(hidePropayDetailReport('worker',true)).toEqual(true);
    });
    it('return true for supervisor with showpage false', () => {
        expect(hidePropayDetailReport('supervisor',false)).toEqual(true);
    });
    it('return true for supervisor with showpage true', () => {
        expect(hidePropayDetailReport('supervisor',true)).toEqual(false);
    });
});
