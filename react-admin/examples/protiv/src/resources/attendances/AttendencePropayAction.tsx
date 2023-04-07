import { Avatar, IconButton, Tooltip } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdentityContext } from '../../components/identity';
import DeleteButton from '../../ra-editable-datagrid/buttons/DeleteButton';
import { getIntegratedNonIntegrated } from './Attendance';


/* Action for listing of cards view and list view */
const AttendencePropayAction = (props: any )=> {
    const { onList, record } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const navigate = useNavigate();
    const identity = useIdentityContext();

    const editAttendance = (attendanceId: number) => navigate(`/attendances/${attendanceId}/edit`);

    const allowEditable = (attendanceRecord:any) => {
      return attendanceRecord.status==='pending' && identity?.allow_to_add_time && !attendanceRecord.locked;
  }

    return(
        <>  
        <div className={`${onList ? 'on-list-dropdown card-dropdown' : 'card-dropdown'}`}>    
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
            <svg width="4" height="18" viewBox="0 0 4 18" xmlns="http://www.w3.org/2000/svg">
             <path d="M2 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" 
               fill="#BDBDBD" fill-rule="evenodd"/>
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
              elevation: 0         
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}        
          >           
            {allowEditable(record) && <MenuItem onClick={() => editAttendance(record?.id)}>
              <ListItemIcon>
              <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.75 15.813v3.437h3.438L16.325 9.112l-3.438-3.438L2.75 15.813zm16.234-9.36a.913.913 0 0 0 0-1.292L16.84 
                    3.016a.913.913 0 0 0-1.292 0l-1.678 1.677 3.438 3.438 1.677-1.678z" />
            </svg>
              </ListItemIcon>
              Edit
            </MenuItem>}
            {getIntegratedNonIntegrated(identity) && allowEditable(record) && <MenuItem className="delete-attendance" onClick={handleClose}>
             <ListItemIcon>
              <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 17.417c0 1.008.825 1.833 1.833 1.833h7.334a1.839 1.839 0 0 0 
            1.833-1.833v-11h-11v11zm11.917-13.75h-3.209l-.916-.917H8.708l-.916.917H4.583V5.5h12.834V3.667z" />
            </svg>
              </ListItemIcon>
              <DeleteButton resource={'attendances'} undoable={false} record={props.record} {...props} closeDropdown={handleClose} />
            </MenuItem>}
          </Menu>
          </div>
        </>
    );
};
export default AttendencePropayAction;
