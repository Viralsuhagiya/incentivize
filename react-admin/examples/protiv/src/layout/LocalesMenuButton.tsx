import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LanguageIcon from '@mui/icons-material/Translate';
import { Box, Button, Menu, MenuItem, styled } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useLocale, useSetLocale } from 'react-admin';

export const LocalesMenuButton = (props: LocalesMenuButtonProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const languages = props.languages
    const locale = useLocale();
    const setLocale = useSetLocale();

    const getNameForLocale = (locale: string): string => {
        const language = languages.find(language => language.locale === locale);
        return language ? language.name : '';
    };

    const changeLocale = (locale: string) => (): void => {
        setLocale(locale);
        setAnchorEl(null);
    };

    const handleLanguageClick = (event: MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    return (
        <Root component="span">
            <Button
                sx={{mr:2}}
                color="inherit"
                aria-controls="simple-menu"
                aria-label=""
                aria-haspopup="true"
                onClick={handleLanguageClick}
                startIcon={<LanguageIcon />}
                endIcon={<ExpandMoreIcon fontSize="small" />}
            >
                {getNameForLocale(locale)}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {languages.map(language => (
                    <MenuItem
                        key={language.locale}
                        onClick={changeLocale(language.locale)}
                        selected={language.locale === locale}
                    >
                        {language.name}
                    </MenuItem>
                ))}
            </Menu>
        </Root>
    );
};

const PREFIX = 'RaLocalesMenuButton';

export const LocalesMenuButtonClasses = {};

const Root = styled(Box, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({});

export interface LocalesMenuButtonProps {
    languages?: { locale: string; name: string }[];
}