
import {
    Box, Card, Stack,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useIdentityContext } from '../../components/identity';
import PageAlerts, { PageAlertContextProvider } from '../../components/page-alerts/PageAlerts';
import { DashboardGridItem } from '../../dashboard/Dashboard';
import { HasBackendNotConnected, useGetBackend } from '../../resources/company/company';
import { DialogAddTimeForm } from '../../resources/payrolls/Payrolls';


const AddTimePage = () =>{
    const navigate = useNavigate();
    const backend = useGetBackend()
    if(backend){
        navigate('/');
    };

    return(
    <>
           <PageAlertContextProvider>
                <PageAlerts/>
                    <HasBackendNotConnected>
                        <AddTimePayrollCard />
                    </HasBackendNotConnected>
            </PageAlertContextProvider>

    </>
    )
};
export default AddTimePage;

export const AddTimePayrollCard = (props: any) => {
    const identity = useIdentityContext();

    if (!identity?.allow_to_add_time){
        return <></>;
    };
    
    return (<>
            <DashboardGridItem lg={6} md={12} sm={12} xs={12} className={'add-time-container'} >
                <Card sx={{ display: 'flex', alignItems: 'center', p: 3, paddingTop: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ textAlign: 'center', paddingTop: 1 }}>
                            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ position: 'relative', width: '100%' }}>
                                <Typography variant="h3" sx={{ flex: 1 }}>Add Time</Typography>
                            </Stack>
                        </Box>
                        <DialogAddTimeForm isFromDashboard={true} />
                    </Box>
                </Card>
            </DashboardGridItem>
    </>);
};
