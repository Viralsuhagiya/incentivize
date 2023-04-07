import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import get from 'lodash/get';
import moment from 'moment';
import { useListContext, useTranslate } from 'react-admin';
import { MAvatar } from '../components/@material-extend';
import { NUMBER } from '../utils/Constants/MagicNumber';
import createAvatar from '../utils/createAvatar';
import CardListActions from './CardListActions';
import UserDetailsModal from './UserDetailsModal';
import { statusClass, timeLogged, truncateString } from '../utils/Constants/ConstantData';
import { PropayCard } from '../types';
import Empty from './Empty';
import { Avtar } from './CardListingDashboard';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

 /* Listing of data in the form of cards */
const CardListView = (props:PropayCard)=> {
  const { onDashboard } = props;
  const { data, total } = useListContext();

  const [open, setOpen] = React.useState(false);
  const [wageIds, setWageIds] = React.useState([]);
  const [propayId, setPropayId] = React.useState<number>();


  const handleClickOpen = (wageId, id: number) => {
    setPropayId(id)
    const arr = [];
    wageId && wageId.forEach((item)=> arr.push(item.id));
    setOpen(true);
    setWageIds(arr);
  };
  const PropaysData = onDashboard ? data.slice(NUMBER.ZERO, NUMBER.THREE) : data;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    });
  

    const navigate = useNavigate();
    const showPropayDetail = (PropayId: any) => navigate(`/show/${PropayId}/propay`);
    const translate = useTranslate();

  return ( 
      <>
    <Grid container spacing={3} className="card-grid">
    {total > NUMBER.ZERO && PropaysData.map((item) => {
      return(
      <Grid item xs={12} md={4}>
    <Card className='card-box'>
      <CardContent>
      <Button variant="contained" className={statusClass(item.status)}>{item.status === 'paid' ? 'Closed' : item.status}</Button>
      <Grid container columns={{ xs: 12, md: 12 }} onClick={() => showPropayDetail(item.id)}>  
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
      <div className='card-users' onClick={() => handleClickOpen(item.employee_wage_ids, Number(item.id))}>
        {item?.selected_employee_ids_obj.slice(NUMBER.ZERO, NUMBER.THREE).map((datas: { name: string}) => {
          return(
            <LabelAvatars name={datas.name} />
          );
        })
    }
     {item.selected_employee_ids_obj.length > NUMBER.THREE && <span className='user-count-card'>+{item?.selected_employee_ids_obj.length - NUMBER.THREE}</span>}
      </div>
        <CardListActions record={item}/>
      </CardActions>
    </Card>
    </Grid>
    );
  })  
  }
        {wageIds.length > NUMBER.ZERO && propayId && <UserDetailsModal openModal={open} close={setOpen} wageId={wageIds} propayId={propayId} />}
    </Grid>  
    {total === NUMBER.ZERO && !onDashboard && <Empty />}
    </>
    );
};

export default CardListView;


/*Getting worker's data By worker's Id */
export const LabelAvatars = (props: any) => {
  const { name } = props;
  const firstName =  get(name?.split(' ',NUMBER.TWO), NUMBER.ZERO,'');
  const lastName = get(name?.split(' ',NUMBER.TWO), NUMBER.ONE,'');
  const avatar = createAvatar(firstName, lastName);
  return (
      <MAvatar color={avatar.color} sx={{ width: NUMBER.THIRTY, height: NUMBER.THIRTY }}>
          <Typography variant="inherit" noWrap sx={{ fontSize: NUMBER.TWELVE }}>
              {avatar.name}
          </Typography>
      </MAvatar>
  );
};
