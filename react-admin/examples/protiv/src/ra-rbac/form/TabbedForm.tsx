import * as React from 'react';
import { TabbedForm as RaTabbedForm, TabbedFormProps } from 'react-admin';

import { Toolbar } from './Toolbar';

/**
 * Alternative to react-admin's <TabbedForm> that adds RBAC control to the delete button.
 *
 * Use in conjunction with ra-rbac's <FormTab> to render inputs based on permissions.
 *
 * @example
 * import { TabbedForm } from '@react-admin/ra-rbac';
 *
 * const authProvider = {
 *     checkAuth: () => Promise.resolve(),
 *     login: () => Promise.resolve(),
 *     logout: () => Promise.resolve(),
 *     checkError: () => Promise.resolve(),
 *     getPermissions: () =>Promise.resolve({
 *         permissions: [
 *             // 'delete' is missing
 *             { action: ['list', 'edit'], resource: 'products' },
 *         ],
 *     }),
 * };
 *
 * const ProductEdit = props => (
 *     <Edit {...props}>
 *         <TabbedForm>
 *             <FormTab label="Description">
 *                 <TextInput source="reference" />
 *                 <TextInput source="width" />
 *                 <TextInput source="height" />
 *                 <TextInput source="description" />
 *             </FormTab>
 *             <FormTab label="Images">
 *                 <TextInput source="image" />
 *                 <TextInput source="thumbnail" />
 *             </FormTab>
 *             <FormTab label="Stock">
 *                 <TextInput source="stock" />
 *             </FormTab>
 *             // delete button not displayed
 *         </TabbedForm>
 *     </Edit>
 * );
 */
export const TabbedForm = (props: TabbedFormProps) => (
    <RaTabbedForm toolbar={<Toolbar />} {...props} />
);

TabbedForm.propTypes = RaTabbedForm.propTypes;
