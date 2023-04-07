import {
  Tooltip
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import get from 'lodash/get';
import moment from 'moment';
import * as React from 'react';
import { useGetOne, useTranslate } from 'react-admin';
import { Link, useNavigate } from 'react-router-dom';
import { MAvatar } from '../components/@material-extend';
import { statusClass, timeLogged, truncateString } from '../utils/Constants/ConstantData';
import { NUMBER } from '../utils/Constants/MagicNumber';
import createAvatar from '../utils/createAvatar';
import CardListActions from './CardListActions';
import UserDetailsModal from './UserDetailsModal';


 /* Listing of data in the form of cards */
const CardListingDashboard = (props: any)=> {
  const { data, total } = props;

  const [open, setOpen] = React.useState(false);
  const [wageIds, setWageIds] = React.useState([]);
  const [propayId, setPropayId] = React.useState<number>();

  const handleClickOpen = (wageId, id) => {
    setPropayId(id);
    const arr = [];
    wageId && wageId.forEach((item)=> arr.push(item.id));
    setOpen(true);
    setWageIds(arr);
  };
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    });
    const navigate = useNavigate();

    const showPropayDetail = (PropayId: any) => navigate(`/show/${PropayId}/propay`);
    const translate = useTranslate();

  return ( 
      <>
      <Box className='dashboard-card-top-head'>
      <div className='dashboard-card-left-head'>
              <Typography variant='h3'> {translate('resources.propays.active_propay')} </Typography>
              <Typography variant='h4'> {translate('resources.propays.incentives_info')}</Typography>   
      </div>
      <div className='dashboard-card-right-head'>
      <Link to="/propay/propay"> {translate('dashboard.view_all')}
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fill-rule="evenodd">
              <path d="M0 0h24v24H0z"/>
              <path fill="#0391BA" fill-rule="nonzero" d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </g>
      </svg>
      </Link></div>
      </Box>
    <Grid container spacing={3} className={`${total===NUMBER.ONE ? 'card-grid dashboard-card-one' :  'card-grid'}`}>

    {total > NUMBER.ZERO && data.slice(NUMBER.ZERO, NUMBER.THREE).map((item) => {      
      return(
      <Grid item xs={12} md={4}>
    <Card className='card-box'>
      <CardContent className='card-click-able' onClick={() => showPropayDetail(item.id)}>
      <Button variant="contained" className={statusClass(item.status)}>{item.status === 'paid' ? 'Closed' : item.status}</Button>
      <Grid container columns={{ xs: 12, md: 12 }}>  
        <Grid item xs={12} className='card-view-group'>
        <label> {translate('resources.propays.card_listing_dashboard.title')} </label>
        {item?.name.length > NUMBER.TWENTY_ONE ? <Tooltip title={item.name} placement="bottom" arrow>
        <span>{truncateString(item.name.toString())}</span>
        </Tooltip>
        :
        <span>{truncateString(item.name.toString())}</span>
        }
        </Grid>
        <Grid item xs={12} className='card-view-group'>
        <label> {translate('resources.propays.fields.manager_id')} </label>
        <Avtar id={item.manager_id} />
        </Grid>
        <Grid item xs={6} className='card-view-group'>
        <label> {translate('resources.propays.fields.from_date')} </label>
        {item.from_date ? moment(item.from_date).format('MMM DD, YYYY') : '~'}
        </Grid>
        <Grid item xs={6} className='card-view-group'>
        <label> {translate('resources.propays.fields.to_date')} </label>
        {item.to_date ? moment(item.to_date).format('MMM DD, YYYY') : '~'}
        </Grid>
        <Grid item xs={6} className='card-view-group'>
        <label> {translate('resources.propays.fields.hours')} </label>
        {timeLogged(item.hours)}
        </Grid>
        <Grid item xs={6} className='card-view-group'>
        <label> {translate('resources.propays.fields.amount')} </label>
        {formatter.format(item.amount)}
         </Grid>
      </Grid>      
      </CardContent>     
      <CardActions className='card-action-custom'>
      <div className='card-users' onClick={() => handleClickOpen(item.employee_wage_ids, item.id)}>
        {item.selected_employee_ids_obj.length > NUMBER.THREE ? item?.selected_employee_ids_obj.slice(NUMBER.ZERO, NUMBER.THREE).map((datas: { id: any; }) => {
          return(
            <LabelAvatars id={datas.id} />
          );
        })   
      :
      item.selected_employee_ids_obj.map((val) => {
        return(
          <LabelAvatars id={val.id} />
        );
      })   
    }
     {item.selected_employee_ids.length > NUMBER.THREE && <span className='user-count-card'>+{item?.selected_employee_ids.length - NUMBER.THREE}</span>}
      </div>
        <CardListActions record={item} />
      </CardActions>
    </Card>
    </Grid>
    );
  })  
  }
        {wageIds.length> NUMBER.ZERO && propayId && <UserDetailsModal openModal={open} close={setOpen} wageId={wageIds} propayId={propayId} />}

    </Grid>  
    </>
    );
};

export default CardListingDashboard;


export const Avtar = (props: { id: any; })=> {
  const { id } = props;
  const { data } = useGetOne(
    'employees',
    { id }
);
  return(
    <>
    {data?.display_name.length > NUMBER.TWENTY_ONE ? <Tooltip title={data?.display_name} placement="bottom" arrow>
        <span>{data?.display_name && truncateString(data?.display_name.toString())}</span>
        </Tooltip>
        :
        <span>{data?.display_name && truncateString(data?.display_name.toString())}</span>
        }
    
    </>
  );
};

const LabelAvatars = (props: any) => {
  const { id } = props;
  const { data } = useGetOne(
    'employees',
    { id }
);
  const firstName =  get(data?.first_name.split(' ',NUMBER.TWO), NUMBER.ZERO,'');
  const lastName = get(data?.last_name.split(' ',NUMBER.TWO), NUMBER.ZERO,'');
  const avatar = createAvatar(firstName, lastName);
  return (
      <MAvatar color={avatar.color} sx={{ width: 30, height: 30 }}>
          <Typography variant='inherit' noWrap sx={{ fontSize: 12 }}>
              {avatar.name}
          </Typography>
      </MAvatar>
  );
};
