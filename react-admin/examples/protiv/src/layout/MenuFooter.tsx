
import { CreateButton } from '../../src/layout/CreateButton';
import { Box, Typography } from '@mui/material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import StyleIcon from '@mui/icons-material/Style';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { canAccess } from '../ra-rbac';
import { usePermissionsOptimized } from '../components/identity';
import { ACTIVE_TAB } from '../utils/Constants/ConstantData';
import { useLocation } from 'react-router';


 const MenuFooter = ()=> {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const openPropay = () => navigate('/propay/propay'); 
    const openBonuses = () => navigate('/propay/payroll/attendances');
    const openDashboard = () => navigate('/');
    const openAttendances = () => navigate('/attendances'); 
    const { permissions } = usePermissionsOptimized();

    return (
        <Box className="MuiMenuFooter">
            {canAccess({ permissions, resource: 'menu-dashboard', action: 'list' }) && 
            <Button className={`${pathname === ACTIVE_TAB.DASHBOARD ? 'activeTab': ''}`} onClick={openDashboard}>
                <DashboardIcon />
                <Typography variant="caption">Dashboard</Typography>
            </Button>}
            {canAccess({ permissions, resource: 'menu-propays', action: 'list' }) && 
            <Button className={`${pathname === ACTIVE_TAB.PROPAY ? 'activeTab': ''}`} onClick={openPropay}>
                <StyleIcon />
                <Typography variant="caption">Propay</Typography>
            </Button>}
            {canAccess({ permissions, resource: 'propays', action: 'create' }) && 
            <Box className="MuiCreateButton">
                <CreateButton path="/create/propay"/>
                <Typography variant="caption">Create</Typography>
            </Box>}
            {canAccess({  permissions, resource: 'menu-propays', action: 'list' }) &&
            <Button className={`${pathname === ACTIVE_TAB.BONUSES ? 'menu-bonus-link activeTab': 'menu-bonus-link'}`} onClick={openBonuses}>
                <LeaderboardIcon/>
                <Typography variant="caption">Bonuses</Typography>
            </Button>}
               <Button onClick={openAttendances} className={`${pathname === ACTIVE_TAB.ATTENDANCE || pathname === ACTIVE_TAB.ADD_TIME ? 
                'time-entries-footer-btn activeTab': 'time-entries-footer-btn'}`}>
                <AccessTimeFilledIcon />
                <Typography variant="caption">Time</Typography>
               </Button>            
        </Box>
    );
};
export default MenuFooter;
