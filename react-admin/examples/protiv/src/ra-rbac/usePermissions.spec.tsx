import * as React from 'react';
import { render, act } from '@testing-library/react';
import { AuthContext } from 'react-admin';

import { usePermissions } from './usePermissions';

const UsePermissions = () => {
    const { loaded, permissions } = usePermissions();
    return loaded ? (
        <div>{JSON.stringify(permissions)}</div>
    ) : (
        <div>loading</div>
    );
};

describe('usePermissions', () => {
    it('should return an empty array when there is no AuthContext', async () => {
        const { queryByText } = render(<UsePermissions />);
        expect(queryByText('loading')).not.toBeNull();
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
        expect(queryByText('loading')).toBeNull();
        expect(queryByText('[]')).not.toBeNull();
    });
    it('should return permissions from the authProvider', async () => {
        let resolveGetPermissions;
        const { queryByText } = render(
            <AuthContext.Provider
                value={{
                    ...baseAuthProvider,
                    getPermissions: () =>
                        new Promise(resolve => {
                            resolveGetPermissions = resolve;
                        }),
                }}
            >
                <UsePermissions />
            </AuthContext.Provider>
        );
        expect(queryByText('loading')).not.toBeNull();
        await act(async () => {
            resolveGetPermissions({
                permissions: [
                    { action: 'read', resource: 'posts' },
                    {
                        action: ['read', 'write'],
                        resource: 'comments',
                    },
                ],
            });
        });
        expect(queryByText('loading')).toBeNull();
        expect(
            queryByText(
                '[{"action":"read","resource":"posts"},{"action":["read","write"],"resource":"comments"}]'
            )
        ).not.toBeNull();
    });
    it('should accept empty roles', async () => {
        let resolveGetPermissions;
        const { queryByText } = render(
            <AuthContext.Provider
                value={{
                    ...baseAuthProvider,
                    getPermissions: () =>
                        new Promise(resolve => {
                            resolveGetPermissions = resolve;
                        }),
                    getRoles: () => Promise.resolve({}),
                }}
            >
                <UsePermissions />
            </AuthContext.Provider>
        );
        expect(queryByText('loading')).not.toBeNull();
        await act(async () => {
            resolveGetPermissions({
                permissions: [{ action: 'read', resource: 'posts' }],
                roles: [],
            });
        });
        expect(queryByText('loading')).toBeNull();
        expect(
            queryByText('[{"action":"read","resource":"posts"}]')
        ).not.toBeNull();
    });
    it('should return permissions based on roles from the authProvider', async () => {
        let resolveGetRoles;
        const { queryByText } = render(
            <AuthContext.Provider
                value={{
                    ...baseAuthProvider,
                    getPermissions: () =>
                        Promise.resolve({ permissions: [], roles: ['foo'] }),
                    getRoles: () =>
                        new Promise(resolve => {
                            resolveGetRoles = resolve;
                        }),
                }}
            >
                <UsePermissions />
            </AuthContext.Provider>
        );
        expect(queryByText('loading')).not.toBeNull();
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0)); // wait for getPermissions to return on next tick
            resolveGetRoles({
                foo: [
                    { action: 'read', resource: 'posts' },
                    {
                        action: ['read', 'write'],
                        resource: 'comments',
                    },
                ],
            });
        });
        expect(queryByText('loading')).toBeNull();
        expect(
            queryByText(
                '[{"action":"read","resource":"posts"},{"action":["read","write"],"resource":"comments"}]'
            )
        ).not.toBeNull();
    });
    it('should return permissions based on both permissions and roles from the authProvider', async () => {
        let resolveGetPermissions;
        let resolveGetRoles;
        const { queryByText } = render(
            <AuthContext.Provider
                value={{
                    ...baseAuthProvider,
                    getPermissions: () =>
                        new Promise(resolve => {
                            resolveGetPermissions = resolve;
                        }),
                    getRoles: () =>
                        new Promise(resolve => {
                            resolveGetRoles = resolve;
                        }),
                }}
            >
                <UsePermissions />
            </AuthContext.Provider>
        );
        expect(queryByText('loading')).not.toBeNull();
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            resolveGetPermissions({
                permissions: [
                    {
                        action: ['read', 'edit', 'create', 'delete'],
                        resource: 'users',
                    },
                ],
                roles: ['foo'],
            });
            await new Promise(resolve => setTimeout(resolve, 0));
            resolveGetRoles({
                foo: [
                    {
                        action: 'read',
                        resource: 'posts',
                    },
                    {
                        action: ['read', 'write'],
                        resource: 'comments',
                    },
                ],
            });
        });
        expect(queryByText('loading')).toBeNull();
        expect(
            queryByText(
                '[{"action":"read","resource":"posts"},{"action":["read","write"],"resource":"comments"},{"action":["read","edit","create","delete"],"resource":"users"}]'
            )
        ).not.toBeNull();
    });
});

const baseAuthProvider = {
    checkAuth: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
    getRoles: () => Promise.resolve(),
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
};
