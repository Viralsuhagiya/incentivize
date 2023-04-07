/* eslint-disable array-callback-return */
import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import moment from 'moment';
import { useState } from 'react';
import { useGetList, useTranslate } from 'react-admin';
import { useQueryClient } from 'react-query';
import BonusDollarBlueImage from '../assets/paid-blue-24-dp-1.svg';
import BonusDollarGreenImage from '../assets/paid-green-24-dp-1.svg';
import { getLastMonthDate, getLastWeeksDate } from '../utils/Constants/ConstantData';
import { NUMBER } from '../utils/Constants/MagicNumber';
import { useNavigate } from 'react-router-dom';

const BonusDetails =() =>{
    const week = moment(getLastWeeksDate()).format('YYYY-MM-DD'); 
    const month = moment(getLastMonthDate()).format('YYYY-MM-DD'); 
    const navigate = useNavigate();
    const translate = useTranslate()
    const [date, setDate] = useState(week);
    const queryClient = useQueryClient();

    const handleChange = (event: SelectChangeEvent) => {
        setDate(event.target.value);
        queryClient.invalidateQueries(['attendances', 'getList']);

    };

    const { data, total } = useGetList(
        'attendances',
        {pagination: { page: NUMBER.ONE, perPage: NUMBER.TEN_THOUSAND }, filter:{type: {_eq: 'is_performance_bonus'}, date:{_gte: date}} }   
    );
    let pendingBonus = NUMBER.ZERO;
    let paidBonus = NUMBER.ZERO;
    let pendingBonusCount = NUMBER.ZERO;

    const getPendingBonus = () => {
        data?.map((paidValue) => {
            if(paidValue.status === 'pending'){
                pendingBonus = pendingBonus + paidValue.bonus_earning;
                pendingBonusCount= pendingBonusCount + NUMBER.ONE;
            }
        });
        return formatter.format(pendingBonus);
    };
    const getPaidBonus = () => {
        data?.map((paidValue) => {
            if(paidValue.status === 'paid'){
                paidBonus = paidBonus + paidValue.bonus_earning;
            }
        });
        return formatter.format(paidBonus);
    };
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        });
    
    return(
    <>     
     <Box className='dashboard-card-top-head'>
      <div className='dashboard-card-left-head'>
      <Typography variant='h3'>{translate('dashboard.bonuses.title')}</Typography>
      </div>
      <div className='dashboard-card-right-head'>
      <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
      <Select
          labelId='demo-simple-select-helper-label'
          id='demo-simple-select-helper'
          value={date}
          onChange={handleChange}
        >
          <MenuItem value={week} selected>{translate('dashboard.bonuses.last_week')}</MenuItem>
          <MenuItem value={month}>{translate('dashboard.bonuses.last_month')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
      </div>
      </Box>   

         <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <div className='dash-bonus-panel'>
                <div className='dash-bonus-panel-left'>
                <Typography variant='h4'><strong>{total > NUMBER.ZERO ? getPendingBonus() : pendingBonus}</strong></Typography>
                <Typography variant='subtitle2'>{translate('dashboard.bonuses.pending_bonuses')} <span className='bonus-panel-link' onClick={()=>navigate('/propay/payroll/attendances')}>
                {(pendingBonusCount > NUMBER.ONE ? `(${pendingBonusCount} ${translate('dashboard.bonuses.bonuses')})`:`(${pendingBonusCount} ${translate('dashboard.bonuses.bonus')})`)}</span></Typography>
                </div>
                <div className='bonus-dollar-icon'><img src={BonusDollarBlueImage} alt='Dollar' /></div>
                </div>
            </Grid>
            <Grid item xs={12} md={6}>
                <div className='dash-bonus-panel dash-bonus-green-panel'>
                <div className='dash-bonus-panel-left'>
                <Typography variant='h4'><strong>{total > NUMBER.ZERO ? getPaidBonus() : paidBonus}</strong></Typography>
                <Typography variant='subtitle2'>{translate('dashboard.bonuses.paid_bonuses')}</Typography>
                </div>
                <div className='bonus-dollar-icon'><img src={BonusDollarGreenImage} alt='Dollar' /></div>
                </div>
            </Grid>
        </Grid>
    </>
    );
};
export default BonusDetails;
