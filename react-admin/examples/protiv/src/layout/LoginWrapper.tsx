import { Card, Container, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { MHidden } from '../components/@material-extend';
import Page from '../components/Page';
import AuthLayout from './AuthLayout';
import LoginHeroImage from '../assets/illustration_login.png';
import { NUMBER } from '../utils/Constants/MagicNumber';

const SectionStyle = styled(Card)(({ theme }) => ({
    width: '100%',
    maxWidth: 464,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(NUMBER.TWO, NUMBER.ZERO, NUMBER.TWO, NUMBER.TWO),
}));

export const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

export const renderInput = ({
    meta: { touched, error } = { touched: false, error: undefined },
    input: { ...inputProps },
    ...props
}) => (
    <TextField
        error={!!(touched && error)}
        helperText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />
);

export const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(NUMBER.TWELVE, 0),
}));

export const LoginWrapper = (props: any) => {
    return (
        <RootStyle title="Login | Protiv">
            <AuthLayout />
            <MHidden width="mdDown">
                <SectionStyle>
                    <Typography variant="h4" sx={{ px: 5, mt: 10, mb: 5 }}>
                        Hi, Welcome Back
                    </Typography>                    
                    <img
                        src={LoginHeroImage}                        
                        alt="login"
                        style={{ width: '80%' }}
                    />
                </SectionStyle>
            </MHidden>
            <Container maxWidth="sm">
                <ContentStyle>
                    {React.Children.map(props.children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, props);
                        }
                        return child;
                    })}
                </ContentStyle>
            </Container>
        </RootStyle>
    );
};
