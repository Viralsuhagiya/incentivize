import CloseIcon from '@mui/icons-material/Close';
import {
    Dialog, DialogContent, DialogTitle, IconButton,
    Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, {
    forwardRef, useEffect, useImperativeHandle,
    useState
} from 'react';
import { NUMBER } from '../utils/Constants/MagicNumber';


export const DialogConentFormDashboard =(props:any)=>{
    const { onClose,open ,children,record} = props;
    
    const handleClose = () => {
        onClose();
    };
    return (
        <>
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                {props.title}
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </Stack>
        </DialogTitle>
        <DialogContent sx={{...(props.contentProps || {})}}>
            {open &&
                React.Children.map(children, child => {
                    // Checking isValidElement is the safe way and avoids a typescript
                    // error too.
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, record,);
                    }
                    return child;
                })}
        </DialogContent>
    </>
    );
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '.MuiDialogContent-root': {
        [theme.breakpoints.down('sm')]: {
            paddingLeft:theme.spacing(NUMBER.TWO),
            paddingRight:theme.spacing(NUMBER.TWO),
            paddingTop:theme.spacing(NUMBER.TWO)
        },
        [theme.breakpoints.up('sm')]: {
            paddingLeft:theme.spacing(NUMBER.THREE),
            paddingRight:theme.spacing(NUMBER.THREE),
        }
    },
    '.MuiDialog-paperFullScreen':{
        margin: 0
    },
}));
const DialogFormDashboard = forwardRef((props: any, ref: any) => {
    const [open, setOpen] = useState(props.open || false);
    const [record, setRecord] = useState(null);

    useEffect(()=>{
        setOpen(props.open);
    },[props.open]);
    const onClose = () => {
        setOpen(false);
        props.onClose&&props.onClose();
    };

    useImperativeHandle(ref, () => ({
        open(records: any) {
            setRecord(records);
            setOpen(true);
        },
        close() {
            onClose();
        },
    }));

    return (
        <StyledDialog className='calculator-dialog' fullWidth maxWidth="sm" open={open} {...props.dialogProps}>
          <DialogConentFormDashboard open={open} record={record} onClose={onClose} {...props}/>
        </StyledDialog>
    );
});

export default DialogFormDashboard;


