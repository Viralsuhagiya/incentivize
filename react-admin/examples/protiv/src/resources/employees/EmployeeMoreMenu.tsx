import { Icon } from '@iconify/react';
import { useCallback, useRef, useState } from 'react';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import EditIcon from '@mui/icons-material/Edit';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText} from '@mui/material';
import { MenuItemLink, Record } from 'react-admin';
import useArchiveEmployee from './useArchiveEmployee';
import useUnarchiveEmployee from './useUnarchiveEmployee';

import { useTranslate } from 'ra-core';
import { useCanAccess } from '../../ra-rbac';

type EmployeeMoreMenuProps = {
  record: Record;
};

export default function EmployeeMoreMenu({ record }: EmployeeMoreMenuProps) {
  const translate = useTranslate();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const onSuccess = useCallback(()=>{
    setIsOpen(false);
  },[setIsOpen])
  
  const { archive }  = useArchiveEmployee({selectedIds:[record.id], onSuccess});  
  const { activate }  = useUnarchiveEmployee({selectedIds:[record.id], onSuccess});
  const {loaded, canAccess} = useCanAccess({action:'read',resource:'menu-companies'});
  const isPlatformManager = loaded&&canAccess;

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon fr='' icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItemLink
          onClick={()=>{setIsOpen(false);}}
          to={`${record.id}/edit`}
          primaryText={translate('ra.action.edit')}
          leftIcon={<EditIcon />}
          >
        </MenuItemLink>

        {(!record.is_owner||isPlatformManager)&&<MenuItemLink
          onClick={()=>{setIsOpen(false);}}
          to={`${record.id}/invite`}
          primaryText={(record.status==='draft')?translate('resources.employees.action.manageInvite'):translate('resources.employees.action.resend_invite')}
          leftIcon={<ManageAccountsIcon />}
          >
        </MenuItemLink>}
        {!record.is_owner&&record.active&&
          <MenuItem onClick={() => archive()}>
            <ListItemIcon>
              <ArchiveIcon />
            </ListItemIcon>
            <ListItemText primary={translate('resources.employees.action.archive')} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        }
        {!record.is_owner&&!record.active&&
          <MenuItem onClick={() => activate()}>
            <ListItemIcon>
              <UnarchiveIcon />
            </ListItemIcon>
            <ListItemText primary={translate('resources.employees.action.activate')} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        }
      </Menu>
    </>
  );
}
