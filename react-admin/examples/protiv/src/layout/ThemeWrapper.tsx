import { CssBaseline } from '@mui/material';
// material
import {
    createTheme,
    StyledEngineProvider,
    ThemeOptions,
    ThemeProvider,
} from '@mui/material/styles';
import React, { useMemo } from 'react';
import breakpoints from '../theme/breakpoints';
import componentsOverride from '../theme/overrides';
import palette from '../theme/palette';
import shadows, { customShadows } from '../theme/shadows';
import shape from '../theme/shape';
import typography from '../theme/typography';

// the right theme
const ThemeWrapper = (props: any) => {
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
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {React.Children.map(props.children, child => {
                    // Checking isValidElement is the safe way and avoids a typescript
                    // error too.
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, props);
                    }
                    return child;
                })}
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default ThemeWrapper;
