import { usePermissions } from './usePermissions';
import { canAccess } from './canAccess';

/**
 * Checks if the user can access a resource.
 *
 * `useCanAccess` returns an object describing the state of the RBAC request.
 * As calls to the `authProvider` are asynchronous, the hook returns
 * a `loading` state in addition to the `canAccess` key.
 *
 * @example
 * import { useCanAccess } from '@react-admin/ra-rbac';
 *
 * const DeleteUserButton = ({ record }) => {
 *     const { loading, canAccess } = useCanAccess({ action: 'delete', resource: 'users', record });
 *     if (loading || !canAccess) return null;
 *     return <DeleteButton record={record} resource="users" />;
 * };
 */
export const useCanAccess = ({
    action,
    resource,
    record,
}: UseCanAccessParams) => {
    const { permissions, loaded } = usePermissions();
    return loaded
        ? {
              canAccess: canAccess({ permissions, action, resource, record }),
              loaded: true,
              loading: false,
          }
        : { canAccess: false, loaded: false, loading: true };
};

export interface UseCanAccessParams {
    action: string;
    resource: string;
    record?: any;
}
