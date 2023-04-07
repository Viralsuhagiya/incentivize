import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import lodashGet from 'lodash/get';
import DefaultIcon from '@mui/icons-material/ViewList';
import classnames from 'classnames';
import {
    useGetResourceLabel,
    getResources,
    ReduxState,
    DashboardMenuItem,
    MenuItemLink,
    MenuProps,
} from 'react-admin';

import { usePermissions } from './usePermissions';
import { canAccess } from './canAccess';
import { NUMBER } from '../utils/Constants/MagicNumber';

export const MENU_WIDTH = 240;
export const CLOSED_MENU_WIDTH = 55;

/**
 * A replacement for react-admin's `<Menu>` component, which only displays
 * the menu items that the current user has access to (using the `list` action).
 *
 * Pass this menu to a `<Layout>`, and pass that layout to the `<Admin>` component to use it.
 *
 * @example
 * import { Admin, Resource, ListGuesser, Layout, LayoutProps } from 'react-admin';
 * import { Menu } from '@react-admin/ra-rbac';
 *
 * import * as posts from './posts';
 * import * as comments from './comments';
 * import * as users from './users';
 *
 * const authProvider= {
 *     // ...
 *     getPermissions: () => Promise.resolve([
 *         { "action": "*", "resource": "posts" },
 *         { "action": "*", "resource": "comments" },
 *     ]),
 * };
 *
 * const CustomLayout = (props: LayoutProps) => <Layout {...props} menu={Menu} />;
 *
 * const App = () => (
 *     <Admin dataProvider={...} authProvider={...} layout={CustomLayout}>
 *         <Resource name="posts" {...posts} />
 *         <Resource name="comments" {...comments} />
 *         <Resource name="users" {...users} />
 *     </Admin>
 * ); // the user won't see the Users menu
 */export const Menu = (props: MenuProps) => {
    const resources = useSelector(getResources, shallowEqual) as Array<any>;
    const getResourceLabel = useGetResourceLabel();
    const {
        hasDashboard,
        dense,
        children = (
            <>
                {hasDashboard && <DashboardMenuItem dense={dense} />}
                {resources
                    .filter(r => r.hasList)
                    .filter(r =>
                        canAccess({ permissions, resource: r.name, action: 'list' })
                    )
                    .map(resource => (
                        <MenuItemLink
                            key={resource.name}
                            to={`/${resource.name}`}
                            state={{ _scrollToTop: true }}
                            primaryText={getResourceLabel(resource.name, NUMBER.TWO)}
                            leftIcon={
                                resource.icon ? (
                                    <resource.icon />
                                ) : (
                                    <DefaultIcon />
                                )
                            }
                            dense={dense}
                        />
                    ))}
            </>
        ),
        className,
        ...rest
    } = props;
    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
    const { loading, permissions } = usePermissions();

    if (loading) {
        return null;
    }
    return (
        <Root
            className={classnames(
                MenuClasses.main,
                {
                    [MenuClasses.open]: open,
                    [MenuClasses.closed]: !open,
                },
                className
            )}
            {...rest}
        >
            {children}
        </Root>
    );
};

Menu.propTypes = {
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
};

const PREFIX = 'RaMenu';

export const MenuClasses = {
    main: `${PREFIX}-main`,
    open: `${PREFIX}-open`,
    closed: `${PREFIX}-closed`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${MenuClasses.main}`]: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginTop: '0.5em',
        marginBottom: '1em',
        [theme.breakpoints.only('xs')]: {
            marginTop: 0,
        },
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

    [`&.${MenuClasses.open}`]: {
        width: lodashGet(theme, 'menu.width', MENU_WIDTH),
    },

    [`&.${MenuClasses.closed}`]: {
        width: lodashGet(theme, 'menu.closedWidth', CLOSED_MENU_WIDTH),
    },
}));
