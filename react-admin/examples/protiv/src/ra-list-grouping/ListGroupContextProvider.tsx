import * as React from 'react';
import { ListGroupContext } from './ListGroupContext';
import {ListSortContext, ListContext, ListPaginationContext, usePickSortContext, usePickPaginationContext, ListFilterContext, usePickFilterContext} from 'react-admin';

export const ListGroupContextProvider = ({ value, children }) => (
    <ListGroupContext.Provider value={value}>
        <ListContext.Provider value={value}>
            <ListFilterContext.Provider value={usePickFilterContext(value)}>
                <ListSortContext.Provider value={usePickSortContext(value)}>
                    <ListPaginationContext.Provider
                        value={usePickPaginationContext(value)}
                    >
                        {children}
                    </ListPaginationContext.Provider>
                </ListSortContext.Provider>
            </ListFilterContext.Provider>
        </ListContext.Provider>
    </ListGroupContext.Provider>
);
