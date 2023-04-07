import { ListItemIcon } from '@mui/material';

const RemoveEmployee = (props) => {
    const {workerData, setAlertDialog, setWorkerRecord} =props;

    const handleAlert = (data) =>{
        setAlertDialog(true);
        setWorkerRecord(data);
    } 

    return(
        <>
        <div className='remove-employee-div' onClick={()=>handleAlert(workerData)}>
        <ListItemIcon>
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">            
        <path d="M9.804 13.125c.253 0 .495.011.737.023a8.104 8.104 0 0 0-.737 3.352c0 1.676.517 3.229 1.386 4.5H1v-2.981c0-1.159.561-2.261 1.53-2.846a13.937 13.937 0 0 1 7.274-2.048zm10.464-.225.732.725-2.904 2.875L21 19.375l-.732.725-2.904-2.875L14.46 20.1l-.733-.725 2.904-2.875-2.904-2.875.733-.725 2.904 2.875 2.904-2.875zM9.804 3c2.43 0 4.402 2.015 4.402 4.5S12.235 12 9.804 12 5.402 9.985 5.402 7.5 7.372 3 9.804 3z" />
        </svg>
        </ListItemIcon>Remove User</div> 
        </>
    );
};

export default RemoveEmployee;
