import { LoadingButton } from '@mui/lab';
import {
    Button,
    Typography
} from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from 'react-query';

import {
    useGetIdentity,
    useLogout,
    useNotify,
    useRedirect
} from 'react-admin';
import { useLocation } from 'react-router-dom';
import { PageWitoutLayout } from '../layout/reset-password/ResetPassword';

import OdooAuth from './OdooAuth';
import { NUMBER } from '../utils/Constants/MagicNumber';

export const SignupVerifyEmailPhoneNumberForm = (props:any) => {
    const signup_type = 'verify';
    const redirectTo = useRedirect();
    const logout = useLogout();
    const search = useLocation().search;
    const notify = useNotify();
    const db = new URLSearchParams(search).get('db');
    const token = new URLSearchParams(search).get('token');
    const attribute = new URLSearchParams(search).get('attribute');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    console.log('Current location ',search);
    const redirectLogin = `/login?redirect=/accept-invite${encodeURIComponent(search)}`

    console.log('Verify username');
    const {data} = props;
    const {loaded, error:identityError, identity} = useGetIdentity();
    const queryClient = useQueryClient();
    const [loadingAcceptInvite, setLoadingAcceptInvite] = useState(false);

    const handleAccept = useCallback(()=>{
        setLoadingAcceptInvite(true);
        OdooAuth.acceptInvite(db, token).then((res)=>{
            setLoadingAcceptInvite(false);
            console.log('Accept Invite done', res);
            setStatus('done')
            queryClient.invalidateQueries('getIdentity')
            setTimeout(()=>{
                redirectTo('/')
            },NUMBER.ONE_THOUSAND);
        }).catch((err)=>{
            setLoadingAcceptInvite(false);
            console.log('Error in Accept Invite',err);
            setError(err.error);
            setStatus('error')
            notify(err.error);
        })
    },[db, token, setStatus, redirectTo, setError, notify, setLoadingAcceptInvite, queryClient])
    
    useEffect(() => {
        console.log('Called effect ', db, token, attribute, signup_type);
        if(loaded && identityError){
            setStatus('login');
        }
        else if(loaded && identity) {
            if(identity.uid===data.user_id){
                setStatus('showAccept')
            } else{
                console.log('Current logged in user ',identity.uid);
                console.log('Invite user ',data, data.user_id);
                setStatus('invalidUser');
                setError('Invalid invite. Invite is not for the current logged in user. Please login with the protiv account to which invite is sent.');
            };
        };
    },[db, token, attribute, signup_type, setStatus, notify, redirectTo, loaded, data, identity, redirectLogin, identityError])    
    return (
        <>
        {status==='showAccept'&&
            <Typography variant="body2" paragraph>
                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={loadingAcceptInvite}
                    sx={{ mt: 2, mb: 2 }}
                    onClick={handleAccept}>
                    Accept Invite
                </LoadingButton>
            </Typography>
        }
        {status==='done'&&
            <Typography variant="body2" paragraph>
                Completed. Redirecting ...
            </Typography>
        }
        {status==='login'&&
            <>
                <>Please login with your protiv account to accept invite.</>
                <Button 
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={()=>{
                        redirectTo(redirectLogin)
                    }}>
                    Login
                </Button>
            </>
        }
        {status==='invalidUser'&&
            <>
                <>{error}</>
                <Button 
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={()=>{
                        logout({}, redirectLogin)
                    }}>
                    Login with different user
                </Button>
            </>
        }
        {status==='error'&&
            <>
                <>{error}</>
            </>
        }
        </>
    );

};
const SignupVerifyEmailPhoneNumber = () => {

    
    return (
        <PageWitoutLayout>
            <SignupVerifyEmailPhoneNumberForm />
        </PageWitoutLayout>
    );
};

export default SignupVerifyEmailPhoneNumber;
