import moment from 'moment';
import { useEffect } from 'react';
import PaidGreen from '../../assets/paid-green-24-dp-1.svg';
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
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { Grid } from '@mui/material';

const PropayCompletedBudget = ({ ...props }) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <>
            <div className='completed-budget-box'>
                <div className='budget-box-icon'>
                    <img src={PaidGreen} alt='' className='paid-green-icon-budget' />
                </div>
                <div className='budget-media-body'>
                    <p>Completed Budget</p>
                    <h3>$1050.21</h3>
                    <p className='budget-blue-text'>20 Budget Pending</p>
                </div>
                <div className='budget-media-body-sidebar'>
                    <p className='current-text-orange'>Current</p>
                    <button className='preview-bonus-btn' onClick={handleOpen}>Preview Bonus</button>
                </div>
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="popup-user-dialog-title"
                aria-describedby="popup-user-dialog-description"
                className="popup-user-modal preview-bonus-modal"
            >
                <DialogTitle className="user-working-title">
                    Preview Bonus
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

                    <Grid className='mapping-field-msg remove-mapping-field'>
                        <Typography>This is just a projected number assuming all costs have been added.</Typography>
                    </Grid>

                    <DialogContentText className="user-working-description">
                        <TableContainer component={Paper}>
                            <Table aria-label="User Working Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th">Date</TableCell>
                                        <TableCell component="th">Bonus</TableCell>
                                        <TableCell component="th">Cost</TableCell>
                                        <TableCell component="th">Actuals</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Nov 01, 2022 ~ Nov 07, 2022</TableCell>
                                        <TableCell>$110.69</TableCell>
                                        <TableCell>$501.11</TableCell>
                                        <TableCell>$116.67</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContentText>
                </DialogContent>
            </Dialog>

                {/* Assigned propay modal  */}
            {/* <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="popup-user-dialog-title"
                aria-describedby="popup-user-dialog-description"
                className="popup-user-modal assign-propay-modal"
            >
                <DialogTitle className="user-working-title">
                Assign ProPay
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
                            <Table aria-label="Assign Propay Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell component="th">Title</TableCell>
                                        <TableCell component="th">Job</TableCell>
                                        <TableCell component="th">Manager</TableCell>
                                        <TableCell component="th">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Forest building, park and plumbing</TableCell>
                                        <TableCell>Painting a chemical factory</TableCell>
                                        <TableCell>Jeremiah Hutcherson</TableCell>
                                        <TableCell><button className='assigned-draft-btn'>Draft</button></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Forest Park - Buildings</TableCell>
                                        <TableCell>Factory painting</TableCell>
                                        <TableCell>Ricky Williams</TableCell>
                                        <TableCell><button className='assigned-pending-btn'>Pending</button></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Forest building, park and plumbing</TableCell>
                                        <TableCell>...</TableCell>
                                        <TableCell>Ricky Williams</TableCell>
                                        <TableCell><button className='assigned-pending-btn'>Pending</button></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContentText>
                </DialogContent>
            </Dialog> */}

        </>
    );
};
export default PropayCompletedBudget;