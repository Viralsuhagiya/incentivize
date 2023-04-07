// material
import { styled } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import PricingPlanCard from './PricingPlanCard';
//
import { PlanFreeIcon, PlanPremiumIcon } from '../../assets';
import PaymentProvider from './PaymentProvider';
import { useEffect,useState } from 'react';
import { NUMBER } from '../../utils/Constants/MagicNumber';
// ----------------------------------------------------------------------
//TODO: load plans from server

const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(NUMBER.FIFTEEN),
  paddingBottom: theme.spacing(NUMBER.TEN)
}));
const icons = {
  'premium':<PlanPremiumIcon />
}
// ----------------------------------------------------------------------
export default function Pricing({onDone}) {
  const [plans, setPlans] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(()=>{
    PaymentProvider.getPlans().then((data)=>{
      setLoading(false);
      console.log('Get Plans',data);
      setPlans(data);
    }).catch((error)=>{
      console.log('Get Plans Error',error);
      setLoading(false);
      setError(error)
    });
  },[]);
  
  return (
    <RootStyle title='Pricing'>
      <Container maxWidth='lg'>
        <Typography variant='h3' align='center' paragraph>
          Choose your plan
        </Typography>
          {loading&&<></>}
          {error&&<>{error}</>}

          {!loading&&plans&&<>
          <Grid container spacing={3} justifyContent='center'>
            {plans.map((card, index) => (
              <Grid item xs={12} md={plans.length===1?6:4} key={card.label}>
                <PricingPlanCard card={card} index={index} onDone={()=>{onDone({planId:card.id,planName:card.label})}} key={index} icons={icons} defaultIcon={<PlanFreeIcon />}/>
              </Grid>
            ))}
          </Grid>
          </>}
          
          
      </Container>
    </RootStyle>
  );
}
