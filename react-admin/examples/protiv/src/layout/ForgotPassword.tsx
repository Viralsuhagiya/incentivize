import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useState } from 'react';
import {
    Notification,
    useNotify,
    useRedirect,
    useTranslate,
    required,
} from 'react-admin';
import { Field, withTypes } from 'react-final-form';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { PATH_AUTH } from '../routes/paths';
import { POST } from '../services/HttpService';
import { PageWitoutLayout } from './reset-password/ResetPassword';
import { OdooJsonResponse } from './OdooJsonResponse';

// ----------------------------------------------------------------------

const StyledForm = styled('form')(({ theme }) => ({}));

const renderInput = ({
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

interface FormValues {
    username?: string;
    password?: string;
    confirm_password?: string;
    email?: string;
};

const { Form } = withTypes<FormValues>();

const ForgotPasswordForm = () => {
    const search = useLocation().search;
    const notify = useNotify();
    const redirectTo = useRedirect();
    const [loading, setLoading] = useState(false);
    const translate = useTranslate();
    const [isEmailRequired, setisEmailRequired] = useState(false);
    const handleSubmit = async (auth: FormValues) => {
        setLoading(true);
        const db = new URLSearchParams(search).get('db');
        const token = new URLSearchParams(search).get('token');
        const employeeToken = new URLSearchParams(search).get('employeeToken');
        const data = {
            jsonrpc: '2.0',
            params: {
                db: db,
                token: token,
                confirm_password: auth.confirm_password,
                password: auth.password,
                employeeToken:employeeToken,
                email:auth.email
            },
        };
        var api = employeeToken ?`/api/createUser` :`/api/reset-password`
        const res = (await POST(
            api,
            data
        )) as OdooJsonResponse;
        if (res && res.status === 'failed' && res.error) {
            notify(`>>${res.error}>>`);
        }
        else if (res && res.message === 'Email is Required'){
            setisEmailRequired(true)
        } 
        else {
            localStorage.setItem('loginUser', JSON.stringify(res.session_info));
            redirectTo('/');
        }
        setLoading(false);
    };

    return (
        <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Form
                onSubmit={handleSubmit}
                render={({ handleSubmit }) => (
                    <StyledForm onSubmit={handleSubmit}>
                        <Stack
                            spacing={3}
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ my: 2 }}
                        >     
                        {isEmailRequired && (
                            <Field
                                name="email"
                                fullWidth
                                label="Email"
                                type="email"
                                // @ts-ignore
                                component={renderInput}
                                validate={required('Email is required')}
                                disabled={loading}
                            />)}
                            <Field
                                name="password"
                                fullWidth
                                // @ts-ignore
                                component={renderInput}
                                label={translate('ra.auth.password')}
                                type="password"
                                disabled={loading}
                            />
                            <Field
                                name="confirm_password"
                                fullWidth
                                // @ts-ignore
                                component={renderInput}
                                label="Confirm Password"
                                type="password"
                                disabled={loading}
                            />
                        </Stack>
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
                            Confirm
                        </LoadingButton>
                        <Notification />
                    </StyledForm>
                )}
            />
        </Box>
    );
};

const ForgotPassword = () => {
    return (
        <PageWitoutLayout>
            <>
                <Typography variant="h3" paragraph>
                    Set Your Password
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Typography>
                <ForgotPasswordForm />
                <Button
                    fullWidth
                    size="large"
                    component={RouterLink}
                    to={PATH_AUTH.login}
                    sx={{ mt: 1 }}
                >
                    Login
                </Button>
            </>
        </PageWitoutLayout>
    );
};

export default ForgotPassword;
