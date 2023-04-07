import * as React from 'react';
import { ReactElement } from 'react';
import {
    BulkDeleteButton,
    BulkExportButton,
    List as RaList,
    ListProps,
    useListContext,
    useResourceContext,
} from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';

import { ListActions } from './ListActions';

/**
 * Replacement for react-admin's List that adds RBAC control to actions and bulk actions
 *
 * Users must have the 'create' permission on the resource to see the CreateButton.
 * Users must have the 'export' permission on the resource to see the ExportButton and the BulkExportButton.
 * Users must have the 'delete' permission on the resource to see the BulkExportButton.
 *
 * @example
 * import { List } from '@react-admin/ra-rbac';
 *
 * const authProvider = {
 *      // ...
 *      getPermissions: () => Promise.resolve({
 *           permissions: [
 *                 { action: 'list', resource: 'products' },
 *                 { action: 'create', resource: 'products' },
 *                 { action: 'delete', resource: 'products' },
 *                 // action 'export' is missing
 *           ],
 *       }),
 * };
 *
 * export const PostList = (props) => (
 *     <List {...props}>
 *         ...
 *     </List>
 * );
 * // user will see the following actions on top of the list:
 * // - create
 * // user will see the following bulk actions upon selection:
 * // - delete
 */
export const List = (props: ListProps & { children: ReactElement }) => {
    const { exporter } = useListContext();
    const resource = useResourceContext();
    const { loading, permissions } = usePermissions();
    if (loading) {
        return null;
    }
    const canExport = canAccess({
        action: 'export',
        resource,
        permissions,
    });
    const canDelete = canAccess({
        action: 'delete',
        resource,
        permissions,
    });
    const bulkActionButtons = props.bulkActionButtons ? (
        props.bulkActionButtons
    ) : canExport || canDelete ? (
        <>
            {exporter !== false && canExport && <BulkExportButton />}
            {canDelete && <BulkDeleteButton />}
        </>
    ) : (
        false
    );
    return (
        <RaList
            bulkActionButtons={bulkActionButtons}
            actions={<ListActions />}
            {...props}
        />
    );
};

List.propTypes = RaList.propTypes;
List.defaultProps = RaList.defaultProps;
