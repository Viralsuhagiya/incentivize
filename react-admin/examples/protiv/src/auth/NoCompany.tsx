import {
    Box,
    Button,
    Card,
    Container,
    Stack,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import Page from '../components/Page';

import ThemeWrapper from '../layout/ThemeWrapper';
import Logo from '../components/Logo';
import { useLogout } from 'react-admin';
import IdentityContext from '../components/identity/IdentityContext';
import useCompanyAccess from '../components/identity/useCompanyAccess';
import { NUMBER } from '../utils/Constants/MagicNumber';
// ----------------------------------------------------------------------

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
            <RootLayoutStyle title="No Access | Protiv">                
                <Outlet />
                <Container>
                    <Box sx={{ maxWidth: 480, mx: 'auto' }}>{children}</Box>
                </Container>
            </RootLayoutStyle>
        </ThemeWrapper>
    );
};

const NoCompanyView = () => {
    useCompanyAccess();
    const logout = useLogout();
    return (
        <PageWitoutLayout>
            <Stack direction="row" justifyContent={'center'}  sx={{m:3, mt:0}}>
                <Logo />
            </Stack>
            <Card sx={{m:2,p:4}}>
                <Typography variant="h4" paragraph sx={{mb:2}}>
                    No Access
                    <Typography variant="body2">
                        You don't have access to any company.
                    </Typography>
                </Typography>
                <Button 
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={()=>{
                        logout()
                    }}>
                    Login with different user
                </Button>
            </Card>
        </PageWitoutLayout>
    );
};
const NoCompany = () => {
    return (<IdentityContext>
        <NoCompanyView />
    </IdentityContext>)
}


export default NoCompany;
