import * as React from 'react';
import { ReactElement } from 'react';
import { Show as RaShow, ShowProps } from 'react-admin';

import { ShowActions } from './ShowActions';

/**
 * Replacement for react-admin's Show that adds RBAC control to actions
 *
 * Users must have the 'edit' permission on the resource and record to see the EditButton.
 *
 * @example
 * import { Show } from '@react-admin/ra-rbac';
 *
 * const authProvider = {
 *      // ...
 *      getPermissions: () => Promise.resolve({
 *           permissions: [
 *                 { action: ['list', 'show', 'edit'], resource: 'products' },
 *           ],
 *       }),
 * };
 *
 * export const PostShow = (props) => (
 *     <Show {...props}>
 *         ...
 *     </Show>
 * );
 * // user will see the following actions on top of the Show:
 * // - edit
 */
export const Show = (props: ShowProps & { children: ReactElement }) => {
    return <RaShow actions={<ShowActions />} {...props} />;
};

Show.propTypes = RaShow.propTypes;
