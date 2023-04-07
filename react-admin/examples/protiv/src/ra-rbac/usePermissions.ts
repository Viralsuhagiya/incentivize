import { useEffect } from 'react';
import { useAuthProvider, useSafeSetState } from 'react-admin';

import { Permissions, GetPermissionsResult, GetRolesResult } from './types';

/**
 * Get permissions from the authProvider
 *
 * Permissions are undefined on mount, and then set to
 * the merge of the roles and permissions from the authProvider.
 *
 * Use it instead of react-admin's usePermissions.
 *
 * @example
 * const { loaded, permissions } = usePermissions();
 * // {
 * //      loaded: true,
 * //      permissions: [
 * //          { "action": ["read"], "resource": "correctors" },
 * //          { "action": ["write"], "resource": "correctors", "record": { "id": "123" } },
 * //      ],
 * // };
 */
export const usePermissions = () => {
    const authProvider = useAuthProvider();
    const [permissions, setPermissions] = useSafeSetState<Permissions>();
    const [loaded, setLoaded] = useSafeSetState<boolean>(false);
    useEffect(() => {
        authProvider
            .getPermissions(emptyParams)
            .then((raPermissions: GetPermissionsResult) => {
                if (raPermissions && raPermissions.roles) {
                    authProvider.getRoles().then((roles: GetRolesResult) => {
                        const userRoles = Object.keys(roles).filter(role =>
                            raPermissions.roles?.includes(role)
                        );
                        const permissionsFromRoles =
                            userRoles.reduce<Permissions>(
                                (acc, role) => acc.concat(roles[role]),
                                []
                            );
                        setPermissions(
                            raPermissions.permissions
                                ? [
                                      ...permissionsFromRoles,
                                      ...raPermissions.permissions,
                                  ]
                                : permissionsFromRoles
                        );
                        setLoaded(true);
                    });
                } else {
                    setPermissions(
                        raPermissions ? raPermissions.permissions : []
                    );
                    setLoaded(true);
                }
            });
    }, [authProvider]); // eslint-disable-line react-hooks/exhaustive-deps
    return {
        permissions,
        loaded,
        loading: !loaded,
    };
};

const emptyParams = {};
