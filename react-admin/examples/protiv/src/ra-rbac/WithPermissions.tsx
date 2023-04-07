import * as React from 'react';
import { useCanAccess } from './useCanAccess';

/**
 * Render the child only if the user has the specified permissions.
 *
 * It accepts the following props:
 *
 * - `action` (string, required): the action to check, e.g. 'read', 'list', 'export', 'delete', etc.
 * - `resource` (string required): the resource to check, e.g. 'users', 'comments', 'posts', etc.
 * - `record` (object, optional): the record to check. If passed, the child only renders if the user has permissions for that record, e.g. `{ id: 123, firstName: "John", lastName: "Doe" }`
 *
 * Additional props are passed down to the child element.
 *
 * @example
 * import { WithPermissions } from '@react-admin/ra-rbac';
 *
 * const RecordToolbar = ({ resource }) => (
 *     <Toolbar>
 *         <WithPermissions action="edit" resource={resource}>
 *             <EditButton />
 *         </WithPermissions>
 *         <WithPermissions action="show" resource={resource}>
 *             <ShowButton />
 *         </WithPermissions>
 *         <WithPermissions action="delete" resource={resource}>
 *             <DeleteButton />
 *         </WithPermissions>
 *     </Toolbar>
 * );
 */
export const WithPermissions = ({
    action,
    resource,
    record,
    children,
    ...props
}: WithPermissionsProps) => {
    const { canAccess, loading } = useCanAccess({ action, resource, record });
    return loading || !canAccess ? null : (
        <>
            {React.isValidElement(children)
                ? React.cloneElement(children, props)
                : children}
        </>
    );
};

export interface WithPermissionsProps {
    resource: string;
    action: string;
    record?: any;
    children: React.ReactNode;
    [key: string]: any;
}
