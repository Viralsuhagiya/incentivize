import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tooltip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useGetList, useGetOne } from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import Label from '../../components/Label';
import { StyledTypography } from '../../resources/payrolls/Payrolls';
import { truncateString, timeLogged } from '../../utils/Constants/ConstantData';
import createAvatar from '../../utils/createAvatar';
import get from 'lodash/get';
import { MAvatar } from '../../components/@material-extend';
import { useIdentityContext } from '../../components/identity';
import { InfoLabel } from '../../components/fields/InfoLabel';


const OtherWorkerDetails = (props: any) => {
    const { propayId } = props;
    const identity = useIdentityContext();
    const  { data, total } = useGetList(
        'workerDetails',
        { filter: {propay_id: {_eq: propayId}} }
    );
    const workerDetails = total && data.filter((empId) => empId.employee_id !== identity.employee_id)
    const hideBonus = identity?.company?.hide_bonuses_from_other_workers
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        });

    return(
     <div>
      
      <Grid className="other-worker-grid" container spacing={2}>         
       {(total && workerDetails) && workerDetails.map((worker) => {
        return(

        <Grid item xs={12} md={4} className="other-worker-grid-item">
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="bonusdetail1a-header"
            className="worker-table-expand"
            >
                <div className="workder-detail-header">            
                <LabelAvatarName id={worker.employee_id} />
                <div className="workder-detail-header-right">
                <Typography variant="h4" gutterBottom>
                    <WorkerName id={worker.employee_id} record={worker}/>
                </Typography>
                {!hideBonus && <Typography variant="subtitle1" gutterBottom>Total Bonus: {formatter.format(worker.bonus)}</Typography>}
                </div>
                </div>
            </AccordionSummary>
            <AccordionDetails>
            <Grid className="worker-detail-ts" container spacing={2}>        
            <Grid item xs={4}>
                <div className="worker-detail-field">
                    <label>
                    Hours
                    </label>
                    <strong>{timeLogged(worker.hours)}</strong>
                </div>
            </Grid>              
            {!hideBonus && <Grid item xs={4}>
                <div className="worker-detail-field">
                    <label>
                    Total Bonus
                    </label>
                    <strong>{formatter.format(worker.bonus)}</strong>
                </div>
            </Grid>}
            </Grid>
            </AccordionDetails>
        </Accordion>
        </Grid>
        );
    })
      }
      </Grid>      
    </div>
       
    );
};

export default OtherWorkerDetails;


const WorkerName = (props: any) => {
    const {id, record } = props;
    
    const { data } = useGetOne(
        'employees',
        { id }
    );

    return(
        <>
        <Typography>
        {data?.display_name?.length > NUMBER.TWENTY_ONE ? <Tooltip title={data?.display_name} placement="bottom" arrow>
        <span>{data?.display_name && truncateString(data.display_name.toString())}</span>
        </Tooltip>
        :
        <span>{data?.display_name && truncateString(data?.display_name.toString())}</span>
        }            {record?.is_remove_bonus && 
        <Label
            variant="ghost"
            color={'pending'}
        >
            No Bonus
        </Label>}        
       
        {record?.is_propay_assigned_by_themselves && 
            <InfoLabel sx={{color:'red'}} height={15} icon="ri:error-warning-fill">
                <StyledTypography>Worker assigned themselves to ProPay.</StyledTypography>
            </InfoLabel>
        }
        </Typography>
        </>
    );
};


const LabelAvatarName = (props: any) => {
    const { id } = props;
    const { data } = useGetOne(
      'employees',
      { id }
  );
  const firstName =data?.first_name && get(data?.first_name.split(' ',NUMBER.TWO), NUMBER.ZERO,'');
  const lastName = data?.last_name && get(data?.last_name.split(' ',NUMBER.TWO), NUMBER.ZERO,'');
  const avatar = createAvatar(firstName, lastName);
    return (
        <>
        <MAvatar color={avatar.color} sx={{ width: NUMBER.THIRTY, height: NUMBER.THIRTY }}>
            <Typography variant="inherit">
                {avatar.name}
            </Typography>
        </MAvatar>
        </>
    );
  };
