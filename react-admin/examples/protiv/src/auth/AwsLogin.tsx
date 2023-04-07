import { Auth } from '@aws-amplify/auth';
import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import {
    Box, Stack,
    Typography
} from '@mui/material';
import { I18n, Amplify } from 'aws-amplify';
import { useEffect } from 'react';
import { LoginWrapper } from '../layout/LoginWrapper';
import ThemeWrapper from '../layout/ThemeWrapper';
import '@aws-amplify/ui-react/styles.css';
import { useLogin } from 'react-admin';
import awsExports from '../aws-exports';
import './styles.css';
import './custom.css';
import { useLocation } from 'react-router';
import { formatUsername }  from './FormatUsername';
Amplify.configure({...awsExports, authenticationFlowType:'USER_PASSWORD_AUTH'});
I18n.putVocabulariesForLanguage('en', {
});

const SignInHeader = ()=>{
    return (
        <Stack
            direction='row'
            alignItems='center'
            sx={{pt:2,pl:2,pr:2 }}
        >
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant='h5' className={'amplify-heading amplify-heading--5'} gutterBottom >
                    Sign in to Protiv
                </Typography>
            </Box>
        </Stack>
    );
};
const ResetPasswordHeader = ()=>{
    return (
        <Stack
            direction='row'
            alignItems='center'
            sx={{pt:2,pl:0,pr:2 }}
        >
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant='h5' className={'amplify-heading amplify-heading--5'} gutterBottom >
                        Reset your password
                    </Typography>
                </Box>
        </Stack>
    );
};

const components = {
    SignIn: {
      Header: SignInHeader,
    },
    ResetPassword: {
        Header:ResetPasswordHeader
    }
  }
  const formFields = {
    signIn: {
        username: {
            placeholder:'Email or mobile'
        },
      },
      resetPassword: {
        username: {
          placeholder:'Email or mobile'
        },
      }
      };
  
const AwsLogin = (props: any) => {
    const login = useLogin();
    const { user, route, signOut } = useAuthenticator(context => [context.user, context.route]);

    const search = useLocation().search;
    const redirectUrl = new URLSearchParams(search).get('redirect');
    useEffect(()=>{
        if(route==='authenticated'){
            //call Odoo login
            console.log('User authenticated using cognito, try to login to Odoo');
            Auth.currentSession().then((cognitoUserSession)=>{
                const accessToken = cognitoUserSession.getAccessToken();
                const jwt = accessToken.getJwtToken();
                //You can print them to see the full objects
                console.log('cognitoUser',cognitoUserSession);
                console.log(`myAccessToken: ${JSON.stringify(accessToken)}`);
                console.log(`myJwt: ${jwt}`);
                const username = accessToken.payload.username;                
                console.log(`sub: ${accessToken.payload.sub}`);
                console.log(`sending username : ${username}`);
                console.log('About todo login in odoo with token');
                login({username:username,password:jwt},redirectUrl).then(()=>{
                    console.log('Login in odoo success');
                }).catch((err)=>{
                    console.log('Login failed in odoo',err);
                    signOut();
                })
            });
        }
    },[signOut, login, user, route, redirectUrl])
    
    const getLocale = () => {
        return new URLSearchParams(search).get('locale')||'en-us'
    };
    const services = {
        handleForgotPassword(username) {
            username = formatUsername(username, {locale:getLocale()})
            return new Promise((resolve, reject)=>{
                Auth.forgotPassword(username).then(response=>{
                    resolve(response)
                }).catch(error=>{
                    reject(error.message);
                });
            });
        },
        handleSignIn({username, password}) {
            username = formatUsername(username, {locale:getLocale()});
            return Auth.signIn(username, password);
        },
        handleForgotPasswordSubmit(formData) {
            return new Promise((resolve, reject)=>{
                let { username, code, password } = formData;
                username = formatUsername(username, {locale:getLocale()})
                Auth.forgotPasswordSubmit(username, code, password).then(response=>{
                    resolve(response);
                }).catch(error=>{
                    if(error.message.indexOf("Value at 'password' failed to satisfy constraint")>0){
                        reject('Password must be atleast 6 characters long.');
                    }else{
                        reject(error.message);
                    }
                });
            })
        },
    };
    
    return (
        <>
            <Authenticator services={services as any} loginMechanisms={['username']} components={components} hideSignUp={true} formFields={formFields}/>
        </>
    );
};

const Login = (props: any) => {
    return (
        <LoginWrapper>
            <AwsLogin {...props}/>
        </LoginWrapper>
    );
};


const LoginWithTheme = (props: any) => {
    return (
        <ThemeWrapper>
            <Login {...props}/>
        </ThemeWrapper>
    );
};
export default LoginWithTheme;
