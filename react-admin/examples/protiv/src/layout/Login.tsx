import { LoadingButton } from '@mui/lab';
import {
    Box,
    CircularProgress,
    Link,
    Stack,
    Typography,
    Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';
import {
    Notification,
    useLogin,
    useNotify,
    useTranslate,
    useRedirect,
} from 'react-admin';
import { Field, withTypes } from 'react-final-form';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AlertWithChild from './AlertWithChild';
import { LoginWrapper, renderInput } from './LoginWrapper';
import ThemeWrapper from './ThemeWrapper';

// ----------------------------------------------------------------------
const StyledForm = styled('form')(({ theme }) => ({}));

interface FormValues {
    username?: string;
    password?: string;
}

const { Form } = withTypes<FormValues>();

const Login = () => {
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const notify = useNotify();
    const redirect = useRedirect();

    const login = useLogin();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pageError = searchParams.get('error');

    const handleSubmit = (auth: FormValues) => {
        setLoading(true);
        login(auth, location.state ? location.state.nextPathname : '/').catch(
            (error: Error) => {
                setLoading(false);
                notify(
                    typeof error === 'string'
                        ? error
                        : typeof error === 'undefined' || !error.message
                        ? 'ra.auth.sign_in_error'
                        : error.message,
                    {
                        type: 'warning',
                        messageArgs: {
                            _:
                                typeof error === 'string'
                                    ? error
                                    : error && error.message
                                    ? error.message
                                    : undefined,
                        },
                    }
                );
            }
        );
    };

    const validate = (values: FormValues) => {
        const errors: FormValues = {};
        if (!values.username) {
            errors.username = translate('ra.validation.required');
        }
        if (!values.password) {
            errors.password = translate('ra.validation.required');
        }
        return errors;
    };

    return (
        <LoginWrapper>
            <Form
                onSubmit={handleSubmit}
                validate={validate}
                render={({ handleSubmit }) => (
                    <StyledForm onSubmit={handleSubmit} noValidate>
                        <Stack
                            direction="row"
                            alignItems="center"
                            sx={{ mb: 5 }}
                        >
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h4" gutterBottom>
                                    Sign in to Protiv
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>
                                    Enter your details below.
                                </Typography>
                            </Box>
                        </Stack>
                        {pageError && (
                            <Alert
                                onClose={() => redirect(location.hash)}
                                sx={{ mb: 2 }}
                                severity="error"
                            >
                                {pageError}
                            </Alert>
                        )}
                        <Stack spacing={3}>
                            <Field
                                autoFocus
                                fullWidth
                                name="username"
                                autoComplete="new-email" 
                                // @ts-ignore
                                component={renderInput}
                                label="Email Address"
                                type="email"
                                disabled={loading}
                            />
                            <Field
                                name="password"
                                fullWidth
                                autoComplete="new-password" 
                                // @ts-ignore
                                component={renderInput}
                                label={translate('ra.auth.password')}
                                type="password"
                                disabled={loading}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-end"
                            sx={{ my: 2 }}
                        >
                            <Link
                                component={RouterLink}
                                variant="subtitle2"
                                to={'/forgot-password'}
                            >
                                Forgot password?
                            </Link>
                        </Stack>
                        <Stack spacing={3}>
                            <LoadingButton
                                variant="contained"
                                type="submit"
                                color="primary"
                                disabled={loading}
                                fullWidth
                                size="large"
                            >
                                {loading && (
                                    <CircularProgress size={25} thickness={2} />
                                )}
                                {translate('ra.auth.sign_in')}
                            </LoadingButton>
                            <AlertWithChild>
                                {translate('resources.login.you_can')}
                                <Link
                                    sx={{ padding: 1 }}
                                    component={RouterLink}
                                    variant="subtitle2"
                                    to={'/login-without-password'}
                                >
                                    {translate(
                                        'resources.login.sign_in_using_magic_link'
                                    )}
                                </Link>
                                {translate('resources.login.sign_in_info')}
                            </AlertWithChild>
                        </Stack>
                        <Notification />
                    </StyledForm>
                )}
            />
        </LoginWrapper>
    );
};

Login.propTypes = {
    authProvider: PropTypes.func,
    previousRoute: PropTypes.string,
};

// We need to put the ThemeProvider decoration in another component

// the right theme
const LoginWithTheme = (props: any) => {
    return (
        <ThemeWrapper>
            <Login />
        </ThemeWrapper>
    );
};
export default LoginWithTheme;
