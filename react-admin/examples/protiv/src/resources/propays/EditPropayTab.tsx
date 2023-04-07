import { Typography } from '@mui/material';
import { ResourceContextProvider, useTranslate } from 'react-admin';
import { PageAlertContextProvider } from '../../components/page-alerts/PageAlerts';
import { PropayEdit } from './Propay';

const EditPropayTab = () => {
    const translate = useTranslate();
    return(        
        <div className='create-propay-page'>
         <PageAlertContextProvider>
         <Typography variant='h2' className='main-title main-title-mobile create-propay-mbs'>{translate('resources.propays.actions.edit_propay')}</Typography>
          <ResourceContextProvider value='propays'>
            <PropayEdit redirect="/propay/propay" title={translate('resources.propays.actions.edit_propay')}  />
          </ResourceContextProvider>
         </PageAlertContextProvider>
        </div>
    );
};
export default EditPropayTab;
