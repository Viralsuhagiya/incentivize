import {
    Avatar,
    IconButton,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Popover,
    styled,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { HELP_CENTER_URL } from '../utils/Constants/ConstantData';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import HelpIcon from '@mui/icons-material/Help';
import { useGetIdentity } from 'ra-core';
import { ZendeskAPI } from '../ZendexConfig';

const HelpIconStyled = styled(HelpIcon)(({ theme }) => ({
    width: 40,
    height: 40,
}));

const ListStyled = styled(List)(({ theme }) => ({
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
}));

// ----------------------------------------------------------------------
const Help = () => {
    const {identity } = useGetIdentity();
    const [zendeskToken,setZendeskToken] = useState("")
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openHelpCenter = () => {
        handleClose();
        const newWindow = window.open(
            HELP_CENTER_URL,
            '_blank',
            'noopener,noreferrer'
        );
    };
    const openChatWithUs = () => {
        handleClose()
        setZendeskToken(identity?.zendesk_token)
        ZendeskAPI('messenger', 'open');
    };
    const isOpen = Boolean(anchorEl);
    const id = isOpen ? 'simple-popover' : undefined;

    useEffect(() => {
        if (!zendeskToken && identity?.zendesk_token){
            setZendeskToken(identity?.zendesk_token)
        }
    }, [identity?.zendesk_token]);
    
    useEffect(() => {
        if (zendeskToken){
            ZendeskAPI("messenger", "loginUser", function (callback) {
                callback(zendeskToken)
            });
        }
    }, [zendeskToken]);
   
    return (
        <>
            <IconButton onClick={handleClick} style={{ marginRight: 10 }}>
                <HelpIconStyled />
            </IconButton>
            <Popover
                id={id}
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <ListStyled>
                    <ListItemButton onClick={openHelpCenter}>
                        <ListItemAvatar>
                            <Avatar>
                                <ContactSupportIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="" secondary="Help Center" />
                    </ListItemButton>
                    <ListItemButton onClick={openChatWithUs}>
                        <ListItemAvatar>
                            <Avatar>
                                <QuestionAnswerIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="" secondary="Chat with us" />
                    </ListItemButton>
                </ListStyled>
            </Popover>
             
        </>
    );
};

export default Help;
