// material
import { useTheme, styled } from '@mui/material/styles';
import { Box, Card, Grid, Container, Typography, useMediaQuery, FormHelperText, Stack } from '@mui/material';
// utils
// components
import Page from '../../components/Page';
import {
  PaymentBillingAddress,
  PaymentMethods, PaymentSummary,
} from '../payment';
import { withTypes } from 'react-final-form';
import { useGetList } from 'react-admin';
import { useCompanyOnboardContext } from './CompanyOnboard';
import { useEffect,useState } from 'react';
import PaymentProvider from './PaymentProvider';
import _ from 'lodash';
import { useCallback,useMemo } from 'react';
import {useStripe, useElements} from '@stripe/react-stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js/pure';

import { ValidationError } from 'ra-core';
import { FORM_ERROR } from 'final-form'
import { useQueryClient, useQuery } from 'react-query';
import PaymentSubmit from '../payment/PaymentSubmit';
import { NUMBER } from '../../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(NUMBER.FIFTEEN),
  paddingBottom: theme.spacing(NUMBER.TEN)
}));

// ----------------------------------------------------------------------
interface FormValues {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state_id: number;
  country_id: number;
  zip: string;
}
const { Form } = withTypes<FormValues>();

export const StyledForm = styled('form')({
  '.MuiFormHelperText-root': { display: 'none' },
  '.MuiFormHelperText-root.Mui-error': { display: 'block' },
  '.MuiCardHeader-root': { 'padding-top': '0px' },
  // '.MuiFormControl-root': { 'margin-top': '16px' },
});

const diff = (a, b) => {
  return _.reduce(a, function(result, value, key) {
    return !_.isEqual(value, b[key]) ?
        _.assign(result, {key:value}):result
}, {});
};

const getErrorMessage = (err) =>{
  let message;
  if(err && typeof err==='object'){
    if(err.error){
      if(typeof err.error === 'object'){
        message = err.error.message
      }else{
        message = err.error
      };        
    } else {
      message = err.message
    };
  } else {
    message = err;
  };
  console.log('getErrorMessage ', err, message);
  return message;
};

