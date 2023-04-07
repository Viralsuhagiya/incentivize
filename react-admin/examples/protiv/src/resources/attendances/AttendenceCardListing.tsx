import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import get from 'lodash/get';
import moment from 'moment';
import { useListContext, useGetOne, useTranslate } from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import AttendencePropayAction from './AttendencePropayAction';
import { timeLogged } from '../../utils/Constants/ConstantData';
import { sentenceCase } from 'change-case';
import { InfoLabel } from '../../components/fields/InfoLabel';
import { useAttendance } from './useAttendance';
import Empty from '../../layout/Empty';


 /* Listing of worker attendance in the form of cards */
const AttendenceCardListing = (props: any)=> {
  const { data, total } = useListContext();    
    const translate = useTranslate();

  return ( 
      <>
    <Grid container spacing={3} className="card-grid">

    {total > NUMBER.ZERO && data.map((workerAttendance) => {
      return(
      <Grid item xs={12} md={4}>
    <Card className='card-box card-box-bonus'>
      <CardContent>
      <Button variant="contained" className={`${workerAttendance.status === 'paid' ? 'yellow-status-btn card-status-btn' : 'green-status-btn card-status-btn'}`}>
        {sentenceCase(translate(`resources.attendances.choices2.status.${workerAttendance.status}`!))}
        </Button>
      {workerAttendance.locked && <InfoLabel sx={{color:'red'}} icon="ri:error-warning-fill">
                <Typography>Attendance is marked approved in QuickBooks time.</Typography>
                <Typography>Please unapprove in QB time to modify</Typography>
            </InfoLabel>
      }
      <Grid container columns={{ xs: 12, md: 12 }}>  
        <Grid item xs={12} className='card-view-group'>
        <label>Name</label>
        <EployeeName id={workerAttendance.employee_id}/>
        </Grid>
        <Grid item xs={12} className='card-view-group'>
        <label>ProPay</label>
        <div className="card-propay-link"> {workerAttendance?.propay_id ? <PropayName id={workerAttendance.propay_id}/> : '~'} </div>
        </Grid>
        <Grid item xs={12} className='card-view-group'>
        <label>Job</label>
        {workerAttendance.job_id ? <JobName id={workerAttendance.job_id}/> : '~'}
        </Grid>
        <StartAndEndDate record={workerAttendance} />
        <Grid item xs={6} className='card-view-group'>
        <label>Hours</label>
        {timeLogged(workerAttendance.hours)}
        </Grid>
        <Grid item xs={6} className='card-view-group'>
        <AttendencePropayAction record={workerAttendance} {...props}/>
        </Grid>        
      </Grid>         
      </CardContent>
    </Card>
    </Grid>
    );
  })  
  }
    {total === NUMBER.ZERO && <Empty />}
    </Grid>  
    </>
    );
};

export default AttendenceCardListing;

const StartAndEndDate = (props) => {
  const { record } = props;
  const {isManual, isPayPeriod} = useAttendance(props);
  const startDate = get(record, 'start');
  const endDate = get(record, 'end');
  const checkInDate = get(record, 'date');
  const startPeriod = get(record, 'period_start_date');
  const endPeriod = get(record, 'period_end_date');


  const startDateString = moment(startDate).format('MMM DD, YYYY h:mm A');
  const endDateString = moment(endDate).format('MMM DD, YYYY h:mm A');
  const checkInDateString = moment(checkInDate).format('MMM DD, YYYY');
  const startPeriodDateString = moment(startPeriod).format('MMM DD, YYYY');
  const endPeriodDateString = moment(endPeriod).format('MMM DD, YYYY');

  return(
    <>
    {isManual ?
        <><Grid item xs={6} className='card-view-group'>
        <div className='attendence-date-time'>
        <label>Start Date</label>
       {checkInDateString}
       </div>
        </Grid>
        <Grid item xs={6} className='card-view-group'>
        <div className='attendence-date-time'>
          <label>End Date</label>
         Manual
         </div>
        </Grid></>
        :
        (isPayPeriod ? <>
          <Grid item xs={6} className='card-view-group'>
          <div className='attendence-date-time'>
          <label>Start Date</label>
          {startPeriodDateString}
          </div>
          </Grid>
          <Grid item xs={6} className='card-view-group'>
          <div className='attendence-date-time'>
            <label>End Date</label>
            {endPeriodDateString}
            </div>
          </Grid></>
          :
          <>
        <Grid item xs={6} className='card-view-group'>
        <div className='attendence-date-time'>
        <label>Start Date</label>
        {startDateString}
        </div>
        </Grid>
        <Grid item xs={6} className='card-view-group'>
        <div className='attendence-date-time'>
          <label>End Date</label>
          {endDateString}
          </div>
        </Grid></>)
        }
    </>
  )
};

const EployeeName = (props: { id: any; })=> {
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

const JobName = (props: { id: any; })=> {
  const { id } = props;
  const { data } = useGetOne(
    'jobs',
    { id }
);
  return(
    <Typography>
    {data?.full_name}
    </Typography>
  );
};

const PropayName = (props: { id: any; })=> {
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
