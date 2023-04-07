
import { styled } from '@mui/material/styles';
import ContentAdd from '@mui/icons-material/Add';
import { Fab, useMediaQuery, Theme, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import classnames from 'classnames';
import { useMemo } from 'react';
import { sanitizeButtonRestProps, useTranslate } from 'react-admin';

export const CreateButtonClasses = {
    floating: `RaCreateButton-floating`,
};

const StyledFab = styled(Fab, { name: 'RaCreateButton' })(({ theme }) => ({
    [`&.${CreateButtonClasses.floating}`]: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 80,
        left: 'auto',
        position: 'fixed',
        zIndex: 1000,
    },
}));
const defaultIcon = <ContentAdd />
export const CreateButton =  (props) => {
    const {
        className,
        path,
        icon = defaultIcon,
        label = 'ra.action.create',
        scrollToTop = true,
        variant,
        ...rest
    } = props;

    const translate = useTranslate();

    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('md')
    );
    const location = useMemo(
        () => ({
            pathname: path,
            state: { _scrollToTop: scrollToTop },
        }),
        [path, scrollToTop]
    );
    return isSmall ? (
        <StyledFab
            component={Link}
            color="primary"
            className={classnames(CreateButtonClasses.floating, className)}
            to={location}
            aria-label={label && translate(label)}
            {...sanitizeButtonRestProps(rest)}
        >
            {icon}
        </StyledFab>
    ) : (
        <Button
            component={Link}
            to={location}
            className={className}
            label={label}
            variant={variant}
            {...(rest as any)}
        >
            {translate(label)}
        </Button>
    );    
};