function PaymentView({queryClient, onDone, cart}:{'queryClient':any,'onDone':any,'cart':CartType}) {

  const stripe = useStripe();
  const elements = useElements();

  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
  const [error, setError] = useState<string>();

  const onboardingContext = useCompanyOnboardContext()
  const subscription_order = cart.subscription_order;

  const planId = subscription_order.plan_id.id;
  const planName = subscription_order.plan_id.label;
  const plan = {planId:planId, planName:planName}
  console.log(`planId: ${planId}`);

  const { data:countryUS } = useGetList('countries', { filter:{code:{_eq:'US'}}}, {refetchOnWindowFocus:false});
  const initialValues = useMemo<any>(()=>{
    return {
      email:onboardingContext.email || '',
      phone:onboardingContext.phone || '',
      country_id:onboardingContext.country_id && onboardingContext.country_id>0?onboardingContext.country_id:countryUS&&countryUS[0].id||null,
      zip:onboardingContext.zip || '',
    }
  },[onboardingContext, countryUS]);

  const createUpdateCustomer = useCallback((values)=>{
    return new Promise<void>((resolve, reject)=>{
      //first create customer
      const companyData = _.pick(values, ['name','email','phone','zip','country_id'])
      const newData = diff(companyData, initialValues)
      if (!_.isEmpty(newData)){
        PaymentProvider.createUpdateCustomer(newData).then(res=>{
          resolve();
        }).catch(err=>{
          reject(err)
        });
      }else{
        resolve();
      }
    })
  },[initialValues]);
  

  const handlePaymentThatRequiresCustomerAction = useCallback(({
    subscription,
    invoice,
    paymentMethodId,
    isRetry,
  }) => {
    if (subscription && subscription.status === 'active') {
      console.log(`3.1 handlePaymentThatRequiresCustomerAction subscription is active`);
      // subscription is active, no customer actions required.
      return { subscription, paymentMethodId };
    }    

    // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
    // If it's a retry, the payment intent will be on the invoice itself.
    let paymentIntent = invoice
      ? invoice.payment_intent
      : subscription.latest_invoice.payment_intent;

    if (
      paymentIntent.status === 'requires_action' ||
      (isRetry === true && paymentIntent.status === 'requires_payment_method')
    ) {      
      console.log(`3.2 confirmCardPayment paymentIntent.status: ${paymentIntent.status} isRetry: ${isRetry}`);
      return stripe
        .confirmCardPayment(paymentIntent.client_secret, {
          payment_method: paymentMethodId,
      })
      .then((result) => {
        if (result.error) {
          // start code flow to handle updating the payment details
          // Display error message in your UI.
          // The card was declined (i.e. insufficient funds, card has expired, etc)
          console.log(`3.2 Error in confirmCardPayment `, result.error);
          //error was to change the card.
          throw result;
        } else {
          console.log(`3.2 confirmCardPayment result `, result);
          if (result.paymentIntent.status === 'succeeded') {
            console.log(`3.2 confirmCardPayment result succeeded`, result.paymentIntent);
            // There's a risk of the customer closing the window before callback
            // execution. To handle this case, set up a webhook endpoint and
            // listen to invoice.paid. This webhook endpoint returns an Invoice.
            return {
              subscription: subscription,
              invoice: invoice,
              paymentMethodId: paymentMethodId,
            };
          }
        }
      });
    } else {
      // No customer action needed
      console.log(`3.1 handlePaymentThatRequiresCustomerAction => No customer action needed paymentIntent.status: ${paymentIntent.status} isRetry: ${isRetry}`, paymentIntent);
      return { subscription, paymentMethodId };
    }
  },[stripe]);

  const handleRequiresPaymentMethod = useCallback(({
    subscription,
    paymentMethodId
  }) => {

    if (subscription.status === 'active') {
      // subscription is active, no customer actions required.
      console.log('4. handleRequiresPaymentMethod subscription is active');
      return { subscription, paymentMethodId };
    } else if (
      subscription.latest_invoice.payment_intent.status ===
      'requires_payment_method'
    ) {
      // eslint-disable-next-line no-throw-literal
      throw { error: { message: 'Your card was declined.' } };      
    } else {
      return { subscription, paymentMethodId };
    }
  },[])
  const onSubscriptionComplete = useCallback(()=>{
    PaymentProvider.cartDone();
  },[]);
  const retryInvoiceWithNewPaymentMethod = useCallback((paymentMethodId)=>{
    console.log(`5. retryInvoiceWithNewPaymentMethod paymentMethodId: ${paymentMethodId}`);
      return PaymentProvider.retryInvoice(paymentMethodId)
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer
            console.log('5. Error in retryInvoice ',result.error);
            throw result;
          }
          return result;
        })
        // Normalize the result to contain the object returned
        // by Stripe. Add the addional details we need.
        .then((result) => {
          console.log('5. retryInvoice result ', result);
          return {
            // Use the Stripe 'object' property on the
            // returned result to understand what object is returned.
            invoice: result.invoice,
            paymentMethodId: paymentMethodId,
            isRetry: true,
          };
        })
      // Some payment methods require a customer to be on session
      // to complete the payment process. Check the status of the
      // payment intent to handle these actions.
        .then(handlePaymentThatRequiresCustomerAction)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .then((result)=>{
          console.log('5. retryInvoice completed successfully', result);
        })
        .catch((error) => {
          // An error has happened. Display the failure to the user here.
          console.log('5. Error in retryInvoice ', error);
          throw error;
        })
  },[handlePaymentThatRequiresCustomerAction, onSubscriptionComplete]);


  const createSubscription = useCallback((paymentMethodId)=>{
    console.log(`2.0 createSubscription with planId: ${planId}. paymentMethodId: ${paymentMethodId}`);
      return PaymentProvider.createSubscription(paymentMethodId)
        .then((result) => {
          if (result.error) {
            // The card had an error when trying to attach it to a customer
            console.log('2.0 Error in createSubscription ',result.error);
            throw result;
          }
          return result;
        })
        // Normalize the result to contain the object returned
        // by Stripe. Add the addional details we need.
        .then((result) => {
          console.log('2.0 createSubscription result ', result);
          const updatedAt = Date.now();
          queryClient.setQueryData(
              'cart',
              (cart) => ({ ...cart, ...result }),
              { updatedAt }
          );

          return {
            // Use the Stripe 'object' property on the
            // returned result to understand what object is returned.
            subscription: result.subscription,
            paymentMethodId: paymentMethodId,
          };
        })
        // Some payment methods require a customer to do additional
        // authentication with their financial institution.
        // Eg: 2FA for cards.
        .then(handlePaymentThatRequiresCustomerAction)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail. You will
        // get a requires_payment_method error.
        .then(handleRequiresPaymentMethod)
        // No more actions required. Provision your service for the user.
        .then(onSubscriptionComplete)
        .then((result)=>{
          console.log('2.0 createSubscription completed successfully', result);
        })
        .catch((error) => {
          // An error has happened. Display the failure to the user here.
          console.log('2.0 Error in createSubscription ', error);
          throw error;
        })
  },[planId, handlePaymentThatRequiresCustomerAction, handleRequiresPaymentMethod, onSubscriptionComplete, queryClient]);

  const createPaymentMethod = async ({card}: {card}) => {
      console.log(`1. createPaymentMethod with subscription: ${cart&&cart.subscription&&cart.subscription.id}`)
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
      });
      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
        console.log('1. Error of createPaymentMethod ',result.error);
        throw result
        //reject(result.error.message);
      } else {
        console.log('1. createPaymentMethod result', result);
        console.log('1. createPaymentMethod payment method created ', result.paymentMethod);
        //if subscription is already there then its payment failure,
        //we have to retry existing subscription
        if(cart.subscription&&cart.subscription.id) {
          // Update the payment method and retry invoice payment
          const retryInvoiceResult = await retryInvoiceWithNewPaymentMethod(result.paymentMethod.id);
          console.log(`5. createPaymentMethod completed with retry invoice`, retryInvoiceResult)
        } else {
          const subscriptionResult = await createSubscription(result.paymentMethod.id)
          console.log(`1. createPaymentMethod completed with subscription`, subscriptionResult)
        }
      }
      
  };

  const cartUpdate = async (params) => {
      const result = await queryClient.fetchQuery('cartUpdate', ()=>{
        return PaymentProvider.cartUpdate(params)
      })
      console.log('Cart Update ',result);
      if(result.error){
        Promise.reject(result.error)
      } else {
        const updatedAt = Date.now();
        queryClient.setQueryData(
            'cart',
            (cart) => ({ ...cart, ...result }),
            { updatedAt }
        );
        queryClient.invalidateQueries('cart');
      }
  };

  const onApplyPromoCode = (promoCode) => {
    return cartUpdate({add_promo:promoCode})
  };  

  const onRemovePromoCode = () => {
    return cartUpdate({remove_promo:1})
  };

  const onSubmit = (values: FormValues) => {
    console.log('Form Submitted with values', values);
    setError('');
    //TODO: disable form
    return new Promise(async (resolve, reject)=>{
      try {
        await createUpdateCustomer(values);
        const card = elements.getElement('cardNumber')
        await createPaymentMethod({ card })
        setError(null);
        onDone();
        resolve({});
      } catch(err) {
        const message = getErrorMessage(err);
        console.log('OnSubmit Catch Error ', err, message);
        setError(message);
        resolve({ [FORM_ERROR]: message})
      }
    })
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ submitError, handleSubmit, form, submitting, pristine, values }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Grid container spacing={upMd ? 5 : 2} sx={{mb:4}}>
              <Grid item xs={12} md={6}>
                <PaymentSummary
                  form={form}
                  formProps={{submitting, pristine}}
                  plan={plan} 
                  subscription_order={subscription_order} 
                  upcomingInvoice={cart.upcoming_invoice} 
                  onApplyPromoCode={onApplyPromoCode}
                  onRemovePromoCode={onRemovePromoCode} 
                  key='payment-summary'
                  />
              </Grid>

              <Grid item xs={12} md={6}>
                <PaymentBillingAddress form={form} formProps={{submitting, pristine}}/>
                <PaymentMethods form={form} formProps={{submitting, pristine}} values={values}/>
                <PaymentSubmit form={form} formProps={{submitting, pristine}} values={values} error={error} submitError={submitError}/>
              </Grid>
            </Grid>
          </StyledForm>
        )}/>
    </>
  )
};
type CartType = {
  'subscription_order':{
    'id':'number',
    'status':'string',
    'plan_id':{
      'id':'number',
      'label':'string',
      'caption?':'string',
      'stripeId':'string',
    },
    'stripe_price_id':'string',
    'promo_code?':'string',
  },
  'upcoming_invoice':{
    'id':'string'
  },
  'subscription':{
    'id':'string'
  },
};

