import CloseIcon from '@mui/icons-material/Close';
import { Avatar, DialogTitle, IconButton, Tooltip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { CRUD_UPDATE, useMutation, useNotify, useRefresh, useTranslate } from 'react-admin';
import { useGetIdentityOptimized } from '../../components/identity';
import { ConfirmRemoveEmployeeModal } from '../../ConfirmRemoveEmployeeModal';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import RemoveEmployee from './RemoveEmployee';
import { WorkerAttendance } from './WorkerAttendance';


/* Action for listing of worker's assigned on propay detail page */
const WorkerActions = (props: any) => {
  const {record, recordData, refetch } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
  
   const [openviewattendence, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloseviewattendence = () => setOpen(false);
  const translate = useTranslate();
  const { identity } = useGetIdentityOptimized();
  const [mutate] = useMutation();
  const notify = useNotify();
  const refresh = useRefresh();
  const [alertDialog, setAlertDialog] = React.useState(false);
  const [workerRecord, setWorkerRecord] = React.useState<any>(null);
  const [removeEmployeeType, setRemoveEmployeeType] = React.useState<string>('propay_only');


  const handleApprovePropay = () => {
      return mutate(
        {
            type: 'update',
            resource: 'propays',
            payload: {base_wage: workerRecord?.base_wage, employee_id:workerRecord?.employee_id, id: record.id, selection_options:removeEmployeeType,
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



    return (
        <>
            <div className="on-list-dropdown card-dropdown worker-dropdown-list">
                <Tooltip title="">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'card-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar>
                            <svg
                                width="4"
                                height="18"
                                viewBox="0 0 4 18"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                                    fill="#BDBDBD"
                                    fill-rule="evenodd"
                                />
                            </svg>
                        </Avatar>
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    id="card-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem className='view-attendances-item'>
                        <ListItemIcon>
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">    
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />    
                        </svg>
                        </ListItemIcon>
                        <span onClick={handleOpen}> {translate('resources.propays.view_attendances')} </span>
                    </MenuItem>
                    {record.status !== 'paid' && record.status !== 'approved' && identity.user_type !== 'worker' &&<MenuItem className='remove-employee-item'>
                    <RemoveEmployee record={record} workerData={recordData} setAlertDialog={setAlertDialog} setWorkerRecord={setWorkerRecord}/>
                    </MenuItem>}
                </Menu>

                    <Dialog
                        open={openviewattendence}
                        onClose={handleCloseviewattendence}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className="common-diaglog-modal view-attendence-modal"
                      >
                        <DialogTitle className="user-working-title">{translate('resources.propays.view_attendances')}
                        <IconButton
                          aria-label="close"
                          onClick={handleCloseviewattendence}
                          sx={{
                            position: 'absolute',
                            right: NUMBER.EIGHT,
                            top: NUMBER.EIGHT,
                            color: (theme) => theme.palette.grey[NUMBER.FIVE_HUNDRED],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>        
                        </DialogTitle>
                        <WorkerAttendance propayId={record.id} workerId={recordData.employee_id} refetch={refetch}/>
                      </Dialog>
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
export default WorkerActions;
