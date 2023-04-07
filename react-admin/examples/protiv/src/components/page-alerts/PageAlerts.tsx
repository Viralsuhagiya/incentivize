import { Alert, AlertTitle, IconButton, Collapse } from '@mui/material';
import { useCallback, useState,useEffect } from 'react';
import { PageAlertsContext, PageAlertType, usePageAlerts, usePageAlertsContext } from './usePageAlerts';
import CloseIcon from '@mui/icons-material/Close';
import { NUMBER } from '../../utils/Constants/MagicNumber';

export const PageAlertContextProvider = ({children}) => {
    const value = usePageAlerts();
    return (
        <PageAlertsContext.Provider value={value}>
            {children}
        </PageAlertsContext.Provider>
    )
}

export const PageAlert = ({record}:{record:PageAlertType}) => {
    const {title, severity, body, render} = record;
    const [open, setOpen] = useState(true);
    const { hide } = usePageAlertsContext();
    const onClose = useCallback(()=>{
        setOpen(false);
        setTimeout(()=>{
            hide(record.key)
        },NUMBER.FIFE_HUNDRED)
    },[setOpen, hide, record]);
    useEffect(()=>{
        if (open && !record.keep){
            setTimeout(()=>{
                onClose()
            },NUMBER.TEN_THOUSAND)
        }

    },[open, onClose, record])
    return (
        <Collapse in={open}>
            <Alert
                sx={{
                    '.MuiAlert-action': {
                        alignItems: 'center'
                    },
                    mb:1
                }}
                severity={severity}
                action={
                    <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={onClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>}
                >
                {title && <AlertTitle>{title}</AlertTitle>}

                {body&&body}
                {render && render({record, onClose})}
            </Alert>
        </Collapse>    
    );
};

export const PageAlerts = (props: any) => {
    const { data } = usePageAlertsContext();
    return (
        <>
        {data.map((record)=><PageAlert record={record} key={record.key}/>)}
        </>
    );
};


export default PageAlerts;
