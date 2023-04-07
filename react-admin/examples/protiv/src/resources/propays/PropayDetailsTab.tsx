import { ResourceContextProvider, useTranslate } from 'react-admin';
import { PageAlertContextProvider } from '../../components/page-alerts/PageAlerts';
import { PropayShow } from './PropayTab';

const PropayDetailsTab = () => {
    const translate = useTranslate();
    return(
        <div className='propay-detail-wrap'>
          <PageAlertContextProvider>
         <ResourceContextProvider value='propays'>
          <PropayShow redirect="/propay/propay" />
          </ResourceContextProvider>
         </PageAlertContextProvider> 
        </div>
    );
};
export default PropayDetailsTab;
