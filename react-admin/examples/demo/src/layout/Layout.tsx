import * as React from 'react';
import { useSelector } from 'react-redux';
import { LayoutWithoutTheme, LayoutProps } from 'ra-ui-materialui';
import AppBar from './AppBar';
import Menu from './Menu';
import { darkTheme, lightTheme } from './themes';
import { AppState } from '../types';

import { useMemo } from 'react';
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

export default (props: LayoutProps) => {
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
  

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <LayoutWithoutTheme appBar={AppBar} menu={Menu}  {...props} />
            </ThemeProvider>
        </StyledEngineProvider>


    );
};
