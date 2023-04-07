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
import * as React from 'react';
import { useState } from 'react';
import {
    useTranslate,
    useRedirect,
    Notification,
} from 'react-admin';
import { Field, withTypes } from 'react-final-form';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import SentIcon from '../assets/icon_sent';
import { POST } from '../services/HttpService';
// ----------------------------------------------------------------------
import AlertWithChild from './AlertWithChild';
import { LoginWrapper, renderInput } from './LoginWrapper';
import { OdooJsonResponse } from './OdooJsonResponse';
import ThemeWrapper from './ThemeWrapper';

const StyledForm = styled('form')(({ theme }) => ({}));

interface FormValues {
    username?: string;
}

const { Form } = withTypes<FormValues>();

const LoginWoPassword = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [pageError, setpageError] = useState(searchParams.get('error'));
    const [sent, setStatus] = useState(false);
    const [email, setEmail] = useState('');
    const handleClick = () => {
        setStatus(!sent);
        setpageError(searchParams.get('error'));
    };

    const translate = useTranslate();
    const redirect = useRedirect();
    
    
    

    const handleSubmit = async (auth: FormValues) => {
        setLoading(true);
        const data = {
            jsonrpc: '2.0',
            params: {
                username: auth.username,
            },
        };
        const res = (await POST(
            `/api/send_autologin_link`,
            data
        )) as OdooJsonResponse;
        if (res && res.status === 'failed' && res.error) {
            setpageError(`${res.error}`)
        } else {
            setStatus(true);
            setEmail(auth.username);
        }
        setLoading(false);
    };

    const validate = (values: FormValues) => {
        const errors: FormValues = {};
        if (!values.username) {
            errors.username = translate('ra.validation.required');
        }
        return errors;
    };

    return (
        <LoginWrapper>
            {!sent ? (
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
                                        {translate(
                                            'resources.login.sign_in_without_password'
                                        )}
                                    </Typography>
                                    <Typography
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        {translate(
                                            'resources.login.sign_in_info'
                                        )}
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
                                    // @ts-ignore
                                    component={renderInput}
                                    label="Email Address"
                                    type="email"
                                    disabled={loading}
                                />

                                <LoadingButton
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    disabled={loading}
                                    fullWidth
                                    size="large"
                                >
                                    {loading && (
                                        <CircularProgress
                                            size={25}
                                            thickness={2}
                                        />
                                    )}
                                    {translate(
                                        'resources.login.sign_in_with_magic_link'
                                    )}
                                </LoadingButton>
                                <AlertWithChild>
                                    {translate(
                                        'resources.login.alert_msg_info'
                                    )}
                                    <Link
                                        sx={{ padding: 1 }}
                                        component={RouterLink}
                                        variant="subtitle2"
                                        to={'/login'}
                                    >
                                        {translate(
                                            'resources.login.sign_in_manually_instead'
                                        )}
                                    </Link>
                                </AlertWithChild>
                            </Stack>
                            <Notification />
                        </StyledForm>
                    )}
                />
            ) : (
                <>
                    <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
                        <Box>
                            <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />
                            <Typography
                                align="center"
                                variant="h4"
                                gutterBottom
                            >
                                {translate('resources.login.sent_magic_link')}
                            </Typography>
                            <Typography
                                align="center"
                                sx={{ color: 'text.secondary' }}
                            >
                                {translate(
                                    'resources.login.magic_link_sent_preinfo'
                                )}
                                &nbsp;
                                <strong>{email}</strong>
                                &nbsp;
                                {translate(
                                    'resources.login.magic_link_sent_postinfo'
                                )}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
                        <Box>
                            <Typography
                                align="center"
                                sx={{ color: 'text.secondary' }}
                            >
                                {translate(
                                    'resources.login.wrong_email_address'
                                )}
                                &nbsp;
                                <Link
                                    component={RouterLink}
                                    variant="subtitle2"
                                    to={'/login-without-password'}
                                    onClick={handleClick}
                                >
                                    {translate(
                                        'resources.login.reenter_email_address'
                                    )}
                                </Link>
                            </Typography>
                        </Box>
                    </Stack>
                </>
            )}
        </LoginWrapper>
    );
};

// th righte theme
const LoginWithoutPassword = () => {
    return (
        <ThemeWrapper>
            <LoginWoPassword />
        </ThemeWrapper>
    );
};

export default LoginWithoutPassword;
