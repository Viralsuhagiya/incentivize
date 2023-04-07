import { Typography } from '@mui/material';
import { Box } from '@mui/system';

const Empty = () => {
    return (
        <Box textAlign="center" m={1} sx={{flex:1}}>
            <Typography variant="h4" paragraph sx={{ opacity: 0.5 }}>
                No result found
            </Typography>
        </Box>
    );
};

export default Empty;
