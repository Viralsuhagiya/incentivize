import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Grid, Hidden } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import React from 'react';
import { BooleanInput, SaveButton, useRedirect, useRefresh } from 'react-admin';
import { StyleToolbar } from '../payrolls/Payrolls';
import { useQueryClient } from 'react-query';

const options = ['Save & New','Save & Close'];

export const EmployeeSaveToolbar = (props:any) => {
  return (<>
      <Hidden smUp>
        <StyleToolbar sx={{ backgroundColor: '#FFF', }} {...props} >
            <Grid>
              <EmpSaveToolbar {...props}/>
            </Grid>
        </StyleToolbar>
      </Hidden>
      <Hidden smDown>
      <StyleToolbar sx={{ backgroundColor: '#FFF', flex: 1, justifyContent: 'space-between', }} {...props} >
          <EmpSaveToolbar {...props}/>
      </StyleToolbar>
      </Hidden>
    </>)
}

export const EmpSaveToolbar = (props:any) => {
    const [open, setOpen] = React.useState(false);
    const redirect = useRedirect();
    const refresh = useRefresh();
    const queryClient = useQueryClient();
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleMenuItemClick = (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      index: number,
    ) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };
    
    const handleClose = (event: Event) => {
      if (
        anchorRef.current &&
        anchorRef.current.contains(event.target as HTMLElement)
      ) {
        return;
      }
  
      setOpen(false);
    };
    
    const onSuccess = () => {
      queryClient.invalidateQueries(['employees','getList']);
      if (options[selectedIndex] === 'Save & New'){
        refresh()
        redirect(`/employees/create`);
      } else {
        redirect(`/employees`);
      }
  };

    return (
      <>
      {!props?.record?.id && 
          <BooleanInput style={{marginTop:16}}  source="auto_sent_invite" />
      }
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
          <SaveButton {...props} label={options[selectedIndex]} icon={<></>} onSuccess={onSuccess}/>
          <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          >
          <ArrowDropDownIcon />
          </Button>
      </ButtonGroup>
      <Popper
          style={{
            zIndex: 1,
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
      >
          {({ TransitionProps, placement }) => (
          <Grow
              {...TransitionProps}
              style={{
              transformOrigin:
                  placement === 'bottom' ? 'bottom-start' : 'center bottom',
              }}
          >
              <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                      <MenuItem
                      disabled={index === selectedIndex}
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                      >
                      {option}
                      </MenuItem>
                  ))}
                  </MenuList>
              </ClickAwayListener>
              </Paper>
          </Grow>
          )}
      </Popper>
  </>
    )
}
