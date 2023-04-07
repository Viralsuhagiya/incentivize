// material
import { styled } from '@mui/material/styles';

import {
  Typography,
} from '@mui/material';
import PaymentNewCardForm from './PaymentNewCardForm';
import { NUMBER } from '../../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(NUMBER.THREE),
  [theme.breakpoints.up('md')]: {
    padding: 0,
    paddingTop: theme.spacing(NUMBER.FIVE),
    paddingLeft:theme.spacing(NUMBER.FIVE),
    paddingRight:theme.spacing(NUMBER.FIVE),
  }
}));


// ----------------------------------------------------------------------


export default function PaymentMethods({ form, formProps, values }) {
  return (
    <RootStyle>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Payment Method
      </Typography>

      <PaymentNewCardForm form={form} formProps={formProps} onCancel={()=>{}}/>

    </RootStyle>
  );
}
