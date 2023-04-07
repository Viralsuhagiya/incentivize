/* eslint-disable no-useless-escape */
import {useState, useRef, useCallback} from 'react';
// material
import { styled } from '@mui/material/styles';
import { Divider, Typography, Stack, IconButton, Collapse, InputAdornment, TextField, Button, Chip, CircularProgress,  } from '@mui/material';
import Label from '../../components/Label';
import _ from 'lodash';
import MuiExpandMoreIcon from '@mui/icons-material/ExpandMore';
import closeCircleFill from '@iconify/icons-eva/close-circle-fill';
import { Icon } from '@iconify/react';
import { LoadingButton } from '@mui/lab';
import { NUMBER } from '../../utils/Constants/MagicNumber';

// ----------------------------------------------------------------------

const getErrorMessage = (err) =>{
  let message;
  if(err && typeof err==='object'){
    if(err.error){
      if(typeof err.error === 'object'){
        message = err.error.message
      }else{
        message = err.error
      }        
    } else {
      message = err.message
    }
  } else {
    message = err;
  }
  console.log('getErrorMessage ', err, message);
  return message;
}
const ExpandMoreIcon = styled((props:any) => {
  const { expand, ...other } = props;
  return <MuiExpandMoreIcon {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
}));


const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(NUMBER.THREE),
  [theme.breakpoints.up('md')]: {
    margin: theme.spacing(1),
    paddingTop: theme.spacing(NUMBER.FIVE),
    paddingBottom: theme.spacing(NUMBER.FIVE),
    borderRadius: theme.shape.borderRadiusMd,
    // backgroundColor: theme.palette.background.neutral
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(NUMBER.FIVE),
    paddingRight: theme.spacing(NUMBER.FIVE)
  }
}));

// ----------------------------------------------------------------------

function getFormattedAmount(amount) {
  // Format price details and detect zero decimal currencies
  var numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  });
  var parts = numberFormat.formatToParts(amount);
  var zeroDecimalCurrency = true;
  for (var part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  amount = zeroDecimalCurrency ? amount : amount / NUMBER.HUNDRED;
  
  var formattedAmount = numberFormat.format(amount);

  return formattedAmount;
}


type TierLine = {
  'tier',
  'tier_total',
  'quantity'?,
  'unit_amount'?,
  'unit_amount_total'?,
  'starting_at'?,
  'up_to'?
}
const getTierData = (invoice_lines) => {
  //10 × Standard (Tier 1 at $0.00 / month)
  //Standard (Tier 1 at $99.00 / month)
  
  //2 × Standard (Tier 2 at $9.95 / month)
  //Standard (Tier 2 at $0.00 / month)

  const lines = _.filter(invoice_lines, (line)=>line.price.tiers_mode==='graduated');
  const regex = /(?<quantity>\d*)?( × )?(?<plan>.*) \(Tier (?<tier>\d+) at (?<price>[$\.\d]*) \/ (?<period>\w+)\)/gm;
  const tier_amounts = _.sortBy(_.values(_.reduce(lines, (result, line, idx)=>{
    let m = regex.exec(line.description);
    if(!m) {
      const flatRegex = /(?<plan>.*) \(Tier (?<tier>\d+) at (?<price>[$\.\d]*) \/ (?<period>\w+)\)/gm;
      m = flatRegex.exec(line.description);
    }
    console.log('Processing line', line.description, m&&m.groups, line)
    if(m && m.groups) {
      const tier = parseInt(m.groups.tier);
      const price = m.groups.price;
      const quantity = m.groups.quantity;
      const tier_line:TierLine = _.get(result,tier,{
        tier:tier,
        tier_total:0
      })
      result[tier] = tier_line
      if(quantity !== undefined) {
        //this is per user line
        _.assign(tier_line, {
          quantity: parseInt(quantity),
          unit_amount: price,
          unit_amount_total: line.amount,
        })
      }else{
        //this is flat fee line
        _.assign(tier_line, {
          flat_amount: price
        })
      }
      _.assign(tier_line, {
        tier_total: tier_line.tier_total + line.amount
      })
    }
    return result;
  },{})),(line:any)=>line.tier)
  let lastQty = -1;
  tier_amounts.forEach(line=>{
    line.starting_at = lastQty + 1
    line.up_to = line.starting_at + line.quantity
    lastQty = line.up_to
  })
  if(!_.isEmpty(tier_amounts)){
    _.last(tier_amounts).up_to = null;
  }
  console.log(tier_amounts);
  return tier_amounts;
}

