// material
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { email, required, TextInput } from 'react-admin';
import { EmailInput } from '../../components/fields';
import { NUMBER } from '../../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(NUMBER.THREE),
  [theme.breakpoints.up('md')]: {
    padding: 0,
    paddingTop: theme.spacing(NUMBER.FIVE),
    paddingLeft: theme.spacing(NUMBER.FIVE),
    paddingRight: theme.spacing(NUMBER.FIVE),
  }
}));


// ----------------------------------------------------------------------
export default function PaymentBillingAddress({ form, formProps  }) {
  const validateEmail = email();

  return (
    <RootStyle>
      <Typography variant="subtitle1">Billing Detail</Typography>
      <Stack spacing={3} mt={1}>
        <TextInput source="phone" variant="standard" validate={[required()]} fullWidth/>
        <EmailInput source="email" variant="standard" validate={[required(),validateEmail]} fullWidth/>
        {/* 
        <TextInput source="street" variant="standard" validate={[required()]} fullWidth/>
        <TextInput source="city" variant="standard" validate={[required()]} fullWidth sx={{m:0}}/>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Field name='country_id' subscription={{ value: true }}>
            {({ input: { value } }) => (
              <ReferenceInput variant="standard" source="state_id" validate={[required()]} reference="states" fullWidth sx={{m:0}}
                perPage={1000} 
                sort={{ field: 'name', order: 'ASC' }}
                filter={{country_id:{_eq:parseInt(value)}}}>
                  <SelectInput />
              </ReferenceInput>
            )}
          </Field>
          <TextInput source="zip" variant="standard" validate={[required()]} fullWidth sx={{m:0}}/>
        </Stack>
        <ReferenceInput source="country_id" variant="standard" validate={[required()]} reference="countries" fullWidth filter={{code:{_eq:'US'}}}>
          <SelectInput />
        </ReferenceInput>
        */}
      </Stack>
    </RootStyle>
  );
}
