// material
import { styled } from '@mui/material/styles';
import {useCallback} from 'react';

import { Box, Card, Container, Typography, Stack, Button } from '@mui/material';
// components
import Page from '../../components/Page';
import { useLogout } from 'react-admin';

import { Policy } from '../policies';
import { NUMBER } from '../../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------



const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(NUMBER.FIFTEEN),
  paddingBottom: theme.spacing(NUMBER.TEN)
}));

const FrameStyle= styled(Box)(({ theme }) => ({
  height:window.innerHeight/NUMBER.TWO,
  borderWidth:0,
  padding:theme.spacing(1),  
  overflow:'scroll'
}));

export default function Terms({onDone}) {
  const logout = useLogout();
  const onDecline = useCallback(()=>{
    logout();
  },[logout]);
  
  const onAccept = useCallback(()=>{
    onDone()
  },[onDone]);  

  return (
    <RootStyle title="Terms">
      <Container maxWidth="lg">
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" align="center" paragraph>
            Get started with Protiv
          </Typography>
          <Typography  align="center" paragraph>
            Start creating the most innovative bonus program ever.
          </Typography>
        </Box>
        <Card>
          <Stack justifyContent='center' alignItems='center' flexDirection='column'>
            <Typography variant="h5" align="center" paragraph sx={{m:0,p:2}}>
            Agree with Protiv Terms and Conditions
            </Typography>
          </Stack>          
          <FrameStyle maxWidth="lg">
            <Policy label="Terms of usages" type="terms"/>
            {/* <StyledIFrame src="https://protiv.com/privacy-policy/" title="" width="100%" height="100%"/> */}
          </FrameStyle>
          <Stack justifyContent='center' alignItems='center' flexDirection='row'>
            <Button
            onClick={onDecline}
            size="medium"
            variant="outlined"
            sx={{m:2,mr:3,borderRadius:40}}
          >
            Decline
            </Button>            
            <Button
              onClick={onAccept}
              size="medium"
              variant="contained"
              sx={{m:2,borderRadius:40}}
          >
            Accept
            </Button>
          </Stack>

        </Card>
           
      </Container>
    </RootStyle>
  );
}
