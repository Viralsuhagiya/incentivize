import { Typography } from '@mui/material';
import * as React from 'react';
import { MAvatar } from '../components/@material-extend';
import { InfoLabel } from '../components/fields/InfoLabel';
import Label from '../components/Label';
import { StyledTypography } from '../resources/payrolls/Payrolls';
import { NUMBER } from '../utils/Constants/MagicNumber';
import createAvatar from '../utils/createAvatar';


const UserAvtarAndName = (props: any) => {
    const { record, is_remove_bonus } = props;
  const userAvatar = createAvatar(record?.first_name, record?.last_name);  
    return (
        <>
        <MAvatar variant="square" color={userAvatar.color} sx={{ width: NUMBER.THIRTY, height: NUMBER.THIRTY }}>
            <Typography variant="inherit">
                {userAvatar.name}
            </Typography>
        </MAvatar>
        <Typography>
            {record?.display_name}{' '}
            {is_remove_bonus && 
        <Label
            variant="ghost"
            color={'pending'}
        >
            No Bonus
        </Label>}
        {!record.active && 
        <Label
            variant="ghost"
            color={'pending'}
        >
            Deact.
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
export default UserAvtarAndName;
