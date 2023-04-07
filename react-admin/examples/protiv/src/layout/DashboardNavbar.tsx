import * as React from 'react';
import { AppBar, Box, IconButton, Stack, Toolbar, Typography } from '@mui/material';
// material
import { alpha, styled } from '@mui/material/styles';
//
import { MHidden } from '../components/@material-extend';

// hooks
import Logo from '../components/Logo';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useSelector,useDispatch } from 'react-redux';
import { ReduxState,useTranslate } from 'react-admin';
import { CustomUserMenu } from './AppBar';
import useCollapseDrawer from "../hooks/useCollapseDrawer";
import MenuIcon from '@mui/icons-material/Menu';
import { setSidebarVisibility, } from 'ra-core';
import MenuFooter from './MenuFooter';
import { CreateButton } from './CreateButton';
import { canAccess } from '../ra-rbac';
import { usePermissionsOptimized } from '../components/identity';
import { NUMBER } from '../utils/Constants/MagicNumber';
import Help from './Help';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 300;
const COLLAPSE_WIDTH = 80;

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 84;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.05)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: 'white',
  color: alpha(theme.palette.text.primary, 0.72),
  [theme.breakpoints.up("lg")]: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, NUMBER.TWO),
  },
}));

// ----------------------------------------------------------------------

type DashboardNavbarProps = {
  onOpenSidebar?: VoidFunction;
};


export default function DashboardNavbar({
  onOpenSidebar, logout, ...props
}: DashboardNavbarProps|any) {
  const dispatch = useDispatch();
  const translate = useTranslate()
  const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
  
  const toggleSidebar = () => {
    dispatch(setSidebarVisibility(!open));
  };
  const {
    isCollapse,
    onToggleCollapse,
  } = useCollapseDrawer();
  const { permissions } = usePermissionsOptimized();

  return (    
    <div>
        
        {/* <div className='alert-data-msg-overlay'></div> */}

        {/* <div className='alert-data-msg'>        
        <div className='alert-data-msg-icon'><img src={DataImportIcon} /></div>
        <div className='alert-data-msg-body'>
        <h4>Data is importing from “Attendance.csv”</h4>
        <p>Your data is proceeding in the background. Please wait while we get all member's data in the system.</p>
        </div>
        <button className='data-close-btn'>X</button>
        </div>   */}

        {/* <div className='alert-data-msg alert-data-msg-success'>        
        <div className='alert-data-msg-icon'><img src={DataImportIconSuccess} /></div>
        <div className='alert-data-msg-body'>
        <h4>Your data has been Imported successfully</h4>
        <p>Please proceed to map data fields</p>
        </div>
        <button className='data-close-btn'>X</button>
        </div> */}

      <RootStyle
        sx={{
          ...(isCollapse && {
            width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` },
          }),
        }}      
      >
        <ToolbarStyle>
          <MHidden width="lgUp">
            <IconButton className="MuiMenuIcon"
              onClick={toggleSidebar}
              sx={{ mr: 1, color: 'text.primary' }}
            >
             <MenuIcon />
            </IconButton>
          </MHidden>
          <MHidden width="lgUp">
            <Logo />
          </MHidden>
          <MHidden width="lgDown">
            <IconButton className="MuiMenuIcon"
              onClick={onToggleCollapse}
              sx={{ mr: 1, color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          </MHidden>
          {/* <Searchbar /> */}
          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, sm: 1.5 }}
          >
            {/* <LanguagePopover />
            <NotificationsPopover /> */}
            {/* <AccountPopover /> */}
          </Stack>
          {canAccess({ permissions, resource: 'propays', action: 'create' }) && 
          <Box className="MuiCreatePropayButton">
            <AddBoxIcon/>
            <CreateButton path="/create/propay"/>
            <Typography variant="caption">{translate('dashboard.create_propay')}</Typography>
          </Box>}
          {/* <LoadingIndicator /> */}
          {/* <LocalesMenuButton
                  languages={[
                      { locale: 'en', name: 'English' },
                      { locale: 'es', name: 'Español' }
                  ]}
              /> */}
            <Help/>
          <CustomUserMenu  logout={logout}/>
        </ToolbarStyle>
      </RootStyle>
      <MenuFooter/>
    </div>
  );
}
