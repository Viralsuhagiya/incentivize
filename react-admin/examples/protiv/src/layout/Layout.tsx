import * as React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'react-admin';
import { LayoutProps} from 'ra-ui-materialui';
import { RootLayoutWithoutTheme } from '../themeLayout/RootLayout'
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

import Menu from './Menu';

import { useMemo, useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import {
    createTheme,
    ThemeOptions,
    ThemeProvider,
    StyledEngineProvider,
} from '@mui/material/styles';

import shape from '../theme/./shape';
import palette from '../theme/./palette';
import typography from '../theme/./typography';
import breakpoints from '../theme/./breakpoints';
import componentsOverride from '../theme/./overrides';
import shadows, { customShadows } from '../theme/./shadows';
import {AppLocationContext} from '../ra-navigation/app-location';
import { useLocation, useNavigate } from 'react-router';
import IdentityContext from '../components/identity/IdentityContext';

export const LayoutContext = React.createContext<LayoutContextValue|undefined>(undefined);
type LayoutContextValue = {
    noTitle?: boolean,
    titleComponent?: React.ReactElement
}
export const useLayoutContext = (): LayoutContextValue => {
    const context = React.useContext(LayoutContext);
    return context
};


const DefaultNavbar = (props: any) => {
    const { logout } = props;
    return (
        <DashboardNavbar  logout={logout}/>
    );
};

const DefaultSideBar = (props: any) => {
    const isOpen = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
    const { children } = props
    return (
        <>
          <DashboardSidebar isOpenSidebar={isOpen} onCloseSidebar={()=>{}}>
              {children}
          </DashboardSidebar>
        </>
      );      
};
    
export default (props: LayoutProps&LayoutContextValue) => {
    const themeMode = 'light';
    const themeDirection = 'ltr';
    const isLight = themeMode === 'light';

    const themeOptions: ThemeOptions = useMemo(
        () => ({
            palette: isLight
                ? { ...palette.light, mode: 'light' }
                : { ...palette.dark, mode: 'dark' },
            shape,
            typography,
            breakpoints,
            direction: themeDirection,
            shadows: isLight ? shadows.light : shadows.dark,
            customShadows: isLight ? customShadows.light : customShadows.dark,
        }),
        [isLight, themeDirection]
    );
    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    /** 
     * Backword compatibale code to redirect from HashRouter to the BrowserRouter.
     * so that /#/settings will redirect to /settings
     * */
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(()=>{
        if(location.hash){
            const pathname = location.hash.substring(1)
            console.log(`Redirect from => ${location.hash} to => ${pathname}`)
            navigate({pathname:pathname})
        }
    },[location,navigate])

    

    return (
        <AppLocationContext>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme} >
                    <CssBaseline />
                        <IdentityContext>
                            <LayoutContext.Provider value={{noTitle:props.noTitle, titleComponent:props.titleComponent}}>
                                <RootLayoutWithoutTheme appBar={DefaultNavbar} sidebar={DefaultSideBar} {...props} menu={Menu} />
                            </LayoutContext.Provider>
                        </IdentityContext>
                </ThemeProvider>
            </StyledEngineProvider>
        </AppLocationContext>


    );
};
