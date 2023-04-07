import * as React from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import Tabs from '@mui/material/Tabs';
import { TabbedShowLayoutTabsProps } from 'react-admin';

export const TabbedLayoutTabs = ({
    children,
    syncWithLocation,
    value,
    ...rest
}: TabbedShowLayoutTabsProps) => {
    return (
        <Tabs
            indicatorColor="primary"
            value={value}
            {...rest}
        >
            {Children.map(children, (tab, index) => {
                // console.log("Its here now for tab",tab);
                if (!tab || !isValidElement(tab)) 
                {
                    return null;
                }
                    // Builds the full tab which is the concatenation of the last matched route in the
                // TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
                // and the tab path.
                // This will be used as the Tab's value
                const tabPath = getShowLayoutTabFullPath(tab, index);
                return cloneElement(tab, {
                    context: 'header',
                    value: syncWithLocation ? ((tab.props.value===undefined && tabPath)||tab.props.value) : index,
                    syncWithLocation,
                });
            })}
        </Tabs>
    );
};

export const getShowLayoutTabFullPath = (tab, index) =>
    `${tab.props.path ? `${tab.props.path}` : index > 0 ? index : ''}`;

