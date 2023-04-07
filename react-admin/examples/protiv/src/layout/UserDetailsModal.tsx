import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Theme, useMediaQuery } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useGetList, useGetOne, useTranslate } from 'react-admin';
import { MAvatar } from '../components/@material-extend';
import get from 'lodash/get';
import createAvatar from '../utils/createAvatar';
import { NUMBER } from '../utils/Constants/MagicNumber';
import { timeLogged } from '../utils/Constants/ConstantData';
import moment from 'moment';
import { useIdentityContext } from '../components/identity';

const UserDetailsModal = (props: any) => {
    const { close, openModal, propayId } = props;
    const identity = useIdentityContext();
    const hideBonus = identity?.company?.hide_bonuses_from_other_workers
  const handleClose = () => {
    close(false);
  };

  const  { data, total } = useGetList(
    'workerDetails',
    { filter: {propay_id: {_eq: propayId}} }
);


const isXSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
const translate = useTranslate();
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  });

    return(
        <>
        <Dialog
        open={openModal}
        onClose={handleClose}
        aria-labelledby="popup-user-dialog-title"
        aria-describedby="popup-user-dialog-description"
        className="popup-user-modal"
      >
        <DialogTitle className="user-working-title">
        {translate('resources.propays.user_working_details.title')}
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
        <DialogContent>
          <DialogContentText className="user-working-description">
          <TableContainer component={Paper}>
      <Table aria-label="User Working Table">
        <TableHead>
          <TableRow>
            <TableCell component="th">{translate('resources.propays.user_working_details.name')}</TableCell>
            <TableCell component="th">{translate('resources.propays.user_working_details.date')}</TableCell>
            <TableCell component="th">{translate('resources.propays.user_working_details.hours')}</TableCell>
            {!hideBonus && <TableCell component="th">{translate('resources.propays.user_working_details.bonus')}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
        {total > NUMBER.ZERO && data.map((item) => {
            return(
              <TableRow>
              <TableCell component="td" scope="row">
                <div className='user-working-th'>
                <LabelAvatars  id={item.employee_id} />
                </div>
              </TableCell>
              <TableCell>{item?.from_date && moment(item?.from_date).format('MM-DD-YYYY')} ~ {item?.to_date && moment(item?.to_date).format('MM-DD-YYYY')} </TableCell>
              <TableCell>{timeLogged(item.hours)}</TableCell>
              {!hideBonus && <TableCell>{formatter.format(item?.bonus)}</TableCell>}
            </TableRow>
            );
        }) }
        </TableBody>
      </Table>
    </TableContainer>
          </DialogContentText>
        </DialogContent>
      </Dialog>
        </>
    );
};

export default UserDetailsModal;

const LabelAvatars = (props: any) => {
    const { id } = props;
    const { data } = useGetOne(
      'employees',
      { id }
  );
  const firstName =data?.first_name && get(data?.first_name.split(' ',NUMBER.TWO), NUMBER.ZERO,'');
  const lastName = data?.last_name && get(data?.last_name.split(' ',NUMBER.TWO), NUMBER.ZERO,'');
  const avatar = createAvatar(firstName, lastName);
    return (
        <>
        <MAvatar color={avatar.color} sx={{ width: NUMBER.THIRTY, height: NUMBER.THIRTY }}>
            <Typography variant="inherit">
                {avatar.name}
            </Typography>
        </MAvatar>
        <Typography>
            {data?.display_name}
        </Typography>
        </>
    );
  };
