import infoFill from '@iconify/icons-eva/info-fill';
import { Icon } from '@iconify/react';
import { Alert } from '@mui/material';
import React from 'react';
const AlertWithChild = (props: any) => {
    const { children } = props;
    return (
        <Alert
            icon={<Icon color="gray" icon={infoFill} fr="" />}
            variant="outlined"
            severity="info"
            sx={{
                borderColor: '#e0e0e0',
                backgroundColor: '#f9f9f9',
                color: 'gray',
            }}
        >
            {children}
        </Alert>
    );
};
export default AlertWithChild;
