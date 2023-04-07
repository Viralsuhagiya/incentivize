import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Tooltip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useListContext, useTranslate, useMutation, useNotify,useRefresh, CRUD_UPDATE } from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import Label from '../../components/Label';
import { StyledTypography } from '../../resources/payrolls/Payrolls';
import { truncateString, timeLogged } from '../../utils/Constants/ConstantData';
import { LabelAvatars } from '../../layout/CardListView';
import { InfoLabel } from '../../components/fields/InfoLabel';
import {WorkerAttendance} from '../propays/WorkerAttendance';
import RemoveEmployee from './RemoveEmployee';
import { useGetIdentityOptimized } from '../../components/identity';
import { ConfirmRemoveEmployeeModal } from '../../ConfirmRemoveEmployeeModal';

const WorkerTableResponsive = (props: any) => {
    const { value, refetch } = props;
    const { data, total } = useListContext();
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        });
    const translate = useTranslate();
    const { identity } = useGetIdentityOptimized();
    const [mutate] = useMutation();
    const notify = useNotify();
    const refresh = useRefresh();
    const [alertDialog, setAlertDialog] = React.useState(false);
    const [workerRecord, setWorkerRecord] = React.useState<any>({});
    const [removeEmployeeType, setRemoveEmployeeType] = React.useState<string>('propay_only');
  
    const handleApprovePropay = () => {
        return mutate(
          {
              type: 'update',
              resource: 'propays',
              payload: {base_wage: workerRecord?.base_wage, employee_id:workerRecord?.employee_id, id: value.id,selection_options:removeEmployeeType,
                action: 'removeEmployeeWage'
            }, 
          },
          {
              mutationMode: 'pessimistic',
              action: CRUD_UPDATE,
              onSuccess: () => {
                setAlertDialog(false);
                refresh();
                notify(`Employee Removed`);
              },
              onFailure: error => {
                setAlertDialog(false);
                notify(`Failure ! ${error.message}`);
              }
          }
      );
    };
  
return(
        <><div>
        {total && data.map((worker) => {
            const amountIncrease = worker.pay_rate ? worker.pay_rate - worker.base_wage : 0;
            const percentageIncrease = (amountIncrease / worker.base_wage) * NUMBER.HUNDRED;
            return (
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="worker1a-header"
                        className="worker-table-expand"
                    >
                        <div className="workder-detail-header">
                            <LabelAvatars name={worker.employee_id_obj.name} />
                            <div className="workder-detail-header-right">
                                <Typography variant="h4" gutterBottom>
                                    <WorkerName name={worker.employee_id_obj.name} record={worker} />
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>Total Bonus: {formatter.format(worker.bonus)}</Typography>
                            </div>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid className="worker-detail-ts" container spacing={2}>
                            <Grid item xs={4}>
                                <div className="worker-detail-field">
                                    <label>
                                        {translate('resources.propays.wage')}
                                    </label>
                                    <strong>{formatter.format(worker.base_wage)}</strong>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="worker-detail-field">
                                    <label>
                                        {translate('resources.propays.hours')}
                                    </label>
                                    <strong>{timeLogged(worker.hours)}</strong>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="worker-detail-field">
                                    <label>
                                        {translate('resources.propays.base_pay')}
                                    </label>
                                    <strong>{formatter.format(worker.base_pay)}</strong>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="worker-detail-field">
                                    <label>
                                        {translate('resources.propays.bonus')}
                                    </label>
                                    <strong>{formatter.format(worker.bonus)}</strong>
                                </div>
                            </Grid>
                            {value?.is_change_lead_pay && <Grid item xs={4}>
                                <div className="worker-detail-field">
                                    <label>
                                        {translate('resources.propays.lead_pay')}
                                    </label>
                                    <strong>{formatter.format(worker.lead_pay)}</strong>
                                </div>
                            </Grid>}
                            <Grid item xs={4}>
                                <div className="worker-detail-field">
                                    <label>
                                        {translate('resources.propays.total')}
                                    </label>
                                    <strong>{formatter.format(worker.propay_earning)}</strong>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="worker-detail-field">
                                    <label>
                                        {translate('resources.propays.propay_rate')}
                                    </label>
                                    <strong>{formatter.format(worker.pay_rate)}</strong>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="worker-detail-field">
                                    <label>
                                        {translate('resources.propays.bonus_percentage')}
                                    </label>
                                    <strong>{`${worker.bonus_per === NUMBER.ZERO ? `${worker.bonus_per}` : parseFloat((worker.bonus_per * NUMBER.HUNDRED).toString()).toFixed(NUMBER.TWO)}%`}</strong>
                                </div>
                            </Grid>
                            <Grid item xs={4}>
                                <div className="worker-detail-field">
                                    <label>
                                        {translate('resources.propays.percentage_increase')}
                                    </label>
                                    <strong>{`${percentageIncrease === NUMBER.ZERO ? percentageIncrease : parseFloat(percentageIncrease.toString()).toFixed(NUMBER.TWO)}%`}</strong>
                                </div>
                            </Grid>
                        </Grid>
                        {value?.status !== 'paid' && <Accordion className="worker-attendence-accordion">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="worker1a-sub-header"
                                className="worker-table-attendence-expand"
                            >
                                <div className="workder-attendence-header">Attendances</div>
                            </AccordionSummary>
                            <AccordionDetails>
                                <WorkerAttendance propayId={value.id} workerId={worker.employee_id} refetch={refetch} />
                            </AccordionDetails>
                        </Accordion>}
                        {value.status !== 'paid' && value.status !== 'approved' &&
                            identity.user_type !== 'worker' && <RemoveEmployee record={value} workerData={worker} setAlertDialog={setAlertDialog} setWorkerRecord={setWorkerRecord}/>}

                    </AccordionDetails>
                </Accordion>
            );
        })}
    </div>
    <ConfirmRemoveEmployeeModal
                  removeEmployeeType={removeEmployeeType}
                  setRemoveEmployeeType={setRemoveEmployeeType}
                  isOpen={alertDialog}
                  loading={false}
                  title={`Remove User`}
                  content={`Please confirm how you want to unlink ${workerRecord?.employee_id_obj?.name}'s entries from this ProPay.`}
                  onClose={()=> setAlertDialog(false)}
                  onConfirm={handleApprovePropay}
        />
    </>
    );
};

export default WorkerTableResponsive;


const WorkerName = (props: any) => {
    const {name, record } = props;
    
    return(
        <>
        <Typography>
        {name?.length > NUMBER.TWENTY_ONE ? <Tooltip title={name} placement="bottom" arrow>
        <span>{name && truncateString(name.toString())}</span>
        </Tooltip>
        :
        <span>{name && truncateString(name.toString())}</span>
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
