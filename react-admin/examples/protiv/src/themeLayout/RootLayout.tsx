import React, {
    useState,
    ErrorInfo,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { styled, useTheme } from '@mui/material/styles';
import { ReduxState, translate, useTranslate } from 'ra-core';
import { Box, Typography } from '@mui/material';
import { Sidebar as DefaultSidebar, Error, Menu as DefaultMenu, SkipNavigationButton, AppBar as DefaultAppBar, LayoutProps } from 'react-admin';
import { Notification as DefaultNotification } from 'react-admin';
import useCollapseDrawer from '../hooks/useCollapseDrawer';
import useCompanyAccess from '../components/identity/useCompanyAccess';
import { useLocation } from 'react-router';
import { NUMBER } from '../utils/Constants/MagicNumber';

const MainStyle = styled('main')(({ theme }) => ({
    '.main-page-container': {
        padding: '10px 16px',
        background: 'transparent',
        [theme.breakpoints.up('md')]: {
            padding: '10px 36px',
        }
    },
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '100%',
    paddingTop: 16,
    paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('md')]: {
      paddingTop: 16,
      paddingBottom: 0,
    }
  }));




export const RootLayoutWithoutTheme = (props: RooLayoutWithoutThemeProps) => {
    useCompanyAccess();
    const {
        appBar: AppBar = DefaultAppBar,
        children,
        className,
        dashboard,
        error: errorComponent,
        logout,
        menu: Menu = DefaultMenu,
        notification: Notification = DefaultNotification,
        sidebar: Sidebar = DefaultSidebar,
        title,
        noTitle,
        ...rest
    } = props;
    const [errorInfo, setErrorInfo] = useState<ErrorInfo|any>(null);
    const translate = useTranslate()
    const open = useSelector<ReduxState, boolean>(
        state => state.admin.ui.sidebarOpen
    );

    const handleError = (error: Error, info: ErrorInfo) => {
        setErrorInfo(info);
    };
    const theme = useTheme();
    const { collapseClick } = useCollapseDrawer();
    const location = useLocation();
    const pageClass = (location.pathname==='/'||location.pathname==='')?"hasDashboard":''

    return (
        <>
            <StyledLayout
                className={classnames('layout', LayoutClasses.root, className)}
                {...rest}
            >
                <SkipNavigationButton />
                <div className={LayoutClasses.appFrame}>
                    <AppBar logout={logout} open={open} title={title} />


                    <MainStyle className={LayoutClasses.contentWithSidebar} sx={{
                                     ...(collapseClick && {
                                      ml: '80px'
                                    })
                                  }}
                      >
                        <Sidebar>
                            <Menu hasDashboard={!!dashboard}/>
                        </Sidebar>
                        <div
                            id='main-content'
                            className={`${LayoutClasses.content} ${pageClass} main-page-container`}
                        >
                            {!props.noTitle&&<div id='react-admin-title' />}
                            <ErrorBoundary
                                onError={handleError}
                                fallbackRender={({
                                    error,
                                    resetErrorBoundary,
                                }) => (
                                    <Error
                                        error={error}
                                        errorComponent={errorComponent}
                                        errorInfo={errorInfo}
                                        resetErrorBoundary={resetErrorBoundary}
                                        title={title}
                                    />
                                )}
                            >
                                {children}
                            </ErrorBoundary>
                            <Box className='MuiDesktopFooter'>
                        {translate('dashboard.copy_right')}
                    </Box>
                        </div>
                    </MainStyle>
                    
                </div>
            </StyledLayout>
            <Notification />
        </>
    );
};
interface RooLayoutWithoutThemeProps extends Omit<LayoutProps, 'theme'> {
    open?: boolean;
    noTitle?: boolean;
}

const PREFIX = 'RaLayout';
export const LayoutClasses = {
    root: `${PREFIX}-root`,
    appFrame: `${PREFIX}-appFrame`,
    contentWithSidebar: `${PREFIX}-contentWithSidebar`,
    content: `${PREFIX}-content`,
};

const StyledLayout = styled('div', { name: PREFIX })(({ theme }) => ({
    [`&.${LayoutClasses.root}`]: {
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1,
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        minWidth: 'fit-content',
        width: '100%',
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    [`& .${LayoutClasses.appFrame}`]: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        [theme.breakpoints.up('xs')]: {
            marginTop: 84,
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(7),
            paddingBottom: '45px',
        },
    },
    [`& .${LayoutClasses.contentWithSidebar}`]: {
        display: 'flex',
        flexGrow: 1,
    },
    [`& .${LayoutClasses.content}`]: {
        backgroundColor: theme.palette.background.default,
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width:'75vw',
        flexBasis: 0,
        padding: theme.spacing(NUMBER.THREE),
        paddingTop: theme.spacing(1),
        paddingLeft: 0,
        [theme.breakpoints.up('xs')]: {
            paddingLeft: 5,
        },
        [theme.breakpoints.down('md')]: {
            padding: 0,
        },
        [`&.hasDashboard`]: {
            [theme.breakpoints.down('sm')]: {
                paddingLeft:0,
                paddingRight:0
            }
        },
    },
}));
