import { createContext } from 'react';
import { ListGroupControllerResult } from './useListGroupController';


export const ListGroupContext = createContext<ListGroupControllerResult>({
    currentSort: null,
    data: null,
    defaultTitle: null,
    displayedFilters: null,
    filterValues: null,
    hideFilter: null,
    isFetching: null,
    isLoading: null,
    onSelect: null,
    onToggleItem: null,
    onUnselectItems: null,
    page: null,
    perPage: null,
    refetch: null,
    resource: null,
    selectedIds: undefined,
    setFilters: null,
    setPage: null,
    setPerPage: null,
    setSort: null,
    showFilter: null,
    total: null,
    groupBy: null,
    fields: null
});

ListGroupContext.displayName = 'ListGroupContext';
