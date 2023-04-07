import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import peopleFill from '@iconify/icons-eva/people-fill';
import { alpha } from '@mui/material/styles';
import {Typography, ListItemButton,Box } from '@mui/material';

import MenuPopover from '../../components/MenuPopover';
import {EmployeeAvatar} from './PropayTab';
import { MIconButton } from '../../components/@material-extend';
import {RecordContextProvider,useListContext} from 'react-admin';

// ----------------------------------------------------------------------

const PADDING_ITEM = 2.5;

export default function ContactsPopover(props:any) {
  const { size="large"} = props;
  const { data } = useListContext();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MIconButton
        ref={anchorRef}
        size={size}
        color={'primary'}
        onClick={handleOpen}
        sx={{
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
        }}
      >
        <Icon icon={peopleFill} width={20} height={20}  fr=''/>
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 280 }}
      >
        <Typography variant="h6" sx={{ p: PADDING_ITEM }}>
            Team Members 
        </Typography>

        <Box sx={{ minHeight: 300,maxHeight: window.innerHeight / 2,overflowY:'auto' }}>
          {(props?.choices || data).map((employee) => {
            const { id } = employee;

            return (
                <ListItemButton key={id} sx={{ px: PADDING_ITEM }}>
                    <RecordContextProvider value={employee}>
                        <EmployeeAvatar record={employee}/>
                     </RecordContextProvider>
                </ListItemButton>
            );
          })}
        </Box>
      </MenuPopover>
    </>
  );
}
