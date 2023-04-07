import * as React from 'react';
import { Children, isValidElement } from 'react';
import {
    SimpleShowLayout as RaSimpleShowLayout,
    SimpleShowLayoutProps,
    useResourceContext,
} from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';

/**
 * Alternative to react-admin's <SimpleShowLayout> that adds RBAC control to fields
 *
 * To see a column, the user must have the permission to read the resource column:
 * { "action": "read", "resource": `${resource}.${source}` }
 *
 * @example
 * import { SimpleShowLayout } from '@react-admin/ra-rbac';
 *
 * const authProvider= {
 *     // ...
 *     getPermissions: () => Promise.resolve([
 *         { action: ['list', 'show'], resource: 'products' },
 *         { action: 'read', resource: 'products.reference' },
 *         { action: 'read', resource: 'products.width' },
 *         { action: 'read', resource: 'products.height' },
 *         // 'products.description' is missing
 *         // 'products.image' is missing
 *         { action: 'read', resource: 'products.thumbnail' },
 *         // 'products.stock' is missing
 *     ]),
 * };
 *
 * const ProductShow = props => (
 *     <Show {...props}>
 *         <SimpleShowLayout> // <-- RBAC SimpleShowLayout
 *             <TextField source="reference" />
 *             <TextField source="width" />
 *             <TextField source="height" />
 *             // not displayed
 *             <TextField source="description" />
 *             // not displayed
 *             <TextField source="image" />
 *             <TextField source="thumbnail" />
 *             // not displayed
 *             <TextField source="stock" />
 *         </SimpleShowLayout>
 *     </Show>
 * );
 */
export const SimpleShowLayout = (props: SimpleShowLayoutProps) => {
    const resource = useResourceContext();
    const { children, ...rest } = props;
    const { loading, permissions } = usePermissions();
    if (loading) return null;
    return (
        <RaSimpleShowLayout {...rest}>
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
        </RaSimpleShowLayout>
    );
};

SimpleShowLayout.propTypes = RaSimpleShowLayout.propTypes;
