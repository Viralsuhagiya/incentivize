// material
import {useState} from 'react';
import { styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import shieldFill from '@iconify/icons-eva/shield-fill';
import { ValidationError } from 'ra-core';

import {
  Box,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material';
import { AcceptTermsAndConditions } from '../onboard/AcceptTermsLine';
import { LoadingButton } from '@mui/lab';
import { NUMBER } from '../../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(NUMBER.THREE),
  paddingTop:0,
  [theme.breakpoints.up('md')]: {
    padding: 0,
    paddingLeft:theme.spacing(NUMBER.FIVE),
    paddingRight:theme.spacing(NUMBER.FIVE),
  }
}));


// ----------------------------------------------------------------------


export default function PaymentSubmit({ form, formProps, values, error, submitError }) {
  const [termsACH, setTermsACH] = useState(false);
  return (
    <RootStyle>
      {(error||submitError)&&<>
          <FormHelperText error>
              <ValidationError error={error || submitError as string} />
          </FormHelperText>
      </>}                

      <AcceptTermsAndConditions 
              label="Agree with Fee and ACH Authorization Agreement" 
              type="ach"
              name="termsACH" 
              value={termsACH} 
              setValue={setTermsACH}/>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={formProps.submitting}
        sx={{ mt: 2, mb: 2 }}
        disabled={!termsACH}
      >
        Confirm Subscription
      </LoadingButton>                   
      <Stack alignItems="center" spacing={1} >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            component={Icon}
            fr=''
            icon={shieldFill}
            sx={{ width: 20, height: 20, color: 'primary.main' }}
          />
          <Typography variant="subtitle2">Secure credit card payment</Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          This is a secure 128-bit SSL encrypted payment
        </Typography>
      </Stack>
    </RootStyle>
  );
}
