import { useState, ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { NavLink as RouterLink, matchPath, useLocation } from 'react-router-dom';
import { useTheme, styled } from '@mui/material/styles';
import {
  Box,
  List,
  BoxProps,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Tooltip,
  ListItemButtonProps
} from '@mui/material';

import { canAccess, } from '../ra-rbac';
import { usePermissionsOptimized } from './identity';

// ----------------------------------------------------------------------
interface ListItemStyleProps extends ListItemButtonProps {
  component?: ReactNode;
  to?: string;
}

const ListItemStyle = styled(ListItemButton)<ListItemStyleProps>(({ theme }) => ({
  ...theme.typography.body2,
  height: 40,
  fontWeight: 500,
  position: 'relative',
  textTransform: 'capitalize',
  paddingLeft: '12px',
  paddingRight: '12px',
  color: 'rgba(255, 255, 255, 0.7)',
}));

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  marginRight: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

// ----------------------------------------------------------------------

type NavItemProps = {
  title: string;
  path: string;
  hide?:boolean;
  resource?: string;
  isMobile?: boolean;
  icon?: JSX.Element;
  info?: JSX.Element;
  children?: {
    title: string;
    path: string;
    hide?:boolean;
  }[];
};

const matchRoutes = (paths, pathname) => (paths ? !!matchPath({ path: paths, end: false }, pathname) : false);

function NavItem({ item, isShow }: { item: NavItemProps; isShow?: boolean | undefined }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { title, path, icon, info, children } = item;
  const root = (paths: string) =>matchRoutes(paths,pathname);
  const isActiveRoot = path === '/' ? pathname === path: root(path);

  const [open, setOpen] = useState(isActiveRoot);

  const handleOpen = () => {
    setOpen(!open);
  };

  const activeRootStyle = {
    color: '#fff',
    borderRadius: '4px',
    fontWeight: 600,
    bgcolor: theme.palette.primary.main,
    '&:hover': {
       bgcolor: theme.palette.primary.main,
       color: '#fff',
     }
  };

  const activeSubStyle = {
    color: 'text.primary',
    fontWeight: 'fontWeightMedium'
  };
  
  if (children) {
    return (
      <>
        <ListItemStyle
          onClick={handleOpen}
          sx={{
            ...(isActiveRoot && activeRootStyle)
          }}
        >
          <Tooltip title={title} placement="bottom" arrow>
          <ListItemIconStyle>{icon}</ListItemIconStyle>
          </Tooltip>
          

          {isShow && (
            <>
              <ListItemText disableTypography primary={title} />
              {info}
              
              <Box
                component={Icon}
                // icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
                sx={{ width: 16, height: 16, ml: 1 }}
              />
             
            </>
          )}
        </ListItemStyle>

        {isShow && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {children
              .filter(r => !r.hide)
              .map((data) => {
                const isActiveSub = data.path ? !!matchPath({ path:data.path, end: false }, pathname) : false;

                return (
                  <ListItemStyle
                    key={data.title}
                    component={RouterLink}
                    to={data.path}
                    sx={{
                      ...(isActiveSub && activeSubStyle)
                    }}
                  >
                    <ListItemIconStyle>
                      <Box
                        component="span"
                        sx={{
                          width: 4,
                          height: 4,
                          display: 'flex',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'text.disabled',
                          transition: (themes) => themes.transitions.create('transform'),
                          ...(isActiveSub && {
                            transform: 'scale(2)',
                            bgcolor: 'primary.main'
                          })
                        }}
                      />
                    </ListItemIconStyle>
                    <ListItemText disableTypography primary={data.title} />
                  </ListItemStyle>
                );
              })}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  return (
    <ListItemStyle
      component={RouterLink}
      to={path}
      sx={{
        ...(isActiveRoot && activeRootStyle)
      }}
    >
     <ListItemIconStyle><Tooltip title={title} placement="bottom" arrow>{icon && icon}</Tooltip></ListItemIconStyle>
      {isShow && (
        <>
        <ListItemText disableTypography primary={title} />
          {info && info} 
        </>
      )}
    </ListItemStyle>
  );
}

interface NavSectionProps extends BoxProps {
  isShow?: boolean | undefined;
  navConfig: {
    subheader: string;
    items: NavItemProps[];
  }[];
}

export default function NavSection({ navConfig, isShow = true, ...other }: NavSectionProps) {
  const { permissions } = usePermissionsOptimized();
  return (
    <Box {...other}>
      {navConfig.map((list) => {
        const { subheader, items } = list;
        return (
          <List className='nav-link-dashborad' key={subheader} disablePadding>           
            {items
              .filter(r => !r.hide && !r.isMobile && canAccess({ permissions, resource: r.resource, action: 'list' }))
              .map((item: NavItemProps) => (                
                <NavItem key={item.title} item={item} isShow={isShow} />
            ))}
          </List>
        );
      })}
    </Box>
  );
}
