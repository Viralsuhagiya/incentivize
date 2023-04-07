import { formatUsername}  from './FormatUsername';

describe('AwsLogin', () => {
    describe('formatUsername', () => {   
        it('username', () => {
            expect(formatUsername("admin")).toEqual("admin");
        });
        it('username trim', () => {
            expect(formatUsername("    admin   ")).toEqual("admin");
        });
        it('email', () => {
            expect(formatUsername("test@example.com")).toEqual("test@example.com");
        });
        it('email trim', () => {
            expect(formatUsername("  test@example.com  ")).toEqual("test@example.com");
        });
        it('phone with dial code', () => {
            expect(formatUsername("+11234567890")).toEqual("+11234567890");
        });
        it('phone with dial code trim', () => {
            expect(formatUsername(" +11234567890 ")).toEqual("+11234567890");
        });
        it('phone with special characters trim', () => {
            expect(formatUsername(" + 1 123-456-(7890) ")).toEqual("+11234567890");
        });
        it('phone without dial code', () => {
            expect(formatUsername(" 123-456-(7890) ")).toEqual("+11234567890");
        });
        it('phone without dial code with local IN', () => {
            expect(formatUsername(" 123-456-(7890) ",{locale:'en-IN'})).toEqual("+911234567890");
        });
        it('phone without dial code with local us', () => {
            expect(formatUsername(" 123-456-(7890) ",{locale:'en-us'})).toEqual("+11234567890");
        });
        it('phone without dial code with local in', () => {
            expect(formatUsername(" 123-456-(7890) ",{locale:'en-in'})).toEqual("+911234567890");
        });
        it('phone without dial code with invalid local', () => {
            expect(formatUsername(" 123-456-(7890) ",{locale:'invalid'})).toEqual("+11234567890");
        });
    })
    
})
