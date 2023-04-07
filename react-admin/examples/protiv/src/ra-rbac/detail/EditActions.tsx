import * as React from 'react';
import {
    ShowButton,
    CloneButton,
    EditActions as RaEditActions,
    EditActionsProps,
    TopToolbar,
    useResourceContext,
    useResourceDefinition,
    useEditContext,
} from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';

/**
 * Replacement for react-admin's EditAction that adds RBAC control to actions
 *
 * Users must have the 'show' permission on the resource and record to see the ShowButton.
 * Users must have the 'clone' permission on the resource and record to see the CloneButton.
 *
 * @example
 * import { Edit } from 'react-admin';
 * import { EditActions } from '@react-admin/ra-rbac';
 *
 * export const PostEdit = (props) => (
 *     <Edit actions={<EditActions />} {...props}>
 *         ...
 *     </Edit>
 * );
 */
export const EditActions = (props: EditActionsProps) => {
    const { className } = props;
    const { record, ...rest } = useEditContext(props);
    const { hasEdit } = useResourceDefinition(props);
    const resource = useResourceContext(props);
    const { loading, permissions } = usePermissions();
    if (loading) {
        return null;
    }
    const canShow =
        hasEdit &&
        canAccess({
            permissions,
            action: 'show',
            resource,
            record,
        });
    const canClone = canAccess({
        permissions,
        action: 'clone',
        resource,
        record,
    });
    if (!canShow && !canClone) {
        return <div style={{ marginTop: '1em' }} />;
    }
    return (
        <TopToolbar className={className} {...sanitizeRestProps(rest)}>
            {canShow && <ShowButton record={record} />}
            {canClone && <CloneButton record={record} />}
        </TopToolbar>
    );
};

EditActions.propTypes = RaEditActions.propTypes;

const sanitizeRestProps = ({
    basePath,
    defaultTitle,
    className,
    hasCreate,
    hasList,
    hasEdit,
    loaded,
    loading,
    refetch,
    resource,
    ...rest
}: any) => rest;
