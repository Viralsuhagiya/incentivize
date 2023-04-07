
import { Typography } from '@mui/material';
import { ResourceContextProvider } from 'react-admin';
import { PageAlertContextProvider } from '../../components/page-alerts/PageAlerts';
import { PropayCreate } from './Propay';

const PropayCreateTab = () => {
    return(
        <div className='create-propay-page'>
         <PageAlertContextProvider>
         <Typography variant='h2' className='main-title main-title-mobile create-propay-mbs'>Create ProPay</Typography>            
          <ResourceContextProvider value='propays'>            
            <PropayCreate  redirect='/propay/propay'/>
          </ResourceContextProvider>
         </PageAlertContextProvider>
        </div>
    );
};
export default PropayCreateTab;
