import { Avatar, IconButton, Tooltip } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { useGetIdentityOptimized, usePermissionsOptimized } from '../components/identity';
import { canAccess } from '../ra-rbac';
import { getIntegratedNonIntegrated } from '../resources/attendances/Attendance';
import { HasBackendNotConnected } from '../resources/company/company';
import { NUMBER } from '../utils/Constants/MagicNumber';
import ApprovePropayAction from './CradActions/ApprovePropayAction';
import PropayCancelAction from './CradActions/PropayCancelAction';
import PropayDeleteAction from './CradActions/PropayDeleteAction';
import UserDetailsModal from './UserDetailsModal';


/* Action for listing of cards view and list view */
const CardListActions = (props: any )=> {
    const { record, onList, onShowPage, refresh } = props;
    const navigate = useNavigate();
    const translate = useTranslate();
    

    const { permissions } = usePermissionsOptimized(); 

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const [openModal, setOpenModal] = React.useState(false);
    const [deletePropay, seDeletePropay] = React.useState(false);
    const [cancelPropay, seCancelPropay] = React.useState(false);
    const { identity } = useGetIdentityOptimized();


    const [wageIds, setWageIds] = React.useState([]);
  
    const [propayId, setPropayId] = React.useState<number>();


    const handleOpenWorkerDetails = (wageId, id: number) => {
      setPropayId(id)
      const arr = [];
      wageId && wageId.forEach((item)=> arr.push(item.id));
      setOpenModal(true);
      setWageIds(arr);
    };
  
    const editPropay = (PropayId: number) => navigate(`/edit/${PropayId}/propay`);
    const showPropay = (PropayId: number) => navigate(`/show/${PropayId}/propay`);

    const canAction =  canAccess({ permissions, resource: 'propays', action: 'cancel_propay' });
    const userCanEdit =  canAccess({ permissions, resource: 'propays', action: 'edit' });

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
           {userCanEdit && !onList && <ApprovePropayAction record={record} refresh={refresh}/>}
            {userCanEdit && <MenuItem onClick={() => editPropay(record.id)} disabled={!userCanEdit}>
              <ListItemIcon>
              <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.75 15.813v3.437h3.438L16.325 9.112l-3.438-3.438L2.75 15.813zm16.234-9.36a.913.913 0 0 0 0-1.292L16.84 
                    3.016a.913.913 0 0 0-1.292 0l-1.678 1.677 3.438 3.438 1.677-1.678z" />
            </svg>
              </ListItemIcon>
              {translate("resources.propays.actions.edit_propay")}
            </MenuItem>}            
             {getIntegratedNonIntegrated(identity) && 
             canAccess({ permissions, resource: 'attendances', action: 'create'}) && !onShowPage &&
             <HasBackendNotConnected>
             <MenuItem onClick={() => navigate('/attendances/create', { state: { record } })}>
              <ListItemIcon>
              <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">       
            <path d="M11 1.833c-5.042 0-9.167 4.125-9.167 9.167S5.958 20.167 11 20.167s9.167-4.125 
            9.167-9.167S16.042 1.833 11 1.833zm3.85 13.017-4.767-2.933v-5.5h1.375v4.766l4.125 2.475-.733 1.192z" />
            </svg>
              </ListItemIcon>
              {translate("resources.propays.actions.add_time")}
            </MenuItem>
            </HasBackendNotConnected>
            }
            {!onShowPage && <MenuItem onClick={() => showPropay(record.id)}>
              <ListItemIcon>          
            <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.417 2.75H4.583A1.839 1.839 0 0 0 2.75 4.583v12.834c0 1.008.825 1.833 1.833 1.833h12.834a1.839 1.839 0 0 0 1.833-1.833V4.583a1.839 
                    1.839 0 0 0-1.833-1.833zm-4.584 12.833H6.417V13.75h6.416v1.833zm2.75-3.666H6.417v-1.834h9.166v1.834zm0-3.667H6.417V6.417h9.166V8.25z" />
            </svg>
              </ListItemIcon>
              {translate("resources.propays.actions.view_propay_details")}
            </MenuItem>}
            {(!onShowPage && record?.hours) ? <MenuItem onClick={() => handleOpenWorkerDetails(record.employee_wage_ids, record.id) }>
              <ListItemIcon>          
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 5v14h2V5h-2zm-4 14h2V5h-2v14zM14 5H2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 
                  1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zM8 7.75c1.24 0 2.25 1.01 2.25 2.25S9.24 12.25 8 12.25 5.75 11.24 5.75 10 6.76 7.75 
                  8 7.75zM12.5 17h-9v-.75c0-1.5 3-2.25 4.5-2.25s4.5.75 4.5 2.25V17z" />
               </svg>
              </ListItemIcon>
              {translate("resources.propays.actions.user_working_details")}
            </MenuItem>: ''}
            {record?.hours > NUMBER.ZERO && canAction && record.status !=='cancelled' && <MenuItem onClick={() => seCancelPropay(true)} disabled={!canAction}>
              <ListItemIcon>          
                <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.75 2.75v16.5h16.5V2.75H2.75zm12.833 11.54-1.292 1.293L11 12.293l-3.29 3.29-1.293-1.292L9.707 11l-3.29-3.29 1.292-1.293L11 
                        9.707l3.29-3.29 1.293 1.292L12.293 11l3.29 3.29z" />
                </svg>
              </ListItemIcon>
              {translate("resources.propays.actions.cancel_propay")}
            </MenuItem>}
            {record?.hours <= NUMBER.ZERO && canAction && <MenuItem onClick={() =>seDeletePropay(true)} disabled={!canAction}>
              <ListItemIcon>
              <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 17.417c0 1.008.825 1.833 1.833 1.833h7.334a1.839 1.839 0 0 0 
            1.833-1.833v-11h-11v11zm11.917-13.75h-3.209l-.916-.917H8.708l-.916.917H4.583V5.5h12.834V3.667z" />
            </svg>
              </ListItemIcon>
              {translate("resources.propays.actions.delete_propay")}
            </MenuItem>}
            {userCanEdit && onList && <ApprovePropayAction record={record} />}
          </Menu>
          </div>
          {wageIds.length > NUMBER.ZERO  && <UserDetailsModal openModal={openModal} close={setOpenModal} wageId={wageIds} propayId={propayId} />}
          {cancelPropay && <PropayCancelAction cancelPropay={cancelPropay} cancelClose={seCancelPropay} route={onShowPage ? true : false} {...props}/>}
          {deletePropay && <PropayDeleteAction deletePropay={deletePropay} DeleteClose={seDeletePropay} route={onShowPage ? true : false} {...props}/>}

        </>
    );
};
export default CardListActions;
