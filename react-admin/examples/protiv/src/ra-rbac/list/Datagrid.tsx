import * as React from 'react';
import { Children, isValidElement } from 'react';
import {
    Datagrid as RaDatagrid,
    DatagridProps,
    useResourceContext,
} from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';

/**
 * Alternative to react-admin's <Datagrid> that adds RBAC control to columns
 *
 * To see a column, the user must have the permission to read the resource column:
 * { "action": "read", "resource": `${resource}.${source}` }
 *
 * Also, the rowClick prop is automatically set depending on the user props:
 * - "edit" if the user has the permission to edit the resource
 * - "show" if the user doesn't have the permission to edit the resource but has the permission to show it
 * - empty otherwise
 *
 * @example
 * import { Datagrid } from '@react-admin/ra-rbac';
 *
 * const authProvider= {
 *     // ...
 *     getPermissions: () => Promise.resolve([
 *         { action: "list", resource: "products" },
 *         { action: "read", resource: "products.thumbnail" },
 *         { action: "read", resource: "products.reference" },
 *         { action: "read", resource: "products.category_id" },
 *         { action: "read", resource: "products.width" },
 *         { action: "read", resource: "products.height" },
 *         { action: "read", resource: "products.price" },
 *         { action: "read", resource: "products.description" },
 *     ]),
 * };
 *
 * const ProductList = props => (
 *     <List {...props}>
 *         <Datagrid rowClick="edit"> // <-- RBAC Datagrid
 *             <ImageField source="thumbnail" />
 *             <TextField source="reference" />
 *             <ReferenceField source="category_id" reference="categories">
 *                 <TextField source="name" />
 *             </ReferenceField>
 *             <NumberField source="width" />
 *             <NumberField source="height" />
 *             <NumberField source="price" />
 *             <TextField source="description" />
 *             {
 *                // these two columns are not visible to the user
 *             }
 *             <NumberField source="stock" />
 *             <NumberField source="sales" />
 *         </Datagrid>
 *     </List>
 * );
 */
export const Datagrid = (props: DatagridProps) => {
    const resource = useResourceContext();
    const { children, ...rest } = props;
    const { loading, permissions } = usePermissions();
    if (loading) return null;
    const defaultRowClick = canAccess({ permissions, resource, action: 'edit' })
        ? 'edit'
        : canAccess({ permissions, resource, action: 'show' })
        ? 'show'
        : '';
    return (
        <RaDatagrid rowClick={defaultRowClick} {...rest}>
            {Children.map(children, child =>
                isValidElement(child) &&
                canAccess({
                    permissions,
                    action: 'read',
                    resource: `${resource}.${(child.props as any).source}`,
                })
                    ? child
                    : null
            )}
        </RaDatagrid>
    );
};
