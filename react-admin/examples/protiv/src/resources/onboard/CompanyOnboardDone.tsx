// material
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import { useRedirect } from 'react-admin';
import { useEffect } from 'react';
import { NUMBER } from '../../utils/Constants/MagicNumber';



// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(NUMBER.TWENTY),
  paddingBottom: theme.spacing(NUMBER.TEN)
}));

// ----------------------------------------------------------------------

export default function CompanyOnboardDone() {
  const redirectTo = useRedirect();
  useEffect(()=>{
      setTimeout(()=>{
        redirectTo('/')
    },NUMBER.FIFE_HUNDRED);
  },[redirectTo])
  return (
    <RootStyle title="Setup Finished">
      <Container maxWidth="lg">
      <Typography variant="h3" align="center" paragraph>
          Setup completed
        </Typography>
        <Typography align="center" paragraph>
          Redirecting to the home.
        </Typography>
      </Container>
    </RootStyle>
  );
};