export default function Payment({onDone}) {
  const onboardingContext = useCompanyOnboardContext()
  const [error, setError] = useState<string>(); 
  const stripePromise = useMemo(()=>{
    return loadStripe(
      onboardingContext.stripe_publishable_key
    );
  },[onboardingContext.stripe_publishable_key]);
  
  const queryClient = useQueryClient();
  const {data:cartData, isLoading} = useQuery('cart', PaymentProvider.cart, { enabled:true });
  
  useEffect(()=>{
    if(cartData&&cartData.subscription_order && !cartData.subscription_order.stripe_customer_id){
        PaymentProvider.createUpdateCustomer({}).then(res=>{
            queryClient.invalidateQueries('cart');
        }).catch(err=>{
            setError(`Unable to setup payment for customer. Please try again. ${err}`);
        })
    }    
  },[cartData, queryClient])

  return (
    <RootStyle title='Payment'>
      <Container maxWidth='lg'>
        <Box sx={{ mb: 5 }}>
          <Typography variant='h3' align='center' paragraph>
            Let's finish powering you up!
          </Typography>
          <Typography align='center' sx={{ color: 'text.secondary' }}>
            Add your billing information.
          </Typography>
        </Box>
        <Card>
          {!error &&
            <>
              {!isLoading && cartData && 
                <Elements stripe={stripePromise} >
                  <PaymentView queryClient={queryClient} onDone={onDone} cart={cartData}/>
                </Elements>
              }
              {isLoading && <Stack alignItems='center'>Loading...</Stack>}
            </>
          }
          {error && <>
            <FormHelperText error>
              <Typography align='center'>
                <ValidationError error={error as string} />
              </Typography>
            </FormHelperText>
          </>}
        </Card>        
      </Container>
    </RootStyle>
  );
};
