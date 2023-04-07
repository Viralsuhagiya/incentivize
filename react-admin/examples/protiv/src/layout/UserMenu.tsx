import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Children, cloneElement, isValidElement, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslate } from 'ra-core';
import {
    Tooltip,
    IconButton,
    Menu,
    PopoverOrigin,
    Divider,
    MenuItem,
    ListItemText,
    Typography,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MyAvatar from '../components/MyAvatar';
import { MIconButton } from '../components/@material-extend';
import { useIdentityContext } from '../components/identity';
import AvtaarDefaultImage from '../assets/user-icon.svg';
import { NUMBER } from '../utils/Constants/MagicNumber';

export const UserMenu = (props: UserMenuProps&{userMenuFooter?:React.ReactElement}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const translate = useTranslate();
    const identity = useIdentityContext();

    const {
        children,
        label = 'ra.auth.user_menu',
        icon = defaultIcon,
        logout,
    } = props;

    if (!logout && !children) return null;
    const open = Boolean(anchorEl);

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <Root className={UserMenuClasses.user}>
            {identity?.fullName ? (
                <MIconButton
                    aria-label={label && translate(label, { _: label })}
                    className={UserMenuClasses.userButton}
                    color="inherit"
                    onClick={handleMenu}
                >
                    {identity.avatar ? <img src={AvtaarDefaultImage} alt='Avtaar' className='header-user-image' /> : <MyAvatar /> }
                </MIconButton>
            ) : (
                <Tooltip title={label && translate(label, { _: label })}>
                    <IconButton
                        aria-label={label && translate(label, { _: label })}
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup={true}
                        color="inherit"
                        onClick={handleMenu}
                        size="large"
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            )}
            <Menu
                id="menu-appbar"
                disableScrollLock
                anchorEl={anchorEl}
                anchorOrigin={AnchorOrigin}
                transformOrigin={TransformOrigin}
                open={open}
                onClose={handleClose}
            >
                {identity?.fullName ?
                    <MenuItem>
                        <ListItemText><Typography variant="subtitle2">{identity.fullName}</Typography></ListItemText>
                    </MenuItem>:null}
                {identity?.fullName ?<Divider />:null}
                {Children.map(children, menuItem =>
                    isValidElement(menuItem)
                        ? cloneElement<any>(menuItem, {
                              onClick: handleClose,
                              identity: identity,
                          })
                        : null
                )}
                {logout}
                {identity&&props.userMenuFooter?cloneElement(props.userMenuFooter,{
                    identity:identity
                }):null}
            </Menu>
        </Root>
    );
};
UserMenu.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    label: PropTypes.string,
    logout: PropTypes.element,
    icon: PropTypes.node,
};

export interface UserMenuProps {
    children?: React.ReactNode;

    label?: string;
    logout?: React.ReactNode;
    icon?: React.ReactNode;
}

const PREFIX = 'RaUserMenu';

export const UserMenuClasses = {
    user: `${PREFIX}-user`,
    userButton: `${PREFIX}-userButton`,
    avatar: `${PREFIX}-avatar`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${UserMenuClasses.user}`]: {},

    [`& .${UserMenuClasses.userButton}`]: {
        textTransform: 'none',
    },

    [`& .${UserMenuClasses.avatar}`]: {
        width: theme.spacing(NUMBER.FOUR),
        height: theme.spacing(NUMBER.FOUR),
    },
}));

const defaultIcon = <AccountCircle />;

const AnchorOrigin: PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
};

const TransformOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'right',
};
