import { Alert, AlertTitle, Box, Button, Card, Grid, Hidden, Skeleton, Stack, Theme, Typography, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useGetList, useListContext, useTranslate } from 'react-admin';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useGetIdentityOptimized } from '../components/identity';
import PageAlerts, { PageAlertContextProvider } from '../components/page-alerts/PageAlerts';
import CardListingDashboard from '../layout/CardListingDashboard';
import Loader from '../layout/Loader';
import ThemeWrapper from '../layout/ThemeWrapper';
import { ListGroupBase } from '../ra-list-grouping/ListGroupBase';
import PaymentProvider from '../resources/onboard/PaymentProvider';
import { HasPermission } from '../resources/payrolls/Payrolls';
import { NUMBER } from '../utils/Constants/MagicNumber';
import BonusDetails from './BonusDetails';
import DialogFormDashboard from './DialogDashboard';
import PropayCalculator from './PropayCalculator';
const StyledGrid = styled(Grid)(({ theme }) => ({
    transition: theme.transitions.create(['all'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
    '.MuiFormControl-root.propayName': {
        marginTop: 0,
    },
    '&.add-time-container': { 
        width: '100%',
        '& .MuiBox-root': {
            width: '100%'
        },
        '& .RaCreate-card': { width: '100%' }
    }
}));

export const DashboardGridItem = (props: any) => {
    return (
        <StyledGrid item xs={12} md={6} lg={4} {...props}>
            {props.children}
        </StyledGrid>
    );
};

export const ListGroup = (props: any) => {
    return (
        <ListGroupBase {...props}>
            <GroupedRecrod {...props} />
        </ListGroupBase>
    );
};

export const GroupedRecrod = (props: any) => {
    const { data, isLoading } = useListContext(props);
    if (isLoading) { 
        return <CardLoader/>; 
    }
    const record = data && data[0];
    return React.cloneElement(props.children, { record: record });
};

const StyledCard = styled(Card)({
    width:'80%',
    borderRadius:80,
});
export const CardLoader = () => {
    return (<DashboardGridItem>
        <Hidden smUp>
            <Stack width="100%" justifyContent="center" alignItems="center">
                <StyledCard>
                    <Skeleton variant="rectangular" height={150} />
                </StyledCard>
            </Stack>
        </Hidden>

        <Hidden smDown>
            <Card>
                <Skeleton variant="rectangular" height={150} />
            </Card>
        </Hidden>
    </DashboardGridItem>)
};
const SyledBox = styled(Box)(({theme}) => ({
    [theme.breakpoints.down('sm')]: {
        backgroundColor: theme.palette.primary.main
    }
}));
const OnboardingAlert = () => {
    const {data:onboardingData, isLoading } = useQuery('onboardingInfo', PaymentProvider.onboardingInfo);
    const translate = useTranslate();
    return (<>
        {!isLoading && onboardingData && onboardingData.force_onboarding && onboardingData.onboarding_state!=='completed' && 
            <Alert sx={{mb:1}} severity="error">
                <AlertTitle> {translate('dashboard.onboarding')} </AlertTitle>
                {translate('dashboard.onboarding_info')} <Button component={Link} to='/onboard'><strong> {translate('dashboard.check_it_out')} </strong></Button>
        </Alert>
        }
    </>)
};
const Dashboard = () => {
    const currentSort = { field: 'create_date', order: 'DESC' };
    const translate = useTranslate();
    const { data, total } = useGetList(
        'propays',
        { pagination: { page: NUMBER.ONE, perPage: NUMBER.THREE }, sort: currentSort, filter:{status:{_eq:'open'}} }   
    );
    const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
        const openDialog = () => {
            dialogRef.current.open();
        };
        const dialogRef: any = React.useRef();
        const { identity } = useGetIdentityOptimized();
    return (
        <>
            <Box>
                <Typography variant="h2" className='main-title main-title-mobile'>{translate('dashboard.title')}</Typography>
                <div className='switch-company-name'>{translate('dashboard.company')}<span>-</span> <strong>{identity?.company?.name}</strong></div>
            </Box>
            <ThemeWrapper>
            <PageAlertContextProvider>
                <SyledBox className='dashboard-outer'>
                    <HasPermission resource="allow-onboarding" action="*">
                        <OnboardingAlert />
                    </HasPermission>
                    <PageAlerts/>
                    <Grid container spacing={3} className="grid-dashboard-cont dashboard-bonus-sec">
                     <BonusDetails/>
                     {/* <Loader /> */}
                    </Grid>
                    
                    {total > NUMBER.ZERO && <Grid container spacing={3} className="grid-dashboard-cont">        
                            <CardListingDashboard data={data} total={total} />
                     </Grid>}  

                    {!isSmall ? <Grid container spacing={3} className="calculator-section">             
                      <PropayCalculator/>                           
                     </Grid>
                    :
                     <>
                        <div className='calculator-on-mobile' onClick={() => openDialog()}>
                                <h4>{translate('resources.propayCalculators.fields.name')}</h4>
                                <p>{translate('resources.propayCalculators.fields.slider_info_icon')}</p>
                        </div>
                          <DialogFormDashboard title="ProPay Calculator" ref={dialogRef}>
                                    <PropayCalculator />
                          </DialogFormDashboard>
                    </>
                  
                    }

                    {/* <Grid container spacing={3}>
                    <HasBackendNotConnected>
                                <AddTimeCard/>
                    </HasBackendNotConnected>
                    </Grid> */}

                    {/* <Grid container spacing={3} className="grid-dashboard-cont dashboard-bonus-sec top-leader-dash">
                     <TopLeaders/>
                    </Grid> */}
                    
                </SyledBox>
            </PageAlertContextProvider>
            </ThemeWrapper>
            <Helmet>
            <title>Dashboard</title>
        </Helmet>
        </>
    );
};

export default Dashboard;
