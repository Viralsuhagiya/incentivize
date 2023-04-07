import { cloneElement, useMemo, useContext } from 'react';
import {
    sanitizeListRestProps,
    useListContext,
    useResourceContext,
    useResourceDefinition,
    ListActionsProps,
    TopToolbar,
    CreateButton, ExportButton,
    FilterContext,FilterButton, CreateButtonClasses
} from 'react-admin';
import { useGetResourceLabel } from 'react-admin';
import { styled } from '@mui/system';

/**
 * Action Toolbar for the List view
 *
 * Internal component. If you want to add or remove actions for a List view,
 * write your own ListActions Component. Then, in the <List> component,
 * use it in the `actions` prop to pass a custom component.
 *
 * @example
 *     import { cloneElement } from 'react';
 *     import Button from '@mui/material/Button';
 *     import { TopToolbar, List, CreateButton, ExportButton } from 'react-admin';
 *
 *     const PostListActions = ({ basePath, filters }) => (
 *         <TopToolbar>
 *             { cloneElement(filters, { context: 'button' }) }
 *             <CreateButton/>
 *             <ExportButton/>
 *             // Add your custom actions here //
 *             <Button onClick={customAction}>Custom Action</Button>
 *         </TopToolbar>
 *     );
 *
 *     export const PostList = (props) => (
 *         <List actions={<PostListActions />} {...props}>
 *             ...
 *         </List>
 *     );
 */

 const StyledCreateButton = styled(CreateButton,{name:'RaCreateButton'})(({ theme }) => ({
    [`&.${CreateButtonClasses.floating}`]: {
        color: theme.palette.primary.contrastText,
    }
}));

export const ListActions = (props: ListActionsProps&{ createButtonProps?: any, showCreate?: boolean }) => {
    const {
        createButtonProps = {variant:'contained'},
        showCreate,
        className,
        exporter,
        filters: filtersProp,
        hasCreate: _,
        ...rest
    } = props;
    const {
        currentSort,
        displayedFilters,
        filterValues,
        selectedIds,
        showFilter,
        total,
    } = useListContext(props);
    const resource = useResourceContext(props);
    const { hasCreate } = useResourceDefinition(props);
    const filters = useContext(FilterContext) || filtersProp;
    const getResourceLabel = useGetResourceLabel();
    const defaultCreateLabel = 'New '+getResourceLabel(resource, 1)
    
    return useMemo(
        () => (
            <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
                {(hasCreate) && <StyledCreateButton label={defaultCreateLabel} {...createButtonProps}/>}
                {filtersProp
                    ? cloneElement(filtersProp, {
                          resource,
                          showFilter,
                          displayedFilters,
                          filterValues,
                          context: 'button',
                      })
                    : filters && <FilterButton />}
                
                {exporter !== false && (
                    <ExportButton
                        disabled={total === 0}
                        resource={resource}
                        sort={currentSort}
                        filterValues={filterValues}
                    />
                )}
            </TopToolbar>
        ),
        [resource, displayedFilters, filterValues, selectedIds, filters, total] // eslint-disable-line react-hooks/exhaustive-deps
    );
};
