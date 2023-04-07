
import { Stack } from '@mui/material';
import { Tab as MuiTab } from '@mui/material';
import classnames from 'classnames';
import { Helmet } from 'react-helmet-async';


import React, {
    isValidElement,
} from 'react';
import { useLocation,Link } from 'react-router-dom';
import {
    useTranslate,
    TabProps,
} from 'react-admin';

export const Tab = ({
    basePath,
    children,
    contentClassName,
    context,
    className,
    divider,
    icon,
    label,
    spacing = 1,
    syncWithLocation = true,
    syncParams = false,
    value,
    noTitle,
    ...rest
}: Omit<TabProps,'record'>&{noTitle?: boolean,syncParams?: boolean}) => {
    const translate = useTranslate();
    const location = useLocation();
    const propsForLink = {
        component: Link,
        to: syncParams?{ ...location, pathname: value }:{ pathname: value },
    };

    const renderHeader = () => (
        <MuiTab
            key={label}
            label={translate(label, { _: label })}
            value={value}
            icon={icon}
            className={classnames('show-tab', className)}
            {...(syncWithLocation ? propsForLink : {})} // to avoid TypeScript screams, see https://github.com/mui-org/material-ui/issues/9106#issuecomment-451270521
            {...rest}
        />
    );

    const renderContent = () => (
        <Stack className={contentClassName} spacing={spacing} divider={divider}>
            {!noTitle&&<Helmet><title>{translate(label, { _: label })}</title></Helmet>}
            {React.Children.map(children, field =>
                field && isValidElement<any>(field) ? (
                    <>{field}</>
                ) : null
            )}
        </Stack>
    );

    return context === 'header' ? renderHeader() : renderContent();
};
