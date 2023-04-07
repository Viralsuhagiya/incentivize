import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Stack,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useState } from 'react';
import {
    Notification,
    PasswordInput,
    required,
    TextInput,
    useRedirect,
    useNotify,
    useLogin
} from 'react-admin';
import { withTypes } from 'react-final-form';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import Page from '../components/Page';
import { PATH_AUTH } from '../routes/paths';

import { Auth } from '@aws-amplify/auth';
import { useAuthenticator } from '@aws-amplify/ui-react';
import OdooAuth from './OdooAuth';
import { SignupVerifyEmailPhoneNumberForm } from './SignupVerifyEmailPhoneNumber';
import ThemeWrapper from '../layout/ThemeWrapper';
import { AcceptTermsAndConditions } from '../resources/onboard/AcceptTermsLine';
import _ from 'lodash';
import { PhoneInput } from '../components/fields/PhoneInput';
import { EmailInput } from '../components/fields';
import { NUMBER } from '../utils/Constants/MagicNumber';
// ----------------------------------------------------------------------


const StyledForm = styled('form')(({ theme }) => ({}));


interface FormValues {
    username?: string;
    password?: string;
    confirm_password?: string;
    email?: string;
}

const { Form } = withTypes<FormValues>();

const SetPasswordForm = ({signup_type, db, token, attribute, data}) => {
    const [terms, setTerms] = useState(false);
    const notify = useNotify();
    const login = useLogin();
    const { signOut } = useAuthenticator(context => []);
    const [loading, setLoading] = useState(false);

    const validate = values => {
        const errors:{email?,mobile?, password?, confirm_password?} = {};
        if (!values.email && !values.mobile) {
            errors.email = ' ';
            errors.mobile = 'Email or mobile number is required';
        }
        if(values.password && values.confirm_password && values.password!==values.confirm_password){
            errors.confirm_password = 'Password does not match'
        }
        return errors;
    };

    const handleSubmitform = async (auth: FormValues) => {
        setLoading(true);
        OdooAuth.signupSubmit(db, token, signup_type, auth).then((res)=>{
            if(res && (res as any).login){
                const username = (res as any).login
                Auth.signIn(username, auth.password).then((signInRes)=>{
                    console.log('AWS Signin res', signInRes);
                    Auth.currentSession().then((cognitoUserSession)=>{
                        const accessToken = cognitoUserSession.getAccessToken()
                        const jwt = accessToken.getJwtToken()
                        //You can print them to see the full objects
                        console.log('cognitoUser',cognitoUserSession);
                        console.log(`myAccessToken: ${JSON.stringify(accessToken)}`)
                        console.log(`myJwt: ${jwt}`)
                        console.log(`sub: ${accessToken.payload.sub}`)
                        console.log(`sending username : ${username}`)
                        console.log('About todo login in odoo with token')
                        login({username:username,password:jwt}).then(()=>{
                            console.log('Login in odoo success');
                            setLoading(false);
                        }).catch((err)=>{
                            setLoading(false);
                            console.log('Login failed in odoo',err);
                            signOut();
                        })
                    });
                }).catch((err)=>{
                    console.log('Error in signin to aws',err);
                    notify('Unable to login');
                    setLoading(false);
                })
            }            
        }).catch((err)=>{
            setLoading(false);
            notify(`>>${err.error}>>`);
        })
    };
    const ValidatePassword = (password) => {
        if(!password || password.length<NUMBER.SIX){
            return 'Minimum length 6 characters';
        } else {
            const spaceRegEx = /^[\S]+.*[\S]+$/;
            if (!spaceRegEx.test(password)) {
                return 'Password cannot start and end with space'
            }            
        }
    }
    const [formDisabled, setFormDisabled] = useState(true);
    React.useEffect(()=>{
        setTimeout(()=>{
            //this is to bypass the chrom auto fill/auto complete issue            
            setFormDisabled(false)    
        },NUMBER.FIFE_HUNDRED)
    },[setFormDisabled,data])
    return (
        <Box className='signup-form-accept-invite' sx={{ maxWidth: 480, mx: 'auto' }}>
            <Form
                onSubmit={handleSubmitform}
                initialValues={_.pick(data, ['first_name','last_name', 'email', 'mobile'])}
                validate={validate}
                autoComplete="off"
                render={({ handleSubmit }) => (
                    <StyledForm onSubmit={handleSubmit}>
                        <Stack
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Stack direction={{xs:'column',sm:'row'}} sx={{m:0,p:0, width:'100%'}}>
                            <TextInput 
                                source="first_name"
                                disabled={formDisabled}
                                fullWidth
                                sx={{pr:0.5}}
                                validate={[required()]} />
                            <TextInput 
                                source="last_name"
                                disabled={formDisabled}
                                fullWidth
                                sx={{pl:0.5}}
                                validate={[required()]} />
                            </Stack>
                            <EmailInput 
                                source="email"
                                disabled={formDisabled || !_.isEmpty(data.email)}
                                autoComplete="off"
                                fullWidth/>
                            <PhoneInput source="mobile"
                                disabled={formDisabled || !_.isEmpty(data.mobile)}
                                autoComplete="off"
                                fullWidth/>
                            <PasswordInput source="password" disabled={formDisabled} validate={[required(), ValidatePassword]} fullWidth/>
                            <PasswordInput source="confirm_password" disabled={formDisabled} validate={[required()]} fullWidth/>
                            <AcceptTermsAndConditions
                                    label='Agree with protiv end user license agreement' 
                                    type="eula"
                                    name="termsEULA" 
                                    value={terms} 
                                    setValue={setTerms}/>

                        </Stack>
                        <LoadingButton
                            variant="contained"
                            type="submit"
                            color="primary"
                            disabled={loading||!terms}
                            fullWidth
                            size="large"
                            sx={{mt:1}}
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

const RootLayoutStyle = styled(Page)(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(NUMBER.FOUR, 0),
}));

export const PageWitoutLayout = ({ children }: any) => {
    return (
        <ThemeWrapper>
            <RootLayoutStyle title="Register | Protiv">
                <Outlet />
                <Container>
                    <Box sx={{ maxWidth: 480, mx: 'auto' }}>{children}</Box>
                </Container>
            </RootLayoutStyle>
        </ThemeWrapper>
    );
};

const SignupAcceptInvite = ({signup_type}) => {
    const search = useLocation().search;
    const db = new URLSearchParams(search).get('db');
    const token = new URLSearchParams(search).get('token');
    const attribute = new URLSearchParams(search).get('attribute');
    const [status, setStatus] = useState('');
    const [data, setData] = useState<{email?, mobile?, company_name?}>({});
    const redirectTo = useRedirect();
    React.useEffect(() => {
        if(db && token && attribute && setStatus) {
            OdooAuth.verifyToken(db, token, attribute).then((res)=>{
                console.log('Invite Verify attribute done', res);
                setData((res as any).data);
                setStatus((res as any).next);
            }).catch((err)=>{
                console.log('Error in signin to aws',err);
                setStatus('invalid-token');
            })
        }
    },[db, token, attribute, setStatus]);
        
    return (
        <PageWitoutLayout>
            <Stack className='accept-invite-signup-logo' direction="row" justifyContent={'center'}  sx={{m:3, mt:0}}>
                {/* <Logo /> */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <g fill="none">
                    <path d="M44.68 18.376c0-.916.165-1.765.498-2.548a6.277 6.277 0 0 1 1.374-2.037 6.482 6.482 0 0 1 2.05-1.363 6.383 6.383 0 0 1 2.524-.498c.9 0 1.742.17 2.525.508.783.341 1.462.8 2.037 1.374a6.511 6.511 0 0 1 1.374 2.037c.34.783.508 1.625.508 2.525 0 .9-.17 1.741-.508 2.524a6.585 6.585 0 0 1-1.374 2.04 6.513 6.513 0 0 1-2.037 1.374 6.252 6.252 0 0 1-2.525.508c-.679 0-1.363-.138-2.05-.415-.687-.277-1.238-.604-1.648-.983v4.197c0 .378-.133.703-.402.972a1.325 1.325 0 0 1-.972.402c-.378 0-.703-.133-.972-.402a1.325 1.325 0 0 1-.402-.972v-9.243zm2.748 0c0 .506.098.983.295 1.433.197.45.464.841.794 1.174.333.333.724.597 1.174.794.45.197.927.295 1.433.295s.985-.098 1.435-.295c.45-.197.841-.464 1.174-.794.333-.333.597-.721.794-1.174.197-.45.295-.93.295-1.433 0-.506-.098-.982-.295-1.435a3.84 3.84 0 0 0-.794-1.174 3.761 3.761 0 0 0-1.174-.794 3.543 3.543 0 0 0-1.435-.295 3.53 3.53 0 0 0-1.433.295c-.45.197-.841.464-1.174.794a3.793 3.793 0 0 0-.794 1.174c-.197.45-.295.93-.295 1.435zM63.806 12.448c.362 0 .685.133.959.402.277.27.415.594.415.972v.19c.205-.286.488-.557.842-.818.357-.261.737-.485 1.15-.677.41-.189.82-.34 1.233-.45a4.39 4.39 0 0 1 1.113-.165c.41 0 .759.141 1.044.426.285.285.426.631.426 1.044 0 .41-.141.754-.426 1.03a1.44 1.44 0 0 1-1.044.416c-.554 0-1.087.107-1.6.32a4.841 4.841 0 0 0-1.388.876c-.41.373-.737.801-.982 1.291a3.45 3.45 0 0 0-.368 1.563v4.053c0 .378-.133.703-.402.972a1.325 1.325 0 0 1-.972.402c-.378 0-.703-.133-.972-.402a1.32 1.32 0 0 1-.402-.972V13.82c0-.379.133-.703.402-.972.27-.264.594-.4.972-.4zM74.426 18.352a6.35 6.35 0 0 1 1.896-4.561 6.629 6.629 0 0 1 2.05-1.375 6.254 6.254 0 0 1 2.525-.508c.9 0 1.741.17 2.524.508a6.59 6.59 0 0 1 2.04 1.374 6.55 6.55 0 0 1 1.374 2.037c.338.783.508 1.625.508 2.525a6.3 6.3 0 0 1-.508 2.524 6.578 6.578 0 0 1-1.374 2.04 6.5 6.5 0 0 1-2.04 1.374 6.25 6.25 0 0 1-2.524.508c-.9 0-1.742-.17-2.525-.508a6.677 6.677 0 0 1-2.05-1.374 6.435 6.435 0 0 1-1.387-2.04 6.29 6.29 0 0 1-.509-2.524zm2.75 0c0 .506.099.982.299 1.435.197.45.463.841.796 1.174a3.78 3.78 0 0 0 1.177.794c.453.197.932.295 1.438.295.509 0 .988-.098 1.438-.295a3.816 3.816 0 0 0 1.177-.794c.332-.333.599-.724.796-1.174.197-.45.298-.93.298-1.435 0-.506-.098-.983-.298-1.436-.2-.45-.464-.841-.796-1.174a3.77 3.77 0 0 0-1.177-.793 3.564 3.564 0 0 0-1.438-.296c-.509 0-.988.098-1.438.296a3.825 3.825 0 0 0-1.177.793 3.807 3.807 0 0 0-.796 1.174c-.2.45-.298.93-.298 1.436zM93.46 9.082c0-.378.133-.703.401-.972.27-.269.592-.402.972-.402.378 0 .704.133.972.402.269.27.402.594.402.972v3.366h1.398c.378 0 .704.133.972.402.269.27.402.594.402.972s-.136.703-.402.972a1.325 1.325 0 0 1-.972.402h-1.398V22.9c0 .394-.128.727-.38.996-.254.269-.578.402-.972.402s-.727-.133-.996-.402a1.35 1.35 0 0 1-.402-.996v-7.704c-.381 0-.703-.133-.972-.402a1.326 1.326 0 0 1-.402-.972c0-.378.133-.703.402-.972s.591-.402.972-.402V9.082h.002zM103.533 8.444c0-.506.165-.924.498-1.257a1.643 1.643 0 0 1 1.209-.498c.506 0 .924.165 1.257.498.333.333.498.75.498 1.257 0 .474-.165.876-.498 1.209-.333.332-.751.497-1.257.497-.474 0-.876-.165-1.209-.497a1.653 1.653 0 0 1-.498-1.21zm.309 5.405c0-.394.133-.727.402-.996.27-.269.6-.402.996-.402.397 0 .727.133.996.402.269.27.402.602.402.996v9.054c0 .394-.133.727-.402.996a1.353 1.353 0 0 1-.996.402c-.394 0-.727-.133-.996-.402a1.35 1.35 0 0 1-.402-.996v-9.054zM119.343 13.327c.269-.584.695-.876 1.28-.876.394 0 .725.14.986.426a1.4 1.4 0 0 1 .391.972c0 .189-.04.388-.12.593l-3.743 8.535c-.064.14-.131.293-.203.45-.072.157-.17.309-.295.45a1.377 1.377 0 0 1-.498.343c-.206.088-.482.13-.828.13-.334 0-.602-.042-.808-.13a1.266 1.266 0 0 1-.484-.343 1.955 1.955 0 0 1-.285-.45c-.072-.157-.139-.31-.202-.45l-3.744-8.58a1.849 1.849 0 0 1-.096-.32 1.513 1.513 0 0 1-.024-.271c0-.362.13-.68.391-.948a1.31 1.31 0 0 1 .983-.402c.365 0 .64.082.83.247.19.166.347.384.475.653l2.988 6.873 3.006-6.902z" fill="#212B36"/>
                    <path d="M18.645 30.49a2.86 2.86 0 1 1 0 5.72 2.86 2.86 0 0 1 0-5.72zm4.367-5.032 3.08 1.848a1.802 1.802 0 0 1 .619 2.472 1.802 1.802 0 0 1-2.471.617l-3.081-1.848a3.992 3.992 0 0 0-4.738.49l-5.804 5.368c-.347.32-.786.477-1.223.477a1.8 1.8 0 0 1-1.222-3.123l5.805-5.369c2.455-2.268 6.17-2.652 9.035-.932zM4.182 9.023l5.369 5.805c2.269 2.455 2.652 6.17.932 9.035l-1.848 3.08a1.8 1.8 0 0 1-2.471.619 1.802 1.802 0 0 1-.618-2.472l1.848-3.08c.9-1.502.7-3.449-.49-4.738l-5.368-5.805a1.8 1.8 0 0 1 .1-2.545 1.799 1.799 0 0 1 2.547.101zm24.213-.859a1.802 1.802 0 0 1 .618 2.471l-1.848 3.081c-.9 1.502-.7 3.448.49 4.737l5.368 5.805A1.8 1.8 0 0 1 31.7 27.28c-.485 0-.97-.194-1.324-.577l-5.368-5.805c-2.268-2.455-2.652-6.17-.932-9.035l1.848-3.081a1.802 1.802 0 0 1 2.471-.618zM2.86 16.723a2.86 2.86 0 1 1 0 5.72 2.86 2.86 0 0 1 0-5.72zm14.418-1.86a3.243 3.243 0 1 1 0 6.487 3.243 3.243 0 0 1 0-6.487zm14.42-2.044a2.86 2.86 0 1 1 0 5.72 2.86 2.86 0 0 1 0-5.72zm-5.21-10.912a1.8 1.8 0 0 1-.1 2.546L20.583 9.82a7.595 7.595 0 0 1-5.153 2.005 7.545 7.545 0 0 1-3.885-1.07l-3.08-1.848a1.802 1.802 0 0 1-.619-2.471 1.802 1.802 0 0 1 2.471-.618l3.084 1.845c1.502.9 3.448.7 4.737-.49l5.805-5.368a1.8 1.8 0 0 1 2.546.101zM15.787 0a2.86 2.86 0 1 1 0 5.72 2.86 2.86 0 0 1 0-5.72z" fill="#FC6E45"/>
                </g>
            </svg>
            </Stack>
            {status!==''&&
                <Card sx={{m:2,p:4}}>
                    <Typography variant="h4" paragraph sx={{mb:2}}>
                        Welcome to Protiv
                        <Typography variant="body2">
                            You've been invited by <b>{data.company_name}</b> to start using Protiv.
                        </Typography>
                    </Typography>
                    {status==="password"&&<>
                        <SetPasswordForm signup_type={signup_type} db={db} token={token} attribute={attribute} data={data}/>
                        <Stack direction="row" sx={{mt:1}} alignContent="center" justifyContent={"center"} alignItems="center">
                            <Typography variant="body2">
                                Already have protiv account? 
                            <Button
                                size="large"
                                component={RouterLink}
                                to={PATH_AUTH.login}
                            >
                                Login
                            </Button>
                            </Typography>
                        </Stack>
                        </>
                    }
                    {status==='invalid-token' && <>
                        <>Please login with your protiv account to accept invite.</>
                            <Button 
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2, mb: 2 }}
                                onClick={()=>{
                                    redirectTo(PATH_AUTH.login)
                                }}>
                                Login
                            </Button>
                    </>}
                    {status==='verify' && <SignupVerifyEmailPhoneNumberForm data={data}/>}
                </Card>
            }
            {status===''&&<>Loading...</>}

        </PageWitoutLayout>
    );
};

export default SignupAcceptInvite;
