import * as React from 'react';
import { ReactElement } from 'react';
import { Edit as RaEdit, EditProps } from 'react-admin';

import { EditActions } from './EditActions';

/**
 * Replacement for react-admin's Edit that adds RBAC control to actions
 *
 * Users must have the 'show' permission on the resource and record to see the ShowButton.
 * Users must have the 'clone' permission on the resource and record to see the CloneButton.
 *
 * @example
 * import { Edit } from '@react-admin/ra-rbac';
 *
 * const authProvider = {
 *      // ...
 *      getPermissions: () => Promise.resolve({
 *           permissions: [
 *                 { action: ['list', 'edit', 'clone'], resource: 'products' },
 *           ],
 *       }),
 * };
 *
 * export const PostEdit = (props) => (
 *     <Edit {...props}>
 *         ...
 *     </Edit>
 * );
 * // user will see the clone button but not the show button
 */
export const Edit = (props: EditProps & { children: ReactElement }) => {
    return <RaEdit actions={<EditActions />} {...props} />;
};

Edit.propTypes = RaEdit.propTypes;
