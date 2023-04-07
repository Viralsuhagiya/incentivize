import { Theme,useMediaQuery } from '@mui/material';
import { ResourceContextProvider } from 'react-admin';
import { DefaultDatagrid } from '../../components/fields';
import { useGetBaseLocationForCurrentRoute } from '../../hooks/useGetBaseLocationForCurrentRoute';
import { List } from '../../layout/List';
import { BonusAttendanceList, BonusFilter, BonusListActions, PayBonus } from './BonusPayrolls';
import PayrollCardListing from './PayrollCardListing';
import { TitleActions } from './Payrolls';
import { Helmet } from 'react-helmet-async';

const PayrollListView = (props: any) => {
    const isXSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const currentRouteBasePath = useGetBaseLocationForCurrentRoute();

    return(
        <>
          {(!isXSmall) ? 
              <BonusAttendanceList />
                :
                <div className='propay-page-card'>
                <ResourceContextProvider value="attendances">
                    <>
                <List
                filterDefaultValues={{status:{_eq:'pending'}}}
                filter={{ 'type': { _eq: 'is_performance_bonus' }}}
                titleAction={TitleActions}
                titleActionProps={{ showCreate: false }}
                actions={<BonusListActions filters={BonusFilter} add_path={currentRouteBasePath+'/attendances/create'}/>}
                emptyWhileLoading
            >
             {/* <DefaultDatagrid
                className='bonus-data-grid-mobile'
                    bulkActionButtons={<PayBonus redirectTo="/propay/payroll/attendances"  dialogRef={props.dialogRef}/>}
                    optimized={true}
                    isRowSelectable={record => false}
                >  */}
                <PayrollCardListing />  
                {/* </DefaultDatagrid>            */}
            </List>
            <Helmet>
            <title>Bonuses</title>
        </Helmet>
        </>
            </ResourceContextProvider>
            </div>
              }
        </>
    );
};

export default PayrollListView;
