
import React from 'react';
import {
    Logout, useTranslate
} from 'react-admin';
import { Layout } from '../../layout';
import { styled } from '@mui/material/styles';

import {PayrollsList} from '../payrolls/Payrolls';
import { PropayTab } from './PropayTab';
import { Tab, TabbedLayout, TabbedLayoutTitle } from '../../components/tabs';
import { PageAlertContextProvider } from '../../components/page-alerts/PageAlerts';
import { Typography, Box, Button } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import { LIST } from '../../utils/Constants/ConstantData';
import { useLocation } from 'react-router';
import PropayCompletedBudget from './PropayCompletedBudget';
export const StyledTabbedLayout = styled(TabbedLayout, { name: 'TabList' })(
    ({ theme }) => ({
        [`& .Mui-selected`]: {
            fontSize: 'x-large',
        },
        [`& .MuiDivider-root`]:{
            display: 'none'
        }
    })
);
const ROUTES ={
    'propay' : 'propay',
    'payroll' : 'payroll/attendances',
}

const PayrollTabs = (props: any) => {
    const translate = useTranslate();
    const [ type, setType] = React.useState(LIST.LIST);
      const listType = () => {
          setType(LIST.LIST);
    };
      const cardType = () => {
          setType(LIST.CARD);
      };
      const { pathname } = useLocation();      
    return (
        <PageAlertContextProvider>
        <Layout logout={<Logout button />} noTitle titleComponent={<TabbedLayoutTitle />}>
            {pathname === '/propay/payroll/attendances' ? <div className='propay-tabing-title'><Typography className='pageTitle' variant='h2'>{translate('resources.payrolls.name')}</Typography>
            <Typography variant='h4'>{translate('resources.propays.income_earned_info')}</Typography></div>
            : <div className='propay-tabing-title'><div className='propay-tabing-full-width'><Typography className='pageTitle' variant='h2'>{translate('resources.propays.name')}</Typography>
            <Typography variant='h4'>{translate('resources.propays.incentives_info')}</Typography> 
            {/* <PropayCompletedBudget />            */}
            </div>
            </div>            
            }

            <StyledTabbedLayout route={ROUTES} className='MuiTabList'>
                <Tab label='resources.propays.name' path='propay/*' value='propay' onClick={() => listType()}>
                    <Box className='MuiTabListGrid-icons'>
                        <Button className={`${type === 'List' ? 'active' : '' }`} onClick={() => listType()} variant='contained' size='small'>
                            <FormatListBulletedIcon/>
                        </Button>
                        <Button className={`${type === 'Card' ? 'active' : '' }`} onClick={() => cardType()} variant='contained' size='small'>
                            <GridViewIcon/>
                        </Button>
                    </Box>
                    <PropayTab type={type} />
                </Tab>
                <Tab label='resources.payrolls.name' path='payroll/*' value='payroll/attendances'>
                    <PayrollsList />
                </Tab>
            </StyledTabbedLayout>
        </Layout>
        </PageAlertContextProvider>
    );
};

export default React.memo(PayrollTabs);
