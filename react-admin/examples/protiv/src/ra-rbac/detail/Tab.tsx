import * as React from 'react';
import { Children, isValidElement } from 'react';
import {
    useResourceContext,
    useRecordContext,
    Tab as RaTab,
    TabProps,
} from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';

/**
 * Replacement for the show <Tab> that only renders a tab if the user has the right permissions.
 *
 * Add a name prop to the Tab to define the sub-resource on which the user needs to have the 'read' permissions for.
 *
 * <Tab> also only renders the child fields for which the user has the 'read' permissions.
 *
 * @example
 * import { Show, TabbedShowLayout, TextField } from 'react-admin';
 * import { Tab } from '@react-admin/ra-rbac';
 *
 * const authProvider = {
 *      // ...
 *      getPermissions: () => Promise.resolve({
 *           permissions: [
 *                 { action: ['list', 'show'], resource: 'products' },
 *                 { action: 'read', resource: 'products.reference' },
 *                 { action: 'read', resource: 'products.width' },
 *                 { action: 'read', resource: 'products.height' },
 *                 // 'products.description' is missing
 *                 { action: 'read', resource: 'products.thumbnail' },
 *                 // 'products.image' is missing
 *                 { action: 'read', resource: 'products.tab.description' },
 *                 { action: 'read', resource: 'products.tab.images' },
 *                 // 'products.tab.stock' is missing
 *           ],
 *       }),
 * };
 *
 * const ProductShow = props => (
 *    <Show {...props}>
 *        <TabbedShowLayout>
 *            <Tab label="Description" name="description">
 *                <TextField source="reference" />
 *                <TextField source="width" />
 *                <TextField source="height" />
 *                {// Not displayed }
 *                <TextField source="description" />
 *            </Tab>
 *            <Tab label="Images" name="images">
 *                <TextField source="image" />
 *                {// Not displayed }
 *                <TextField source="thumbnail" />
 *            </Tab>
 *            {// Not displayed }
 *            <Tab label="Stock" name="stock">
 *                <TextField source="stock" />
 *            </Tab>
 *        </TabbedShowLayout>
 *    </Show>
 * );
 */
export const Tab = ({ name, children, ...props }: TabWithPermissionsProps) => {
    const resource = useResourceContext();
    const record = useRecordContext();
    const { loading, permissions } = usePermissions();
    if (
        loading ||
        !canAccess({
            permissions,
            action: 'read',
            resource: `${resource}.tab.${name}`,
            record,
        })
    ) {
        return null;
    }
    return (
        <RaTab {...props}>
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
        </RaTab>
    );
};

export interface TabWithPermissionsProps extends TabProps {
    name: string;
}
