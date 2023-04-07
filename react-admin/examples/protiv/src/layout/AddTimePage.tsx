
import PageAlerts, { PageAlertContextProvider } from '../components/page-alerts/PageAlerts';
import { HasBackendNotConnected, useGetBackend } from '../resources/company/company';
import AddTimeCard from '../dashboard/AddTimeCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { WeeklyAddTimeForm } from '../resources/payrolls/weeklyEntries';
import {Box, Stack} from '@mui/material';
import { NUMBER } from '../utils/Constants/MagicNumber';

const AddTimePage = () =>{
    const {state} = useLocation();
    const navigate = useNavigate();
    const backend = useGetBackend();
    if(backend){
        navigate('/attendances');
    }

    return(
    <>
           <PageAlertContextProvider>
                <PageAlerts/>
                    <HasBackendNotConnected>
                    <Box className='add-time-heading-box'>
                            <Stack direction="row" sx={{ position: 'relative', width: '100%' }}>    
                            <span className='back-button-attendence' onClick={()=> navigate(-NUMBER.ONE)}>Back</span>                         
                                <h2 className="MuiTypography-root MuiTypography-h2 main-title main-title-mobile">Add Time</h2>
                            </Stack>
                    </Box>
                    {state?.record ? 
                        <WeeklyAddTimeForm  isFromPropayCard={true} hideKeepEditor={true} propay_id={state?.record}/>
                        :<AddTimeCard /> }
                    </HasBackendNotConnected>
            </PageAlertContextProvider>

    </>
    );
};
export default AddTimePage;
