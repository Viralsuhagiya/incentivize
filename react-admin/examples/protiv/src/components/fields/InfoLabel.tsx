import React, { ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { IconButton,Popover,Box } from '@mui/material';
import { NUMBER } from '../../utils/Constants/MagicNumber';

export const InfoLabel = (props:any) => {
    const maxWidth=props.maxWidth || NUMBER.THREE_HUNDRED;
    const height = props.height || NUMBER.TWENTY;
    const icon = props.icon || 'eva:question-mark-circle-fill';
    const sx = props.sx || {padding:1};
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <>
            <IconButton sx={sx} onClick={handleClick}>
                <Icon icon={icon} height={height} fr='' />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box sx={{
                    maxWidth: maxWidth, padding:1 }}>
                    {React.Children.map(props.children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child );
                        }
                    return child;
                    })}
                </Box>
            </Popover>
        </>
    );
};
