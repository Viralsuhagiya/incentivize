import { Typography } from '@mui/material';
import { statusClass } from '../utils/Constants/ConstantData';

/*we are using this componnet to list status with color theme  */
const StatusField = (props: any) => {    
    const { record } = props;
    return(
        <>
        <Typography className={statusClass(record.status)}>{record.status === 'paid' ? 'Closed' : record.status}</Typography>
        </>
    );
};
export default StatusField;