const TireAmountLine = ({tier_line}) => {
  const hasFlatFees = tier_line.flat_amount!=='$0.00'?true:false;
  const hasUnitAmount = tier_line.unit_amount!=='$0.00'?true:false;
  return (
    <>
    <Stack flexDirection='row' alignItems='center' sx={{mt:0}} spacing={0} justifyContent='space-between'>
    <Typography
      component='span'
      variant='body2'
      sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}
    >
      
    Qty {tier_line.quantity}: 
    {!hasUnitAmount && hasFlatFees && <> Flat fee for </>}
    {!(!hasUnitAmount && hasFlatFees) && <> {tier_line.unit_amount} each for </>}
    { tier_line.starting_at===0 && <> first {tier_line.up_to}</>}
    { tier_line.starting_at>0 && tier_line.up_to > 0 && <> next {tier_line.starting_at}-{tier_line.up_to}</>}
    { !tier_line.up_to && <> above {tier_line.starting_at}</>}
    
    </Typography>
    <Typography
      component='span'
      variant='body2'
      sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}
    > 
      {!hasUnitAmount && hasFlatFees && <>{tier_line.flat_amount}</>}
      { !(!hasUnitAmount && hasFlatFees) && getFormattedAmount(tier_line.unit_amount_total)}
    </Typography>
  </Stack>
  { hasFlatFees && !(!hasUnitAmount && hasFlatFees) &&
  <Stack flexDirection='row' alignItems='center' sx={{mt:0, pl:2}} spacing={0} justifyContent='space-between'>
      <Typography
        component='span'
        variant='body2'
        sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}
      >
      Flat fee
      </Typography>
      <Typography
        component='span'
        variant='body2'
        sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}
      > 
        {tier_line.flat_amount}
      </Typography>
  </Stack>   }
  </>    
  );
}
const StandardPriceLine =({line})=>{
  return (
    <Stack flexDirection='row' alignItems='center' sx={{mt:0}} spacing={0} justifyContent='space-between'>
    <Typography
      component='span'
      variant='body2'
      sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}
    >  
    Qty {line.quantity}: {getFormattedAmount(line.unit_amount_excluding_tax)} each for
    </Typography>
    <Typography
      component='span'
      variant='body2'
      sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}
    > 
      {getFormattedAmount(line.amount_excluding_tax)}
    </Typography>
  </Stack>    
  );
}
export default function PaymentSummary({ form, formProps, plan, subscription_order, upcomingInvoice, onApplyPromoCode, onRemovePromoCode }) {
  const lines = upcomingInvoice.lines.data
  const standard_lines = _.filter(lines, (line)=>!line.price.tiers_mode);
  const tier_amounts = getTierData(lines);
  const quantity = _.reduce(lines,(acc, line)=>acc+line.quantity,0)
  // const flatLine = lines.filter(line=>line.)
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <RootStyle>
      <Stack spacing={2.5}>
        <Stack direction='row' justifyContent='flex-start' spacing={1}>
          <Typography variant='subtitle1' component='p' sx={{ color: 'text.secondary' }}>
            Subscribe to 
          </Typography>
          <Label color='error' variant='filled'>
            {plan.planName.toUpperCase()}          
          </Label>
        </Stack>

        <Stack direction='row' justifyContent='center'>
          <Typography variant='h2' sx={{ mx: 1 }}>
            {getFormattedAmount(upcomingInvoice.total)}
          </Typography>
          <Typography
            component='span'
            variant='body2'
            sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}
          >
            per month
          </Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <Stack direction='column'>
          <Stack direction='row' alignItems='center' justifyContent='space-between'>
            <Typography variant='h6' component='p'>
              Total Billed
            </Typography>
            <Typography variant='h6' component='p'>
              {getFormattedAmount(upcomingInvoice.total)}
            </Typography>
          </Stack>
          <Stack flexDirection='row' alignItems='center' sx={{mt:1}} spacing={0} justifyContent='space-between'>
            <Typography
              component='span'
              variant='body2'
              sx={{  color: 'text.secondary' }}
            >
              Qty {quantity}, Billed monthly
            </Typography>
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label='show more'
              disableRipple
              sx={{
                p:0,
                ml: 1,
                '&.MuiButtonBase-root:hover': {
                  bgcolor: 'transparent'
                },
              }}
  
            >
              <Typography
              component='span'
              variant='body2'
              sx={{  color: 'text.secondary' }}              
              >
                See details
              </Typography>
              <ExpandMoreIcon expand={expanded}/>
            </IconButton>
          </Stack>
          <Collapse in={expanded} timeout='auto' unmountOnExit sx={{pl:1,pt:1}}>
            {
              tier_amounts.map((tier_line) => (<>
                  <TireAmountLine key={tier_line.tier} tier_line={tier_line} />
              </>))
            }
            {
              standard_lines.map((line, idx) => (<>
                  <StandardPriceLine key={idx} line={line} />
              </>))
            }
          </Collapse>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
            <PromoCodeView form={form} promoCode={subscription_order.promo_code} onApplyPromoCode={onApplyPromoCode} onRemovePromoCode={onRemovePromoCode}/>
        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>
    </RootStyle>
  );
}

