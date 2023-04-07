import * as React from 'react';
import { Children, isValidElement } from 'react';
import {
    SimpleForm as RaSimpleForm,
    SimpleFormProps,
    useResourceContext,
} from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';

import { Toolbar } from './Toolbar';

/**
 * Alternative to react-admin's <SimpleForm> that adds RBAC control to inputs
 *
 * To see an input, the user must have the permission to write the resource field:
 * { "action": "write", "resource": `${resource}.${source}` }
 *
 * SimpleForm also renders the delete button only if the user has the 'delete' permission.
 *
 * @example
 * import { SimpleForm } from '@react-admin/ra-rbac';
 *
 * const authProvider = {
 *     // ...
 *     getPermissions: () => Promise.resolve({
 *         permissions: [
 *             // 'delete' is missing
 *             { action: ['list', 'edit'], resource: 'products' },
 *             { action: 'write', resource: 'products.reference' },
 *             { action: 'write', resource: 'products.width' },
 *             { action: 'write', resource: 'products.height' },
 *             // 'products.description' is missing
 *             { action: 'write', resource: 'products.thumbnail' },
 *             // 'products.image' is missing
 *         ]
 *     }),
 * };
 *
 * const ProductEdit = props => (
 *     <Edit {...props}>
 *         <SimpleForm> // <-- RBAC SimpleForm
 *             <TextInput source="reference" />
 *             <TextInput source="width" />
 *             <TextInput source="height" />
 *             // not displayed
 *             <TextInput source="description" />
 *             // not displayed
 *             <TextInput source="image" />
 *             <TextInput source="thumbnail" />
 *             // no delete button
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export const SimpleForm = (props: SimpleFormProps) => {
    const resource = useResourceContext();
    const { children, ...rest } = props;
    const { loading, permissions } = usePermissions();
    if (loading) return null;
    return (
        <RaSimpleForm toolbar={<Toolbar />} {...rest}>
            {Children.map(children, child =>
                isValidElement(child) &&
                canAccess({
                    permissions,
                    action: 'write',
                    resource: `${resource}.${(child.props as any).source}`,
                })
                    ? child
                    : null
            )}
        </RaSimpleForm>
    );
};

SimpleForm.propTypes = RaSimpleForm.propTypes;
