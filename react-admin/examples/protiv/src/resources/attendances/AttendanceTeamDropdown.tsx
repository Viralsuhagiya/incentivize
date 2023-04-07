import { Avatar, IconButton, Tooltip } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { useNavigate } from 'react-router';

/* Action for listing of cards view and list view */
const AttendanceTeamDropdown = (props: any )=> {
   const navigate = useNavigate();
   const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return(
        <>  
          <div className='card-dropdown attendance-team-dropdown'>    
           <Tooltip title="">
            <IconButton
            className='add-filter'
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
                className='attendance-card-menu'
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0         
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}        
              >
              <MenuItem className='import-attendance-active' onClick={()=> navigate('/attendances/import')}>
                  <ListItemIcon>
                  <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 14.99l1.41-1.41L11 15.16V11h2v4.16l1.59-1.59L16 14.99 12.01 19 8 14.99z" />
                </svg>
                  </ListItemIcon>
                  {/* <input type="file" accept={MIME_TYPE} 
                   onChange={(e) => props.handleFileUpload(e)} 
                  /> */}
                  Import Attendance
                </MenuItem>
                {/* <MenuItem>
                  <ListItemIcon>
                  <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z" />
                </svg>
                  </ListItemIcon>
                  Export Attendance
                </MenuItem>*/}
              </Menu>
          </div>
        </>
    );
};
export default AttendanceTeamDropdown;
