import * as React from 'react';
import {
    EditButton,
    ShowActions as RaShowActions,
    ShowActionsProps,
    TopToolbar,
    useResourceContext,
    useResourceDefinition,
    useShowContext,
} from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';

/**
 * Replacement for react-admin's ShowAction that adds RBAC control to actions
 *
 * Users must have the 'edit' permission on the resource and record to see the EditButton.
 *
 * @example
 * import { Show } from 'react-admin';
 * import { ShowActions } from '@react-admin/ra-rbac';
 *
 * export const PostShow = (props) => (
 *     <Show actions={<ShowActions />} {...props}>
 *         ...
 *     </Show>
 * );
 */
export const ShowActions = (props: ShowActionsProps) => {
    const { className } = props;
    const { record, ...rest } = useShowContext(props);
    const { hasEdit } = useResourceDefinition();
    const resource = useResourceContext();
    const { loaded, permissions } = usePermissions();
    return (
        loaded && (
            <TopToolbar className={className} {...sanitizeRestProps(rest)}>
                {hasEdit &&
                    canAccess({
                        permissions,
                        action: 'edit',
                        resource,
                        record,
                    }) && <EditButton record={record} />}
            </TopToolbar>
        ) || <></>
        
    );
};

ShowActions.propTypes = RaShowActions.propTypes;

const sanitizeRestProps = ({
    basePath,
    defaultTitle,
    className,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    loaded,
    loading,
    refetch,
    resource,
    ...rest
}: any) => rest;
