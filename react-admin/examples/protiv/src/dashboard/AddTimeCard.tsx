import {
    Box, Card
} from '@mui/material';
import { useIdentityContext } from '../components/identity';
import { DialogAddTimeForm, TsheetsPermission } from '../resources/payrolls/Payrolls';
import { DashboardGridItem } from './Dashboard';

const AddTimeCard = (props: any) => {
    const identity = useIdentityContext();
    if (!identity?.allow_to_add_time){
        return <></>;
    };
    
    return (<>
        <TsheetsPermission is_connected={false} >
            <DashboardGridItem lg={12} md={12} sm={12} xs={12} className={'add-time-container add-time-page'} >
                <Card sx={{ display: 'flex', alignItems: 'center', p: 3, paddingTop: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>                        
                        <DialogAddTimeForm isFromDashboard={true} />
                    </Box>
                </Card>
            </DashboardGridItem>
        </TsheetsPermission>
    </>);
};

export default AddTimeCard;
