import { Grid, InputLabel, Stack } from '@mui/material';
import {useElements} from '@stripe/react-stripe-js';
import { useEffect,useState } from 'react';
import { styled } from '@mui/material/styles';
import { ReferenceInput, SelectInput, TextInput,required } from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';


const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(NUMBER.TWO),
}));


const StyledCardNumber = styled('div')(({ theme }) => ({
  padding:theme.spacing(1),
  paddingLeft:0,
  minHeight:theme.spacing(4),
  borderBottom:'1px solid rgba(0, 0, 0, 0.25)',
}));

// ----------------------------------------------------------------------
export default function PaymentNewCardForm({form, formProps, onCancel}) {
  const elements = useElements();
  const [mounted, setMounted] = useState(false)
  useEffect(()=>{
    if(!elements){
      return;
    }
    if(mounted){
      return
    }
    const cardNumberElement = elements.create('cardNumber', {showIcon: true, iconStyle:'solid'})
    cardNumberElement.mount('#card-element')
    
    const cardCvcElement = elements.create('cardCvc', {})
    cardCvcElement.mount('#card-cvc')
    
    const cardExpiryElement = elements.create('cardExpiry', {})
    cardExpiryElement.mount('#card-expiry')
    
    setMounted(true);
  },[mounted, setMounted, elements])
  
  return (
    <RootStyle>
      <InputLabel shrink>Card Number</InputLabel>
      <StyledCardNumber id="card-element" />
      <Stack flexDirection="row" sx={{mt:3}}>
        <Grid container spacing={2} sx={{}}>
          <Grid item xs={6}>        
            <InputLabel shrink>Expiration</InputLabel>
            <StyledCardNumber id="card-expiry" />
          </Grid>
          <Grid item xs={6}>        
            <InputLabel shrink>CVC</InputLabel>
            <StyledCardNumber id="card-cvc" />
          </Grid>
        </Grid>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{mt:3}} spacing={2}>
        <TextInput source="zip" variant="standard" validate={[required()]} fullWidth sx={{mt:0}}/>
        <ReferenceInput source="country_id" variant="standard" validate={[required()]} reference="countries" fullWidth filter={{code:{_in:['US','CA']}}}>
          <SelectInput />
        </ReferenceInput>
      </Stack>
    </RootStyle>
  )
}
