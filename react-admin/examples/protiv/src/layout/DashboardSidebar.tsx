import {
  Box,
  Drawer,
  Stack,
} from '@mui/material';
// material
import { alpha, styled } from '@mui/material/styles';
import { setSidebarVisibility } from 'ra-core';

import { useEffect, ReactNode } from "react";
import { Link as RouterLink, useLocation } from 'react-router-dom';
//
import { MHidden } from '../components/@material-extend';
// components
import Logo from '../components/Logo';
import NavSection from '../components/NavSection';
import Scrollbar from '../components/Scrollbar';

// hooks
import useCollapseDrawer from '../hooks/useCollapseDrawer';
import useGetSidebarConfig from './SidebarConfig';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 300;
const COLLAPSE_WIDTH = 80;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
  },
}));

// ----------------------------------------------------------------------

type DashboardSidebarProps = {
  isOpenSidebar: boolean;
  onCloseSidebar: VoidFunction;
  children?: ReactNode;
  menu?: ReactNode;
};

export default function DashboardSidebar({
  isOpenSidebar,
  onCloseSidebar,
  ...props
}: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const sidebarConfig = useGetSidebarConfig();
  const dispatch = useDispatch();
  const closeSidebar = () => dispatch(setSidebarVisibility(false));

  const {
    isCollapse,
    collapseClick,
    collapseHover,
  } = useCollapseDrawer();
  useEffect(() => {
    if (isOpenSidebar) {
      closeSidebar();
    }
 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
    className="sidebar-collapse-mobile"
      sx={{
        height: '100%',
        "& .simplebar-content": {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',

        },
      }}
    >
      <Stack
        spacing={0}
        sx={{
          px: 0,
          pt: 0,
          pb: 0,
          ...(isCollapse && {
            alignItems: 'center',
          }),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box className="MuiSidebarLogo" component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
            <Logo sx={{width:100}}/>
          </Box>

          {/* <MHidden width="lgDown">
            {!isCollapse && (
              <IconCollapse
                onToggleCollapse={onToggleCollapse}
                collapseClick={collapseClick}
              />
            )}
          </MHidden> */}
        </Stack>

      </Stack>
      {/* {children} */}
      <NavSection navConfig={sidebarConfig} isShow={!isCollapse} {...props}/>
    </Scrollbar>
  );
  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={closeSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            ...(isCollapse && {
              className: 'MuiDrawerCollpased',
            }),
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              ...(isCollapse && {
                width: COLLAPSE_WIDTH,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
