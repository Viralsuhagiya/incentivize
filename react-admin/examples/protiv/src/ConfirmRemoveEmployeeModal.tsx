import ActionCheck from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, styled } from '@mui/material/styles';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';
import { useCallback } from 'react';
import { ConfirmClasses } from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, FormControlLabel, Grid, IconButton, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { NUMBER } from './utils/Constants/MagicNumber';

export const ConfirmRemoveEmployeeModal = (props: any) => {
    const {
        isOpen = false,
        loading,
        title,
        content,
        confirmColor = 'primary',
        ConfirmIcon = ActionCheck,
        onClose,
        onConfirm,
        removeEmployeeType, 
        setRemoveEmployeeType,
        translateOptions = {},
    } = props;

    const translate = useTranslate();

    const handleConfirm = useCallback(
        e => {
            e.stopPropagation();
            onConfirm(e);
        },
        [onConfirm]
    );

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);
    const titleName = translate(title, { _: title, ...translateOptions });
    const TitleChange = titleName?.split('#')[NUMBER.ZERO];  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRemoveEmployeeType((event.target as HTMLInputElement).value);
      };
    return (
        <StyledDialog
            open={isOpen}
            onClose={onClose}
            onClick={handleClick}
            aria-labelledby="alert-dialog-title"
            className='common-diaglog-modal remove-employee-modal'
        >   
        
        <DialogTitle id="alert-dialog-title">
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
            {translate(TitleChange, { _: TitleChange, ...translateOptions })}
                <IconButton
                    sx={{top:-2,paddingLeft:2}}
                    color="primary"
                    aria-label="Confirm Remove Employee"
                    disabled={loading} 
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </Stack>
            </DialogTitle>
            <DialogContent>            
            
            <Grid className='mapping-field-msg remove-mapping-field'>
            <Typography>If you remove a user from the ProPay then all their attendance entries will be un-matched.</Typography>
            </Grid>

                {typeof content === 'string' ? (
                    <DialogContentText>
                        {translate(content, {
                            _: content,
                            ...translateOptions,
                        })}
                    </DialogContentText>
                ) : (
                    content
                )}
                    <Grid className='calculate-bonus-item' item lg={12} md={12} sm={12} xs={12}>
                    <FormControl>                       
                    <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={removeEmployeeType}
                            onChange={handleChange}
                        >                                       
                            <FormControlLabel value='propay_only' control={<Radio />} label='ProPay Only' />
                            <FormControlLabel value='propay_and_job' control={<Radio />} label='ProPay & Job'/>
                        </RadioGroup>
                        </FormControl>
                    </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={loading}
                    onClick={onClose}
                    className={classnames('ra-confirm cancel-ra-confirm', {
                        [ConfirmClasses.confirmWarning]:
                            confirmColor === 'warning',
                        [ConfirmClasses.confirmPrimary]:
                            confirmColor === 'primary',
                    })}
                >
                    <ConfirmIcon className={ConfirmClasses.iconPaddingStyle} />
                    Cancel
                </Button>
                <Button
                    disabled={loading}
                    onClick={handleConfirm}
                    className={classnames('ra-confirm', {
                        [ConfirmClasses.confirmWarning]:
                            confirmColor === 'warning',
                        [ConfirmClasses.confirmPrimary]:
                            confirmColor === 'primary',
                    })}
                    autoFocus
                >
                    <ConfirmIcon className={ConfirmClasses.iconPaddingStyle} />
                    Confirm
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

const PREFIX = 'RaConfirm';

const StyledDialog = styled(Dialog, { name: PREFIX })(({ theme }) => ({
    [`& .${ConfirmClasses.confirmPrimary}`]: {
        color: theme.palette.primary.main,
    },

    [`& .${ConfirmClasses.confirmWarning}`]: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, NUMBER.ZERO_POINT_ONE_TWO),
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },

    [`& .${ConfirmClasses.iconPaddingStyle}`]: {
        paddingRight: '0.5em',
    },
}));
