import * as React from 'react';
import { cloneElement, useMemo, useContext } from 'react';

import {
    CreateButton,
    ExportButton,
    FilterButton,
    FilterContext,
    ListActions as RaListActions,
    ListActionsProps,
    sanitizeListRestProps,
    TopToolbar,
    useListContext,
    useResourceContext,
    useResourceDefinition,
} from 'react-admin';

import { usePermissions } from '../usePermissions';
import { canAccess } from '../canAccess';

/**
 * Replacement for react-admin's ListAction that adds RBAC control to actions
 *
 * Users must have the 'create' permission on the resource to see the CreateButton.
 * Users must have the 'export' permission on the resource to see the ExportButton.
 *
 * @example
 * import { List } from 'react-admin';
 * import { ListActions } from '@react-admin/ra-rbac';
 *
 * export const PostList = (props) => (
 *     <List actions={<ListActions />} {...props}>
 *         ...
 *     </List>
 * );
 */
export const ListActions = (props: ListActionsProps) => {
    const { className, exporter, filters: filtersProp, ...rest } = props;
    const {
        currentSort,
        displayedFilters,
        filterValues,
        selectedIds,
        showFilter,
        total,
    } = useListContext(props);
    const resource = useResourceContext(rest);
    const { hasCreate } = useResourceDefinition(rest);
    const filters = useContext(FilterContext) || filtersProp;
    const { loaded, permissions } = usePermissions();
    return useMemo(
        () =>
            loaded && (
                <TopToolbar
                    className={className}
                    {...sanitizeListRestProps(rest)}
                >
                    {filtersProp
                        ? cloneElement(filtersProp, {
                              resource,
                              showFilter,
                              displayedFilters,
                              filterValues,
                              context: 'button',
                          })
                        : filters && <FilterButton />}
                    {hasCreate &&
                        canAccess({
                            action: 'create',
                            resource,
                            permissions,
                        }) && <CreateButton />}
                    {exporter !== false &&
                        canAccess({
                            action: 'export',
                            resource,
                            permissions,
                        }) && <CreateButton /> && (
                            <ExportButton
                                disabled={total === 0}
                                resource={resource}
                                sort={currentSort}
                                filterValues={filterValues}
                            />
                        )}
                </TopToolbar>
            )||<></>,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            resource,
            displayedFilters,
            filterValues,
            selectedIds,
            filters,
            total,
            loaded,
        ]
    );
};

ListActions.propTypes = RaListActions.propTypes;
ListActions.defaultProps = RaListActions.defaultProps;
