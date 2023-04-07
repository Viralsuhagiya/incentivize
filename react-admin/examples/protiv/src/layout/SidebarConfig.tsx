// components
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import StyleIcon from '@mui/icons-material/Style';
import { Theme, useMediaQuery } from '@mui/material';
// ----------------------------------------------------------------------
import { useTranslate } from 'react-admin';
import { useIdentityContext } from '../components/identity';
import { hidePropayDetailReport } from '../resources/reports/hidePropayDetailReport';

// PROPAY
// ----------------------------------------------------------------------
const useGetSidebarConfig = () => {
    const identity: any = useIdentityContext();
    const translate = useTranslate();
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('md')
    );

    const sidebarConfig = [
        {
            subheader: '',
            items: [
                {
                    resource: 'menu-dashboard',
                    title: translate('menu.dashboard'),
                    path: '/',
                    icon: <DashboardIcon />,
                    isMobile: isSmall,
                },
                {
                    resource: 'menu-propays',
                    title: translate('menu.propay'),
                    path: '/propay/propay',
                    icon: <StyleIcon />,
                    isMobile: isSmall,
                },
                {
                    resource: 'menu-propays',
                    title: translate('menu.bonuses'),
                    path: '/propay/payroll/attendances',
                    icon: <DeleteOutlinedIcon />,
                    isMobile: isSmall,
                                        
                },
                {
                    resource: 'menu-reports',
                    title: translate('menu.reports.title'),
                    path: '/reports',
                    icon: <LeaderboardIcon />,
                    children: [
                        {
                            title: translate('menu.reports.propay_details'),
                            path: '/reports/propay-detail-report',
                            hide:hidePropayDetailReport(identity?.user_type,identity?.company?.show_propay_detail_report)
                        },
                        {
                            title: translate('menu.reports.wage_growth'),
                            path: '/reports/wage-growth-report',
                        },
                        {
                            title: translate('menu.reports.propay_efficiency'),
                            path: '/reports/propay-efficiency-report',
                        },
                        {
                            title: translate('menu.reports.bonus_report'),
                            path: '/reports/bonus-ot-report',
                        },
                        {
                            title: translate('menu.reports.propay_bonus_report'),
                            path: '/reports/propay-bonus-report',
                        },
                        {
                            title: translate('menu.reports.propay_status_report'),
                            path: '/reports/propay-status-report',
                        },  
                    ],
                },
                // {
                //     resource: 'menu-attendances',
                //     title: 'Add time',
                //     path: `${identity?.company?.is_integrated_company || checkInOutAddtime ? '/attendances/create': '/addtime'}`,
                //     hide:!identity?.allow_to_add_time,
                //     icon: <AccessTimeFilledIcon />,
                // },
                {
                    resource: 'menu-attendances',
                    title: translate('menu.attendances'),
                    path: '/attendances',
                    icon: <AccessTimeFilledIcon />,
                    isMobile: isSmall,
                },
                {
                    resource: 'menu-employees',
                    title: translate('menu.team'),
                    path: '/employees',
                    icon: <PeopleAltIcon />,
                    isMobile: false,
                },
                {
                    resource: 'menu-companies',
                    title: translate('menu.companies'),
                    path: '/companies',
                    icon: <MapsHomeWorkIcon />,
                    isMobile: false,
                },
                {
                    resource: 'menu-jobs',
                    hide: !identity?.company?.show_job_page,
                    title: translate('menu.jobs'),
                    path: '/jobs',
                    icon: <BusinessCenterIcon />,
                    isMobile: false,
                },
                // { title: "Reports", path: "/reports", icon: <StyledIcon icon="iconoir:reports" /> },
                {
                    resource: 'menu-settings',
                    title: translate('menu.settings'),
                    path: '/setting',
                    icon: <ManageAccountsIcon />,
                    isMobile: false,
                },
                // { title: "Technical", path: "/configuration", icon: <StyledIcon icon="ant-design:setting-twotone" /> },
            ],
        },

        // TIMESHEET
        // ----------------------------------------------------------------------
        // {
        //   subheader: 'Timesheet',
        //   items: [
        //     {
        //       title: 'user',
        //       path: PATH_DASHBOARD.app.root,
        //       icon: ICONS.user,
        //       children: [
        //         { title: 'Four', path: PATH_DASHBOARD.app.pageFour },
        //         { title: 'Five', path: PATH_DASHBOARD.app.pageFive },
        //         { title: 'Six', path: PATH_DASHBOARD.app.pageSix }
        //       ]
        //     }
        //   ]
        // }
    ];
    return sidebarConfig;
};

export default useGetSidebarConfig;
