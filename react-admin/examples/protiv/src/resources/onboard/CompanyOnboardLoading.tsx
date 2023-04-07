// material
import { styled } from '@mui/material/styles';

import { Box, Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { NUMBER } from '../../utils/Constants/MagicNumber';


// ----------------------------------------------------------------------



const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(NUMBER.FIFTEEN),
  paddingBottom: theme.spacing(NUMBER.TEN)
}));


export default function CompanyOnboardLoading({error}:{error?}) {
  return (
    <RootStyle title="Terms">
      <Container maxWidth="lg">
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" align="center" paragraph>
            Get started with Protiv
          </Typography>
          <Typography  align="center" paragraph>            
            {!error&&<>Loading ...</>}
            {error&&<>Something went wrong. {error}</>}
          </Typography>
        </Box>
      </Container>
    </RootStyle>
  );
}