const PromoCodeView = ({form, promoCode, onApplyPromoCode, onRemovePromoCode}) => {
  const [loading, setLoading] = useState<boolean>();
  const onRemove = ()=> {
    setLoading(true);
    onRemovePromoCode()
      .then(result=>{
        setLoading(false)
      }).catch(err=>{
        setLoading(false)
      })
  }
  return (
    <>
    {!promoCode && 
      <PromoCodeInputView form={form} onApplyPromoCode={onApplyPromoCode}/>
    }
    {promoCode && 
      <Stack direction='row'>
        <LoadingChip label={promoCode} onDelete={onRemove} color='primary' loading={loading}/>
      </Stack>
    }
    </>
  )
};

const PromoCodeInputView = ({form, onApplyPromoCode}) => {
  const [addPromo, setAddPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string>();
  const handlePromoCode = (event) => {
    setPromoCode(event.target.value)
  }
  const onApply = ()=> {
    setLoading(true);
    setError('');
    onApplyPromoCode(promoCode)
      .then(result=>{
        setLoading(false)
      }).catch(err=>{
        setLoading(false)
        const message = getErrorMessage(err);
        setError(message)
      })
  }
  const inputRef = useRef();

  return (
    <>
        <TextField
          fullWidth
          variant='outlined'
          onChange={handlePromoCode}
          value={promoCode}
          disabled={loading}
          placeholder='Add promotion code'
          inputRef={inputRef}
          onBlur={()=>{
            console.log('blure called', promoCode);
            (!promoCode || promoCode==='') && setAddPromo(false)
          }}
          sx={{
            cursor:'pointer',            
            borderBottom:0,
            '.MuiInputBase-input':!addPromo?{
              width:'0px',
            }:{},
            '.MuiInputBase-root':!addPromo?{
              justifyContent:'center',
            }:{},
            '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':!addPromo?{
              'border':0,
            }:{},
            '.MuiOutlinedInput-notchedOutline':!addPromo?{
              'border':0,
            }:{},
          }}
          inputProps={{
            cursor:'pointer',
          }}
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment:(
              <>{!addPromo&&
                <Button
                  type='button'
                  sx={{
                    padding:0,
                    textTransform: 'none',
                    '&.MuiButtonBase-root:hover': {
                      bgcolor: 'transparent'
                    }
                  }}
                  onClick={()=>{
                    setAddPromo(true);
                    inputRef.current&&(inputRef.current as any).focus();
                  }}>
                  Add promotion code
                </Button>
              }</>
            ),
            endAdornment: (
              <>{addPromo&&
                <InputAdornment position='end'>
                  <LoadingButton
                    type='button'
                    loading={loading}
                    disabled={!promoCode||promoCode===''?true:false}
                    onClick={onApply}
                    sx={{ mr: -0.5 }}
                  >
                    Apply
                  </LoadingButton>
                </InputAdornment>
                }
              </>
            )
          }}
        />    
    </>
  );
}

const LoadingChip = ({label, onDelete, color, loading}) => {
  const onRemove = useCallback(()=>{
    return onDelete()
  },[onDelete])
  return (
    <Chip label={label} onDelete={onRemove} color='primary' disabled={loading} deleteIcon={
    loading&&<CircularProgress size='1rem'/>||<Icon icon={closeCircleFill}  fr='' />}/>
  );  
};
