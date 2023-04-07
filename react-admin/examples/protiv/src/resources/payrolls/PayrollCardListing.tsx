import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import moment from 'moment';
import { useListContext, useGetOne } from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import PayBonusAction from '../../layout/CradActions/PayBonusAction';
import { useIdentityContext } from '../../components/identity';

 /* Listing of data in the form of cards */
const PayrollCardListing = ()=> {
  const { data, total } = useListContext();
  const identity = useIdentityContext();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    });    

  return ( 
      <>
    <Grid container spacing={3} className="card-grid">

    {total > NUMBER.ZERO && data.map((item) => {
      return(
      <Grid item xs={12} md={4}>
    <Card className='card-box card-box-bonus'>
      <CardContent>
      <Button variant="contained" className={`${item.status === 'paid' ? 'green-status-btn card-status-btn' : 'card-status-btn'}`}>{item.status}</Button>
      <Grid container columns={{ xs: 12, md: 12 }}>  
        <Grid item xs={12} className='card-view-group'>
        <label>Worker</label>
        <EployeeName id={item.employee_id}/>
        </Grid>
        <Grid item xs={12} className='card-view-group'>
        <label>ProPay</label>
        <div className="card-propay-link"> <PropayName id={item.propay_id}/> </div>
        </Grid>
        <Grid item xs={12} className='card-view-group'>
        <label>Date</label>
        {moment(item.period_start_date).format('MMM DD, YYYY')} ~ {moment(item.period_end_date).format('MMM DD, YYYY')}
        </Grid>
        <Grid item xs={12} className='card-view-group'>
        <label>Paid Period</label>
        {item.paid_period_id ? <PeriodName id={item.paid_period_id} /> : '~'}
        </Grid>
        <Grid item xs={6} className='card-view-group'>
        <label>Earnings</label>
        {`${formatter.format(item.bonus_earning)}`}
        </Grid>
        <Grid item xs={6} className='card-view-group'>
        {identity?.user_type !== 'worker' && <PayBonusAction record={item} redirectTo='/propay/payroll/attendances' 
        redirectPath='/propay/payroll/attendances/paybonus' label='Status' />}        
        </Grid>        
      </Grid>      
      </CardContent>
    </Card>
    </Grid>
    );
  })  
  }
    </Grid>  
    </>
    );
};

export default PayrollCardListing;

export const EployeeName = (props: { id: any; })=> {
  const { id } = props;
  const { data } = useGetOne(
    'employees',
    { id }
);

  return(
    <>
    {data?.display_name}
    </>
  );
};

export const PeriodName = (props: { id: any; })=> {
  const { id } = props;
  const { data } = useGetOne(
    'periods',
    { id }
);
  return(
    <>
    {data?.display_name.slice(NUMBER.FOUR, data?.display_name.length)}
    </>
  );
};

export const PropayName = (props: { id: any; })=> {
  const { id } = props;
  const navigate = useNavigate();
  const { data } = useGetOne(
    'propays',
    { id }
);

const openPropay= (propayId) => {  
  navigate(`/show/${propayId}/propay`);
};
  return(
    <Typography onClick={() => openPropay(data?.id)}>
    {data?.display_name}
    </Typography>
  );
};
