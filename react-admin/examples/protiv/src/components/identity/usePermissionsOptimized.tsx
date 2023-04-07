import { useEffect } from 'react';
import { useSafeSetState } from 'react-admin';
import { Permission } from '../../ra-rbac';
import { useIdentityContext } from './IdentityContext';
import _ from 'lodash';
export const usePermissionsOptimized = ():{permissions: Permission[]} => {
    const identity  = useIdentityContext()
    const [permissions, setPermissions] = useSafeSetState<Permission[]>();
    useEffect(()=>{
        if(!identity){
            return null;
        };
        const raPermissions = {
            permissions: identity?.permissions ||[],
            roles: identity?.roles||[]
        };
        const permissionsFromRoles = _.reduce(raPermissions.roles, (acc, role)=>acc.concat(role), []);
        setPermissions(
            raPermissions.permissions
                ? [
                        ...permissionsFromRoles,
                        ...raPermissions.permissions,
                    ]
                : permissionsFromRoles
        );
    },[identity]) // eslint-disable-line react-hooks/exhaustive-deps
    //we dont want to call it based on state change again because we needs to have the old state as it is to be able to compare
    return {
        permissions: permissions || []
    };
};
