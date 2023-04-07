import { Typography } from '@mui/material';
import React from 'react';

const CardTitle = ({ title, ...rest}: any) => {
    return (
        <Typography variant="h6" gutterBottom {...rest}>
            {title}
        </Typography>
    )
};
export default React.memo(CardTitle);
