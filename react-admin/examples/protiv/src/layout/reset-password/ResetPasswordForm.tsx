import { LoadingButton } from '@mui/lab';
import { Box, CircularProgress, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import {
    Notification,
    required,
    useNotify,
} from 'react-admin';
import { Field, withTypes } from 'react-final-form';
import { useLocation } from 'react-router-dom';
import { POST } from '../../services/HttpService';
import { OdooJsonResponse } from '../OdooJsonResponse';

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
    login?: string;
}

const { Form } = withTypes<FormValues>();

type ResetPasswordFormProps = {
    onSent: VoidFunction;
    onGetEmail: (value: string) => void;
};

const ResetPasswordForm = ({ onSent, onGetEmail }: ResetPasswordFormProps) => {
    const search = useLocation().search;
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (auth: FormValues) => {
        setLoading(true);
        const db = new URLSearchParams(search).get('db');
        const data = {
            jsonrpc: '2.0',
            params: {
                db: db,
                login: auth.login,
                reset_password_enabled: true,
            },
        };
        const res = (await POST(
            '/api/reset-password',
            data
        )) as OdooJsonResponse;
        if (res && res.status === 'failed' && res.error) {
            notify(`${res.error}`);
        } else {
            console.log('Reset Password email has been sent');
            onSent();
            onGetEmail(auth.login);
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
                            <Field
                                name="login"
                                fullWidth
                                // @ts-ignore
                                component={renderInput}
                                label="Email Address"
                                type="email"
                                validate={required('Email address is required')}
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

export default ResetPasswordForm;
