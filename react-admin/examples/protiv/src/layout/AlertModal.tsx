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
import { IconButton, Stack } from '@mui/material';
import { NUMBER } from '../utils/Constants/MagicNumber';

export const AlertModal = (props: any) => {
    const {
        isOpen = false,
        title,
        content,
        confirmColor = 'primary',
        ConfirmIcon = ActionCheck,
        onClose,
        translateOptions = {},
    } = props;

    const translate = useTranslate();
    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);
    const titleName = translate(title, { _: title, ...translateOptions });
    const TitleChange = titleName?.split('#')[NUMBER.ZERO];    
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
            {translate(TitleChange, { _: TitleChange, ...translateOptions })}
                <IconButton
                    sx={{top:-2,paddingLeft:2}}
                    color="primary"
                    aria-label="upload picture"
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </Stack>
            </DialogTitle>
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
                    onClick={onClose}
                    className={classnames('ra-confirm cancel-ra-confirm', {
                        [ConfirmClasses.confirmWarning]:
                            confirmColor === 'warning',
                        [ConfirmClasses.confirmPrimary]:
                            confirmColor === 'primary',
                    })}
                >
                    <ConfirmIcon className={ConfirmClasses.iconPaddingStyle} />
                    Got it!
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
