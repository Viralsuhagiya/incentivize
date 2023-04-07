import { canAccess } from './canAccess';

describe('canAccess', () => {
    it('should return false if the user has no permissions', () => {
        expect(
            canAccess({ permissions: [], resource: 'foo', action: 'bar' })
        ).toBe(false);
    });
    it('should return false if at least one permission denies access', () => {
        expect(
            canAccess({
                permissions: [
                    { resource: 'posts', action: 'read' },
                    { resource: 'posts', action: ['write', 'delete'] },
                    { type: 'deny', resource: 'posts', action: 'write' },
                ],
                resource: 'posts',
                action: 'write',
            })
        ).toBe(false);
    });
    it('should return false if the user has permissions only on other resources', () => {
        expect(
            canAccess({
                permissions: [
                    { resource: 'foo1', action: 'bar' },
                    { resource: 'foo2', action: 'bar' },
                ],
                resource: 'foo3',
                action: 'bar',
            })
        ).toBe(false);
    });
    it('should return false if the user has the right resource but not the right action permission', () => {
        expect(
            canAccess({
                permissions: [{ resource: 'foo', action: 'baz' }],
                resource: 'foo',
                action: 'bar',
            })
        ).toBe(false);
        expect(
            canAccess({
                permissions: [{ resource: 'foo', action: ['baz'] }],
                resource: 'foo',
                action: 'bar',
            })
        ).toBe(false);
    });
    it('should return false if the user only has access to certain records and no record is passed', () => {
        expect(
            canAccess({
                permissions: [
                    {
                        resource: 'posts',
                        action: 'read',
                        record: { id: 1 },
                    },
                ],
                resource: 'posts',
                action: 'read',
            })
        ).toBe(false);
    });
    it('should return false if the user only has access to certain records and another record is passed', () => {
        expect(
            canAccess({
                permissions: [
                    {
                        resource: 'posts',
                        action: 'read',
                        record: { id: 1 },
                    },
                ],
                resource: 'posts',
                action: 'read',
                record: { id: '2', title: 'where am I?' },
            })
        ).toBe(false);
    });

    describe('allow permissions', () => {
        it('should return true if the user has wildcard permissions', () => {
            expect(
                canAccess({
                    permissions: [{ resource: '*', action: '*' }],
                    resource: 'foo',
                    action: 'bar',
                })
            ).toBe(true);
        });
        it('should return true if the user has the right resource and action permission', () => {
            expect(
                canAccess({
                    permissions: [{ resource: 'foo', action: 'read' }],
                    resource: 'foo',
                    action: 'read',
                })
            ).toBe(true);
        });
        it('should return true if the user has the right resource path and action permission', () => {
            expect(
                canAccess({
                    permissions: [{ resource: 'foo.bar', action: 'read' }],
                    resource: 'foo.bar',
                    action: 'read',
                })
            ).toBe(true);
        });
        it('should return true if the user has the right resource wildcard and action permission', () => {
            expect(
                canAccess({
                    permissions: [{ resource: 'foo.*', action: 'read' }],
                    resource: 'foo.bar',
                    action: 'read',
                })
            ).toBe(true);
        });
        it('should return true if the user has the wildcard resource and the right action permission', () => {
            expect(
                canAccess({
                    permissions: [{ resource: '*', action: 'bar' }],
                    resource: 'foo',
                    action: 'bar',
                })
            ).toBe(true);
        });
        it('should return true if the user has the right action for the right resource', () => {
            expect(
                canAccess({
                    permissions: [{ resource: 'foo', action: ['bar', 'baz'] }],
                    resource: 'foo',
                    action: 'bar',
                })
            ).toBe(true);
        });
        it('should return true if the user has the wildcard action for the right resource', () => {
            expect(
                canAccess({
                    permissions: [{ resource: 'foo', action: '*' }],
                    resource: 'foo',
                    action: 'bar',
                })
            ).toBe(true);
        });
        it('should return true if at least one permission grants access', () => {
            expect(
                canAccess({
                    permissions: [
                        { resource: 'posts', action: 'read' },
                        { resource: 'posts', action: ['write', 'delete'] },
                    ],
                    resource: 'posts',
                    action: 'write',
                })
            ).toBe(true);
        });
        it('should return true if the user has access to all records', () => {
            expect(
                canAccess({
                    permissions: [{ resource: 'posts', action: 'read' }],
                    resource: 'posts',
                    action: 'read',
                    record: { id: '1', title: 'hello, world' },
                })
            ).toBe(true);
        });
        it('should return true if the user has access to the right record', () => {
            expect(
                canAccess({
                    permissions: [
                        {
                            resource: 'posts',
                            action: 'read',
                            record: { id: 1 },
                        },
                    ],
                    resource: 'posts',
                    action: 'read',
                    record: { id: 1, title: 'hello, world' },
                })
            ).toBe(true);
        });
    });

    describe('deny permissions', () => {
        it('should return false if the user has wildcard deny permissions', () => {
            expect(
                canAccess({
                    permissions: [{ type: 'deny', resource: '*', action: '*' }],
                    resource: 'foo',
                    action: 'bar',
                })
            ).toBe(false);
        });
        it('should return false if the user has the right resource and action deny permission', () => {
            expect(
                canAccess({
                    permissions: [
                        { type: 'deny', resource: 'foo', action: 'read' },
                    ],
                    resource: 'foo',
                    action: 'read',
                })
            ).toBe(false);
        });
        it('should return false if the user has the right resource path and action deny permission', () => {
            expect(
                canAccess({
                    permissions: [
                        { type: 'deny', resource: 'foo.bar', action: 'read' },
                    ],
                    resource: 'foo.bar',
                    action: 'read',
                })
            ).toBe(false);
        });
        it('should return false if the user has the right resource wildcard and action deny permission', () => {
            expect(
                canAccess({
                    permissions: [
                        { type: 'deny', resource: 'foo.*', action: 'read' },
                    ],
                    resource: 'foo.bar',
                    action: 'read',
                })
            ).toBe(false);
        });
        it('should return false if the user has the wildcard resource and the right action deny permission', () => {
            expect(
                canAccess({
                    permissions: [
                        { type: 'deny', resource: '*', action: 'bar' },
                    ],
                    resource: 'foo',
                    action: 'bar',
                })
            ).toBe(false);
        });
        it('should return false if the user has the right action for the right resource deny permission', () => {
            expect(
                canAccess({
                    permissions: [
                        {
                            type: 'deny',
                            resource: 'foo',
                            action: ['bar', 'baz'],
                        },
                    ],
                    resource: 'foo',
                    action: 'bar',
                })
            ).toBe(false);
        });
        it('should return false if the user has the wildcard action for the right resource in deny permission', () => {
            expect(
                canAccess({
                    permissions: [
                        { type: 'deny', resource: 'foo', action: '*' },
                    ],
                    resource: 'foo',
                    action: 'bar',
                })
            ).toBe(false);
        });
        it('should return false if the user has denied access to all records', () => {
            expect(
                canAccess({
                    permissions: [
                        { type: 'deny', resource: 'posts', action: 'read' },
                    ],
                    resource: 'posts',
                    action: 'read',
                    record: { id: '1', title: 'hello, world' },
                })
            ).toBe(false);
        });
        it('should return false if the user has denied access to the right record', () => {
            expect(
                canAccess({
                    permissions: [
                        {
                            type: 'deny',
                            resource: 'posts',
                            action: 'read',
                            record: { id: 1 },
                        },
                    ],
                    resource: 'posts',
                    action: 'read',
                    record: { id: 1, title: 'hello, world' },
                })
            ).toBe(false);
        });
    });
});
