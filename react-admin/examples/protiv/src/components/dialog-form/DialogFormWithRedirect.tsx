import { Dialog, DialogTitle, DialogContent, DialogActions, Stack, IconButton} from '@mui/material';
import React, {
    useCallback,
    cloneElement,
    isValidElement,
} from 'react';
import { FormWithRedirect, FormWithRedirectProps, FormWithRedirectRenderProps, useRedirect } from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import { createPortal } from 'react-dom';
import _ from 'lodash';
import { ToolbarSaveOnly } from '../ToolbarSaveOnly';


export const DialogTitleForRecord = (props)=>{
    const { record, prefix, defaultTitle } = props;
    const title = props.title ? props.title : !_.isEmpty(record)?`${prefix||'Modify'} ${record.name} #${record.id}`: defaultTitle
    const containerDialogTitle = document.getElementById('react-admin-dialog-title')
    if(containerDialogTitle){
        return createPortal(<>{title}</>, containerDialogTitle)
    }
    return null;
}


export const DialogFormWithRedirect = (props:FormWithRedirectProps) => {
    const redirect = useRedirect()
    const {resource,onClose,hideToolbar} = props;    
    const handleClose = useCallback((event)=> {
        if (onClose) {
            onClose()
        } else {
            redirect(props.redirect, `/${resource}`)
        }
    },[onClose, redirect, props.redirect, resource]);
    return (
        <FormWithRedirect {...props}
            render={(formProps: FormWithRedirectRenderProps) => {
                return (
                    <Dialog open={true} fullWidth maxWidth="sm" sx={{
                        '.MuiDialog-paper .MuiDialogActions-root': {
                            paddingTop:0
                        }
                    }}>
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                                <div id="react-admin-dialog-title"/>
                                <IconButton
                                    color="primary"
                                    aria-label="cancel"
                                    onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Stack>
                        </DialogTitle>
                        <DialogContent sx={{pb:0}}>
                            {props.render(formProps)}
                        </DialogContent>
                        {!hideToolbar && <DialogActions sx={{paddingTop:0}}>
                            {_.has(props,'toolbar') && isValidElement(props.toolbar) && cloneElement(props.toolbar, {
                                ...formProps
                            })}
                            {!_.has(props,'toolbar') && <ToolbarSaveOnly {...formProps} sx={{'width':'100%'}}/>}
                        </DialogActions>}
                    </Dialog>
                )
        }} />
    )
}

