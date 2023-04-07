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
import { ConfirmClasses, ConfirmProps } from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack } from '@mui/material';
import { NUMBER } from '../utils/Constants/MagicNumber';

export const Confirm = (props: ConfirmProps) => {
    const {
        isOpen = false,
        loading,
        title,
        content,
        confirm = 'ra.action.confirm',
        confirmColor = 'primary',
        ConfirmIcon = ActionCheck,
        onClose,
        onConfirm,
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

    return (
        <StyledDialog
            open={isOpen}
            onClose={onClose}
            onClick={handleClick}
            aria-labelledby="alert-dialog-title"
            className='common-diaglog-modal'
        >   
        
        <DialogTitle id="alert-dialog-title">
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                {translate(title, { _: title, ...translateOptions })}
                <IconButton
                    sx={{top:-2,paddingLeft:2}}
                    color="primary"
                    aria-label="upload picture"
                    disabled={loading} 
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </Stack>
            </DialogTitle>
            {/* <DialogTitle id="alert-dialog-title">
                {translate(title, { _: title, ...translateOptions })}
            </DialogTitle> */}

            <DialogContent>
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
            </DialogContent>
            <DialogActions>
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
                    {translate(confirm, { _: confirm })}
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
