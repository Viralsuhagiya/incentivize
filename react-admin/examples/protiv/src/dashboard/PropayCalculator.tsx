import {Accordion, AccordionDetails, AccordionSummary, Box,Card, FormControl, FormControlLabel, FormLabel, Grid, Radio,
         RadioGroup, Slider, Stack, Theme, Typography, useMediaQuery} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import createDecorator from 'final-form-calculate';
import _ from 'lodash';
import get from 'lodash/get';
import { useEffect, useMemo, useState } from 'react';
import {Create,FormDataConsumer,FormWithRedirect,useInput,useTranslate} from 'react-admin';
import NoResultViewDesktop from '../assets/no-result-view-desktop.png';
import NoResultViewMobile from '../assets/no-result-view-mobile.svg';
import {ReferenceArrayInputObj,ReferenceInputObj} from '../components/fields';
import { InfoLabel } from '../components/fields/InfoLabel';
import { useIdentityContext } from '../components/identity';
import { PROPAY_STATUS } from '../constants';
import { EmptyTitle } from '../layout/Title';
import { HasPermission, StyledTypography } from '../resources/payrolls/Payrolls';
import { timeLogged } from '../utils/Constants/ConstantData';
import { NUMBER } from '../utils/Constants/MagicNumber';
import { convertNumToTime, fCurrency } from '../utils/formatter';
import { getFormatedPercentChange } from './ActivePayroll';
import { getDaysAndHours, getMaxHours } from './Calculator';
import { DashboardGridItem } from './Dashboard';
import {StyledAutoCompleteInput, Employees, getPayRate, EmployeeName, styles, getBonus, getBonusWages, getGoal,
    CheckResult, HeadingLabel, NumberToTimeFormField, OneEmployeeName
} from './PropayCalculatorSubMaterial'


const NormalLabel = ({ title, variant='body1', ...rest}: any) => {
    return <Typography variant={variant} sx={{paddingLeft:1, paddingRight:1 }} {...rest}>{title}</Typography>;
};

const defaultSubscription = {
    submitting: true,
    pristine: true,
    valid: true,
    invalid: true,
    validating: true,
    errors: true, //here we are adding this extra because for some reason using array form + calculator does sets form state to invalid. though its actually valid and no errors
    //registering with errors state is solving this problem as somehow that causes form to re-render.
    //TODO: needs to check performance impact of it.
};

/* to check which id to show on team calculator */
const SeletedEmployeeId = (identity, size, propay, allValue) => {
    const getId = () => (size > 0 ? get(allValue,'id') !== get(propay,'id') ? '@all' : get(allValue, 'selected_employee_id') : null);
    return identity?.user_type === 'worker' ? identity?.employee_id : getId();
};

const CalculatorForm = (props: any) => {
    const translate = useTranslate();
    const identity = useIdentityContext();
    const [propaySelectedId, setPropaySelectedId] = useState('');
    const [propaySelectedEmployeeCount, setPropaySelectedEmployeeCount] = useState(NUMBER.ZERO);
    const [propaySelectedEmployeeObj, setPropaySelectedEmployeeObj] = useState({});
    const [employeeSelectedId, setEmployeeSelectedId] = useState('');
    const [budgetOption, setBudgetOption] = useState('');
    const theme = useTheme();
    const onChangePropay = async (
        fieldValue: any,
        name: string,
        allValues: any
    ) => {
        const propay = fieldValue;
        let result: any = propay || {};
        if (propay) {
            setPropaySelectedId(propay.id);
            setPropaySelectedEmployeeCount(fieldValue?.selected_employee_ids?.length);
            setPropaySelectedEmployeeObj(fieldValue?.selected_employee_ids_obj)
            setBudgetOption(fieldValue?.budget_option)
            const wage_ids =  _.sortBy(get(propay,'wage_ids'), 'employee_id');
            const average = _.meanBy(get(propay,'wage_ids'), (p: any) =>  getBaseWage(p));
            result['max_hours'] = getMaxHours(
                get(propay,'budget'),
                get(propay,'attendance_earning'),
                average,
                get(propay,'hours'),
                get(propay,'budget_option'),
                get(propay,'budget_hours'),
            );
            const size = _.size(wage_ids);
            result['selected_employee_id'] = SeletedEmployeeId(identity, size,propay, allValues );
            result['base_wage'] = getPayRate(get(result,'selected_employee_id'), propay.wage_ids);
        } else {
            result['base_wage'] = NUMBER.ZERO_POINT_ZERO;
            result['max_hours'] = NUMBER.ZERO_POINT_ZERO;
            result['budget'] = NUMBER.ZERO_POINT_ZERO;
            result['selected_employee_ids'] = [];
            result['selected_employee_id'] = null;
            setPropaySelectedId('');
            setPropaySelectedEmployeeCount(NUMBER.ZERO);
        }
        return result;
    };


    const onChangeSelectedEmployee = async (
        fieldValue: any,
        name: string,
        allValues: any
    ) => {
        if(fieldValue){
            setEmployeeSelectedId(fieldValue);
        }else{
            setEmployeeSelectedId('');
        }
        let result  = {}
        result['base_wage'] = getPayRate(
            fieldValue,
            get(allValues,'wage_ids')
        );
        return result;
    };

    const calculator = useMemo(() => {
        return [
            createDecorator(
                {
                    field: 'propay_id_obj',
                    updates: onChangePropay,
                },
                {
                    field: 'selected_employee_id',
                    updates: onChangeSelectedEmployee,
                },
            ),
        ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [calculatorType, setCalculatorType] = useState(identity.user_type === 'worker' ? 'WORKER' : '');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        calculatorType === (event.target as HTMLInputElement).value ? setEmployeeSelectedId(employeeSelectedId) : 
        (event.target as HTMLInputElement).value === 'TEAM' ? setEmployeeSelectedId('@all') : (event.target as HTMLInputElement).value === 'WORKER' && propaySelectedId && !employeeSelectedId? 
        setEmployeeSelectedId('@all') : setEmployeeSelectedId('null');
        setCalculatorType((event.target as HTMLInputElement).value);
      };
      
      const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
      const [expanded, setExpanded] = useState(false);

      return (
        <>
        <Box sx={{ textAlign: 'center', paddingTop:2 }}>
            <Stack direction='row' className='calculator-head-row' justifyContent='center' sx={{ position: 'relative', width: '100%' }}>
                <div className='calculator-head-left'>                
                <Typography variant='h3' sx={{ flex: 1 }}>{translate('resources.propayCalculators.fields.name')}</Typography>
                <Typography variant='h4'>{translate('resources.propayCalculators.fields.slider_info_icon')}</Typography> 
                </div>
                {/* <div className='calculator-share-link'>Share</div> */}
            </Stack>
        </Box>
        <Box sx={{ flex: 1 }}>
            <StyledCreate
                resource='propayCalculators'
                component='div'
                title={<EmptyTitle />}
            >
                <FormWithRedirect
                    {...props}
                    decorators={calculator}
                    subscription={defaultSubscription}
                    render={() => {
                        return (                                
                            <Grid className='calculator-row' container spacing={3} padding={0} sx={{marginTop:1, paddingLeft:3,paddingRight:3}}>
                                <Grid item lg={12} md={12} sm={12} xs={12} className={`${!propaySelectedId || !employeeSelectedId || (!calculatorType && propaySelectedEmployeeCount !== NUMBER.ONE) ? 'calculator-left-sec calculate-no-result-sec': expanded ? 'calculator-left-sec calculate-expand-accordion' : 'calculator-left-sec' }`}>
                                {(!isSmall && CheckResult(propaySelectedId,calculatorType,employeeSelectedId) && (propaySelectedEmployeeCount !== NUMBER.ONE && !calculatorType)) && 
                                <div className='no-result-view'>                                        
                                <img src={NoResultViewDesktop} width={160} height={145} alt='' className='no-result-desktop-img' />                     
                                <img src={NoResultViewMobile} width={50} height={60} alt='' className='no-result-mobile-img' />                     
                                <div className='no-result-view-heading'>{translate('resources.propayCalculators.fields.no_propay_text')}</div>
                                </div>}

                                { (isSmall && CheckResult(propaySelectedId,calculatorType,employeeSelectedId) && (propaySelectedEmployeeCount !== NUMBER.ONE && !calculatorType)) && 
                                <div className='no-result-view'>                                        
                                <img src={NoResultViewDesktop} width={160} height={145} alt='' className='no-result-desktop-img' />                     
                                <img src={NoResultViewMobile} width={50} height={60} alt='' className='no-result-mobile-img' />                     
                                <div className='no-result-view-heading'>{translate('resources.propayCalculators.fields.no_propay_text')}</div>
                                </div>}

                                <Grid className='calculator-select-padding' item lg={6} md={6} sm={6} xs={12}>
                                    <Grid container>
                                        <Grid className='calculator-select' item lg={12} md={12} sm={12} xs={12} sx={styles.gridCenter}>
                                            <Box sx={styles.employeeContainer}>
                                                <ReferenceInputObj
                                                        source='propay_id'
                                                        reference='propays'
                                                        filter={{
                                                            status: {
                                                                _eq:
                                                                    PROPAY_STATUS.PENDING,
                                                            },
                                                            selected_employee_ids: {_is_null: false}
                                                        }}
                                                    >
                                                        <StyledAutoCompleteInput
                                                            label=''
                                                            fullWidth={true}
                                                            variant='standard'
                                                            size='small'
                                                            underlineShow={false}
                                                            className='propay_id'
                                                        />
                                                    </ReferenceInputObj>
                                                </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                { (identity.user_type !== 'worker' && propaySelectedEmployeeCount !== NUMBER.ONE) && 
                                <Grid className='calculate-bonus-item' item lg={6} md={6} sm={6} xs={12}>
                                <FormControl>
                                    <FormLabel>{translate('resources.propayCalculators.fields.bonus_calculate_text')}</FormLabel>
                                <RadioGroup
                                        row
                                        aria-labelledby='demo-row-radio-buttons-group-label'
                                        name='row-radio-buttons-group'
                                        value={calculatorType}
                                        onChange={handleChange}
                                    >                                       
                                        <FormControlLabel value='TEAM' control={<Radio />} label= {translate('resources.propayCalculators.fields.team')} />
                                        <FormControlLabel value='WORKER' control={<Radio />} label= {translate('resources.propayCalculators.fields.worker')}/>
                                    </RadioGroup>
                                    </FormControl>
                                </Grid>}
                                {(calculatorType === 'WORKER' || propaySelectedEmployeeCount === NUMBER.ONE) && <Grid className='calculator-select-padding' item lg={6} md={6} sm={6} xs={12}>
                                    <Grid container>
                                        <Grid className='calculator-select' item lg={12} md={12} sm={12} xs={12} sx={styles.gridCenter}>
                                            <Box sx={{...styles.employeeContainer,px:2,py:0.3, borderRadius:3}}>
                                            <FormDataConsumer 
                                            label={translate('resources.propays.fields.selected_leadpay_employee_ids')}
                                            >
                                                {({ formData }) =>  {
                                                    const employeeWageIds = formData && formData.employee_wage_ids? 
                                                    formData.employee_wage_ids.filter(e => e.is_remove_bonus === false):[];
                                                    const filterredEmployeeIds = _.map(employeeWageIds, 'employee_id');
                                                    return (<ReferenceArrayInputObj
                                                    label={translate('resources.propays.fields.selected_leadpay_employee_ids')}                                               
                                                    source='selected_employee_ids'
                                                    reference='employees'                                                    
                                                    filter={{id : {_in: filterredEmployeeIds}}}
                                                >
                                                    <Employees identity={identity} EmployeeCount={propaySelectedEmployeeCount}/>                                                    
                                                </ReferenceArrayInputObj>)
                                                }}
                                            </FormDataConsumer>
                                                </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>}                

                                {(budgetOption === 'amount' ||  (employeeSelectedId && calculatorType === 'WORKER')) && <Grid className='team-pay-grid' item lg={6} md={6} sm={6} xs={12} direction='row' wrap='wrap' sx={styles.gridCenter}>
                                    <Box sx={{...styles.amountContainer,backgroundColor:theme.palette.primary.main}}>
                                        <Stack direction='row'  justifyContent='space-around' alignItems='center' sx={{ width:'100%'}} className='team-pay-grid-item'>
                                            {budgetOption === 'amount' && <Stack
                                                direction='row'
                                                justifyContent='center'
                                                alignItems='center'                                                
                                            >
                                                <MoneyFormField source='budget'/>
                                                <NormalLabel title={translate('resources.propayCalculators.fields.total_team_pay')} variant='caption'/>
                                            </Stack>}
                                            {(!calculatorType || calculatorType === 'WORKER') && <FormDataConsumer>                                           
                                                {({ formData }) =>  
                                                    formData.selected_employee_id !== '@all' &&  <Stack
                                                        direction='row'
                                                        justifyContent='center'
                                                        alignItems='center'
                                                    >
                                                        <MoneyFormField source='base_wage' format={'$0.00'} />
                                                        <NormalLabel title='Wage' variant='caption'/>
                                                    </Stack>
                                                }
                                            </FormDataConsumer>}
                                        </Stack>    
                                    </Box>
                                </Grid>}

                                {(propaySelectedEmployeeCount !== NUMBER.ONE && !calculatorType) && <Grid className='goal-slider-default' item lg={6} md={6} sm={6} xs={12}>
                                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: '30px' }}>
                                    <Stack className='goal-slider-width goal-slider-disabled' sx={{ width: '98%' }}>                        
                                        <>                                        
                                        <label className='total-team-hours'>{translate('resources.propayCalculators.fields.propay_hours')}</label>
                                        <PrettoSlider  
                                            className='pretto-worker-hours'
                                            aria-label={translate('resources.propayCalculators.fields.propay_hours')}                        
                                            valueLabelDisplay="auto"
                                            disabled                            
                                            min={0}
                                            max={0}
                                            step={0}                            
                                        />
                                        </>
                                    </Stack>                    
                                </Box>
                                </Grid>}

                                    {(calculatorType === 'TEAM' || (propaySelectedEmployeeCount === NUMBER.ONE && identity.user_type !== 'worker')) && <FormDataConsumer>
                                        {({ formData }) =>
                                            <GoalSlider {...formData} identity={identity} employee_id={calculatorType === 'TEAM' ? '@all' : formData.selected_employee_id} propaySelectedEmployeeObj={propaySelectedEmployeeCount === NUMBER.ONE ? propaySelectedEmployeeObj : []}/>
                                    }
                                     </FormDataConsumer>}
                                    {calculatorType === 'WORKER' &&  <FormDataConsumer>                                    
                                        {({ formData }) =>
                                            <GoalSliderWorkerView {...formData} identity={identity} expanded={expanded} setExpanded={setExpanded} setEmployeeSelectedId={setEmployeeSelectedId}
                                            employee_id={formData.selected_employee_id === '@all' ? '' : formData.selected_employee_id}/>
                                        }
                                    </FormDataConsumer>}
                                </Grid>
                            </Grid>
                        );
                    }}
                ></FormWithRedirect>
            </StyledCreate>
        </Box>
    </>
    );
};


const PrettoSlider = styled(Slider)(({ theme }) => ({              
    color: theme.palette.primary.main,
    height: 8,    
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px 0 rgba(140, 140, 140, 0.3), 0 -2px 4px 0 rgba(140, 140, 140, 0.2)',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
}));

const getPotentialWage = (current_goal) =>{
    return  current_goal?.pay_rate > current_goal?.base_wage ? current_goal?.pay_rate : current_goal?.base_wage ;
}

const GoalSlider = (props:any) => {
    const theme = useTheme();
    const [percent, setPercent] = useState(0);
    const [propay, setPropay] = useState(null);
    const [employee, setEmployee] = useState(null);
    const translate = useTranslate();
    const { budget, hours, max_hours, wage_ids, bonus_split_type, employee_id, propay_id, propaySelectedEmployeeObj} = props;
    useEffect(()=>{
        if(propay !== propay_id || employee !== employee_id){
            setPercent(0);
        };
        setEmployee(employee_id);
        setPropay(propay_id);
        
    },[propay_id, employee_id, propay, employee]);
    const goals = useMemo(()=>{
        return getGoal(max_hours-percent,wage_ids,hours,budget,bonus_split_type);
    },[max_hours, percent, wage_ids, hours, budget, bonus_split_type]); 
    
    const current_goal = useMemo(() => {
        if(employee_id === '@all'){
            const total_earning = _.sumBy(Object.values(goals), 'earning');
            const total_hours = _.sumBy(Object.values(goals), 'hours');
            const base_pay = _.sumBy(Object.values(goals), 'base_pay');
            const employee_avg_base_wage = _.meanBy((Object.values(goals)), (p: any) =>  getBaseWage(p));
            const avg_base_wage = total_hours && total_hours > 0 ? (base_pay / total_hours):employee_avg_base_wage;
            const avg_pay_rate =  total_hours && total_hours > 0 ? (total_earning / total_hours):employee_avg_base_wage;
            return {base_wage:avg_base_wage, pay_rate:avg_pay_rate, earning:total_earning, base_pay:base_pay};
        }else {
            return _.find(goals, function (employee_wage) {
                return employee_wage.employee_id === employee_id;
            });
        }
    },[goals,employee_id]);
    const identity = useIdentityContext();
    const days = getDaysAndHours(max_hours-percent,identity.company?.hours_per_day)
    const base_wage = get(current_goal, 'base_wage');
    const increase =  getFormatedPercentChange(get(current_goal,'base_wage',0),get(current_goal,'pay_rate',0));
    var potential_wage:any = getPotentialWage(current_goal);
    var increase_wage:any = current_goal?.pay_rate - current_goal?.base_wage
    var potential_bonus_earning = current_goal?.earning - current_goal?.base_pay;
    const max = max_hours < 1 ? max_hours : hours > 0 ?  max_hours - hours : max_hours - 1;
    const max_display = max_hours < 1 ? 0 : hours < 1 ? 1 : hours;
    const min = 0;
    const step = max_hours < 1 ? _.round(max_hours/NUMBER.TEN, 1) : budget < NUMBER.ONE_THOUSAND ? NUMBER.ZERO_POINT_FIVE : 1;
    const totalDays = getDaysAndHours(max_hours,identity.company?.hours_per_day);

    const PotentialBonus = () => {
        return <HeadingLabel sx={{textAlign:'center'}}>
            <Typography component={'span'} variant='h3' color='primary'>&nbsp;{fCurrency(potential_bonus_earning,'$0,0.00')}&nbsp;</Typography>
        <Typography variant='h4'>Potential Bonus</Typography></HeadingLabel>
    };
    const PropayWage = () => {
        return <HeadingLabel>
        <Typography component={'span'} variant='h3' color='primary'>&nbsp;{fCurrency(potential_wage,'$0,0.00')}
        <sub>/hr</sub></Typography><Typography variant='h4'>ProPay Wage ({increase})</Typography>
        </HeadingLabel>
    };   
    const IncPercentage = () => {
        return <HeadingLabel><Typography component={'span'} variant='h3' color='primary'>&nbsp;{increase}</Typography>
        <Typography variant='h4'>Increase Per.</Typography></HeadingLabel>
    };
    const IncHourlyWage = () => {
        return <HeadingLabel><Typography component={'span'} variant='h3' color='primary'>&nbsp;{fCurrency(increase_wage,'$0,0.00')}<sub>/hr</sub></Typography>
        <Typography variant='h4'>Increase Wage</Typography></HeadingLabel>
    };
    return (
        <Grid className='goal-slider-cont' container>
            <Grid className='goal-slider-left' item lg={6} md={6} sm={6} xs={12} sx={{ ...styles.gridCenter, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
                <Grid className='goal-slider-box' container justifyContent='space-around' >
                
                {max_hours > hours && max_hours > _.round(max_hours - percent, NUMBER.TWO) && (
                        <Grid className='grid-item-potential' item>                          
                        <Stack className='potential-bonus-row' direction='row' justifyContent='center' alignItems='center'>
                            <Stack direction='column' justifyContent='center' alignItems='center' textAlign='center' sx={{marginLeft:2  }}>
                                <PotentialBonus />
                                {employee_id !== '@all' && <PropayWage />}
                                {employee_id === '@all' && bonus_split_type === 'by_wage' && <IncPercentage/>}
                                {employee_id === '@all' && bonus_split_type === 'by_hours' && <IncHourlyWage/>}
                            </Stack>
                        </Stack>
                        </Grid>
                        )
                    }
                { propay_id && <Grid className='goal-footer-row' container justifyContent='space-around' >
                <Grid item>
                    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <HeadingLabel className='max-hour-label'>{translate('resources.propayCalculators.fields.max_hours')}</HeadingLabel>
                        <Box className='no-field-hour' sx={{ ...styles.hoursContainer,   color: theme.palette.primary.main }}>
                            <NumberToTimeFormField source='max_hours' />
                            {totalDays && <Typography variant='caption' color='white'>({totalDays})</Typography>}
                        </Box>
                    </Stack>
                </Grid>
                { propay_id && <Grid item>
                    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <HeadingLabel className='max-hour-label'>{translate('resources.propayCalculators.fields.est_hours')}</HeadingLabel>
                        <Box className='no-field-hour' sx={{ ...styles.hoursContainer, backgroundColor: theme.palette.primary.main, marginBottom: 1 }}>
                            <Stack direction='column' justifyContent='center' alignItems='center' sx={{  flex: 1 }} >
                                <Typography fontSize={{ lg: 18, md: 16, sm: 12,xs: 12 }} fontWeight='bold' color='white'>
                                    {convertNumToTime(_.round(max_hours - percent, NUMBER.TWO))}</Typography>
                                {days && <Typography variant='caption' color='white'>({days})</Typography>}
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>
                }
                <Grid item>
                    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <HeadingLabel className='max-hour-label'>{translate('resources.propayCalculators.fields.hours_worked')}
                        <InfoLabel height={18} icon='ri:error-warning-fill'>
                        <StyledTypography>{translate('resources.propayCalculators.fields.assuming_hours_entered')}</StyledTypography>
                        </InfoLabel>
                        </HeadingLabel>
                        <Box className='no-field-hour' sx={{ ...styles.hoursContainer,  color: theme.palette.primary.main, marginBottom: 1 }}>
                            <NumberToTimeFormField source='hours' />
                        </Box>
                    </Stack>
                </Grid>
                </Grid>}
                </Grid>
            </Grid>
            { propay_id && <Grid className='goal-slider-right' item lg={6} md={6} sm={6} xs={12}>
                <Box sx={{ minHeight: 130, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Stack className='goal-slider-width' sx={{ width: '98%' }}>
                        {base_wage === 0 ? (<HeadingLabel sx={{ textAlign: 'center' }}>Your wage is zero</HeadingLabel>) : max_hours > hours ? (
                        <>
                        <label className='total-team-hours'>{propaySelectedEmployeeObj.length ? <OneEmployeeName empObj={propaySelectedEmployeeObj}/> : translate("resources.propayCalculators.fields.total_team_hours")}</label>
                        <PrettoSlider
                            value={percent}
                            valueLabelDisplay='auto'
                            valueLabelFormat={() => {
                                return convertNumToTime(_.round(max_hours - percent, NUMBER.TWO));
                            }}
                            min={min}
                            max={max}
                            step={step}
                            marks={[{ value: min, label: convertNumToTime(_.round(max_hours, NUMBER.TWO)) + ' Hours' }, 
                            { value: max, label: convertNumToTime(_.round(max_display, NUMBER.TWO)) + ' Hours' }]}
                            onChange={(event: Event, value: number) => {
                                setPercent(value)
                            }}
                        /></>) : (<HeadingLabel className='heading-label-goal-width' sx={{ textAlign: 'center' }}>
                            <Typography className='no-propay-selected'>Your worked hours exceed maximum hours</Typography></HeadingLabel>) 
                        }
                    </Stack>                    
                </Box>
            </Grid>}

            { !propay_id && <Grid className='goal-slider-right' item lg={6} md={6} sm={6} xs={12}>
                <Box sx={{ minHeight: 130, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Stack className='goal-slider-width goal-slider-disabled' sx={{ width: '98%' }}>                        
                        <>
                        <label className='total-team-hours'>{translate('resources.propayCalculators.fields.total_team_hours')}</label>
                        <PrettoSlider                            
                            valueLabelDisplay='auto'
                            disabled                            
                            min={NUMBER.ZERO}
                            max={NUMBER.ZERO}
                            step={NUMBER.ZERO}                            
                        /></>
                    </Stack>                    
                </Box>
            </Grid>}

        </Grid>
    );
};

const GoalSliderWorkerView = (props:any) => {
    const theme = useTheme();
    const translate = useTranslate();
    const [teamPercent, setTeamPercent] = useState(NUMBER.ZERO);
    const [workerPercent, setWorkerPercent] = useState(NUMBER.ZERO);
    const [propay, setPropay] = useState(null);
    const [employee, setEmployee] = useState(null);
    const {hours,budget_option,budget_hours,max_hours,wage_ids,bonus_split_type,employee_id,propay_id,selected_employee_ids_obj,
           expanded,setExpanded,setEmployeeSelectedId} = props;
    const [budget,setBudget] = useState(props.budget)
    useEffect(()=>{
        if(propay !== propay_id || employee !== employee_id){
            setTeamPercent(NUMBER.ZERO);
            setWorkerPercent(NUMBER.ZERO);
        };
        setEmployee(employee_id);
        setPropay(propay_id);
        setEmployeeSelectedId(employee_id);
        
    },[propay_id, employee_id, propay, employee, setEmployeeSelectedId]);

    useEffect(()=>{
            setWorkerPercent(NUMBER.ZERO);        
    },[teamPercent]);
    const workerLoggedHours = wage_ids?.filter((item: any) => item.employee_id === employee_id);
    const workerLoggedHour = workerLoggedHours && workerLoggedHours[0]?.hours;

    const workerSelectedHour = ((max_hours - teamPercent)-(hours-workerLoggedHour) - workerPercent) > 0 ? ((max_hours - teamPercent)-(hours-workerLoggedHour) - workerPercent) : workerLoggedHour;
    const OtherWageIds = wage_ids?.filter((item: any) => item.employee_id !== employee_id)

    const goals = useMemo(()=>{
        return getWorkerGoal(max_hours-teamPercent,OtherWageIds,hours,budget,bonus_split_type, workerSelectedHour);
    },[max_hours, teamPercent, OtherWageIds, hours, budget, bonus_split_type, workerSelectedHour]); 
    const currentWorkerGoal = useMemo(() => {
        if(employee_id!=='@all'){
            const employeeData = _.find(wage_ids, function (employee_wage) {
                return employee_wage.employee_id === employee_id;
            });
            const base_pay = employeeData?.base_wage * workerSelectedHour;
            return { employeeData, base_pay:base_pay }
        }
    },[employee_id, wage_ids, workerSelectedHour]);

    const currentTeamGoal = useMemo(() => {
        if(employee_id){
            const total_earning = _.sumBy(Object.values(goals), 'base_pay')+ currentWorkerGoal?.base_pay;
            const total_hours = _.sumBy(Object.values(goals), 'hours')+workerSelectedHour;
            const base_pay = _.sumBy(Object.values(goals), 'base_pay')+currentWorkerGoal?.base_pay;
            const employee_avg_base_wage = _.sumBy(Object.values(goals), 'base_wage')+currentWorkerGoal?.employeeData?.base_wage;
            const avg_base_wage = total_hours && total_hours > NUMBER.ZERO ? (base_pay / total_hours):employee_avg_base_wage;
            const avg_pay_rate =  total_hours && total_hours > NUMBER.ZERO ? (total_earning / total_hours):employee_avg_base_wage;
            return {
                base_wage:avg_base_wage,
                pay_rate:avg_pay_rate,
                earning:total_earning,
                base_pay:base_pay,
                total_hours:total_hours,
                total_earning: total_earning
            }
        }
        
    },[employee_id, goals, currentWorkerGoal?.base_pay, currentWorkerGoal?.employeeData?.base_wage, workerPercent]);

    useEffect(()=>{
        if (budget_option === 'hours'){
            setBudget(currentTeamGoal?.pay_rate*budget_hours)
        }
    },[currentTeamGoal?.pay_rate]);

    const bonusEarning = budget - currentTeamGoal?.earning;
    const perhourBonus = bonusEarning/(max_hours-teamPercent);
    const identity = useIdentityContext(); 
    const days = getDaysAndHours(max_hours-teamPercent,identity.company?.hours_per_day)

    const base_wage = get(currentWorkerGoal.employeeData, 'base_wage');
    const workerPropayRate = perhourBonus + base_wage;
    const potential_bonus_earning = perhourBonus * ((max_hours-teamPercent)-(hours-workerLoggedHour) - workerPercent);
    
    const max = max_hours < NUMBER.ONE ? max_hours : hours > NUMBER.ZERO ?  max_hours - hours : max_hours - NUMBER.ONE;
    const max_display = max_hours < NUMBER.ONE ? NUMBER.ZERO : hours < NUMBER.ONE ? NUMBER.ONE : hours;
    const min = NUMBER.ZERO;
    const step = max_hours < NUMBER.ONE ? _.round(max_hours/NUMBER.TEN, NUMBER.ONE) : budget < NUMBER.ONE_THOUSAND ? NUMBER.ZERO_POINT_FIVE : NUMBER.ONE;
    
    const maxDisplayWorker = (max_hours-teamPercent) < NUMBER.ONE ? NUMBER.ZERO : workerLoggedHour < NUMBER.ONE ? NUMBER.ONE : workerLoggedHours && workerLoggedHours[NUMBER.ZERO]?.hours;
    const maxWorker = (max_hours-teamPercent-(hours-workerLoggedHour)) < NUMBER.ONE ? NUMBER.ZERO : (max_hours-teamPercent-(hours-workerLoggedHour)-maxDisplayWorker);
    const minWorker = NUMBER.ZERO;
    const stepWorker = (max_hours-teamPercent) < NUMBER.ONE ? _.round(teamPercent/NUMBER.TEN, NUMBER.ONE) : budget < NUMBER.ONE_THOUSAND ? NUMBER.ZERO_POINT_FIVE : NUMBER.ONE;

    const workerEstHours =(max_hours-teamPercent-(hours-workerLoggedHour)-workerPercent);
    const workedDaysWorker = workerLoggedHour > 0 && getDaysAndHours(workerLoggedHour,identity.company?.hours_per_day);
    const TeamWorkedDays = getDaysAndHours(hours,identity.company?.hours_per_day);
    const TeamMaxDays = getDaysAndHours(max_hours,identity.company?.hours_per_day);
    const myMaxDays = getDaysAndHours(max_hours-teamPercent-(hours-workerLoggedHour),identity.company?.hours_per_day)
    const myEstDays = getDaysAndHours(workerEstHours,identity.company?.hours_per_day);

    const PotentialBonus = () => {
        return <HeadingLabel sx={{textAlign:'center'}}><Typography component={'span'} variant='h3' color='primary'>
            &nbsp;{fCurrency(potential_bonus_earning > 0 ? potential_bonus_earning: 0,'$0,0.00')}&nbsp;</Typography>
            <Typography variant='h4'>Potential Bonus</Typography></HeadingLabel>
    };
    const PropayWage = () => {
        return <HeadingLabel><Typography component={'span'} variant='h3' color='primary'>
            &nbsp;{fCurrency(perhourBonus > NUMBER.ZERO ? perhourBonus : NUMBER.ZERO ,'$0,0.00')}<sub>/hr</sub></Typography>
            <Typography variant='h4'>Bonus/hr</Typography></HeadingLabel>
    };   
    const IncPercentage = () => {
        return <HeadingLabel><Typography component={'span'} variant='h3' color='primary'>
            &nbsp;{Number(workerPropayRate) > NUMBER.ZERO && !Number.isNaN(workerPropayRate) ? `${fCurrency(workerPropayRate,'$0,0.00')}`: '$0'}</Typography>
            <Typography variant='h4'>Propay Rate</Typography></HeadingLabel>
    };
    const handleChange = (event, newExpanded) => {
      setExpanded(newExpanded);
    };
    return (
        <Grid className='goal-slider-cont' container>
            <Grid className='goal-slider-left' item lg={6} md={6} sm={6} xs={12} sx={{ ...styles.gridCenter, justifyContent: 'space-evenly', alignItems: 'flex-start' }}>
                <Grid className='goal-slider-box' container justifyContent='space-around' >
                
                {max_hours > hours && workerSelectedHour > 0 && (
                        <Grid className='grid-item-potential' item>
                        <Stack className='potential-bonus-row' direction='row' justifyContent='center' alignItems='center'>
                            <Stack direction='column' justifyContent='center' alignItems='center' textAlign='center' sx={{marginLeft:2  }}>
                                <PotentialBonus />                                
                                {bonus_split_type === 'by_wage' && <IncPercentage/>}
                                {bonus_split_type === 'by_hours' && <PropayWage />}
                            </Stack>
                        </Stack>
                        </Grid>
                        )
                    }
                { propay_id && employee_id && <Grid className='goal-footer-row goal-footer-worker' container justifyContent='space-around'>
                <Grid className='three-worker-grid' container justifyContent='space-around' >
                <Grid item>
                    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <HeadingLabel className='max-hour-label'>My Max Hours</HeadingLabel>
                        <Box className='no-field-hour' sx={{ ...styles.hoursContainer,   color: theme.palette.primary.main }}>
                        <Typography>{timeLogged(max_hours-teamPercent-(hours-workerLoggedHour) > 0 ? max_hours-teamPercent-(hours-workerLoggedHour): 0)}</Typography>
                            {myMaxDays && <Typography variant='caption' color='white'>({myMaxDays})</Typography>}
                        </Box>
                    </Stack>
                </Grid>
                <Grid item>
                    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <HeadingLabel className='max-hour-label'>My Est. Hours</HeadingLabel>
                        <Box className='no-field-hour' sx={{ ...styles.hoursContainer, backgroundColor: theme.palette.primary.main, marginBottom: 1 }}>
                            <Stack direction='column' justifyContent='center' alignItems='center' sx={{  flex: 1 }} >
                                <Typography fontSize={{ lg: 18, md: 16, sm: 12,xs: 12 }} fontWeight='bold' color='white'>
                                    {convertNumToTime(_.round(workerEstHours, NUMBER.TWO))}</Typography>
                                {myEstDays && <Typography variant='caption' color='white'>({myEstDays})</Typography>}
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item>
                    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <HeadingLabel className='max-hour-label'>My Hours Worked*
                        <InfoLabel height={18} icon='ri:error-warning-fill'>
                        <StyledTypography>{translate('resources.propayCalculators.fields.assuming_hours_entered')}</StyledTypography>
                        </InfoLabel>
                        </HeadingLabel>
                        <Box className='no-field-hour' sx={{ ...styles.hoursContainer,  color: theme.palette.primary.main, marginBottom: 1 }}>
                            <Typography>{timeLogged(workerLoggedHour ? workerLoggedHour : NUMBER.ZERO)}</Typography>
                            {workedDaysWorker  && <Typography variant='caption' color='white'>({workedDaysWorker})</Typography>}
                        </Box>
                    </Stack>
                </Grid>
                </Grid>

        <Grid item xs={12} className='create-right-panel calculator-right-panel'>  
        <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary
          expandIcon={'+'}
          aria-controls='calculator1a-content'
          id='calculator1a-header'
        >
          <Typography>{translate('resources.propayCalculators.fields.team_details')}
            <InfoLabel height={18} icon='ri:error-warning-fill'>
            <StyledTypography>{translate('resources.propayCalculators.fields.hours_worked_included_all_team_members')}</StyledTypography>
            </InfoLabel>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Grid className='calculator-accordion' container justifyContent='space-around' >
        <Grid item>
                    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <HeadingLabel className='max-hour-label'>Team Max Hours 
                        </HeadingLabel>
                        <Box className='no-field-hour' sx={{ ...styles.hoursContainer, backgroundColor: theme.palette.primary.main, marginBottom: 1 }}>
                            <Stack direction='column' justifyContent='center' alignItems='center' sx={{  flex: 1 }} >
                            <Typography>{timeLogged(max_hours)}</Typography>
                                {TeamMaxDays && <Typography variant='caption' color='white'>({TeamMaxDays})</Typography>}
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item>
                    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <HeadingLabel className='max-hour-label'>Team Est. Hours</HeadingLabel>
                        <Box className='no-field-hour' sx={{ ...styles.hoursContainer, backgroundColor: theme.palette.primary.main, marginBottom: 1 }}>
                            <Stack direction='column' justifyContent='center' alignItems='center' sx={{  flex: 1 }} >
                                <Typography fontSize={{ lg: 18, md: 16, sm: 12,xs: 12 }} 
                                fontWeight='bold' color='white'>{convertNumToTime(_.round(max_hours-teamPercent, NUMBER.TWO))}</Typography>
                                {days && <Typography variant='caption' color='white'>({days})</Typography>}
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item>
                    <Stack direction='column' sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <HeadingLabel className='max-hour-label'>Team Hours Worked*
                        <InfoLabel height={18} icon='ri:error-warning-fill'>
                        <StyledTypography>{translate('resources.propayCalculators.fields.assuming_hours_entered')}</StyledTypography>
                        </InfoLabel>
                        </HeadingLabel>
                        <Box className='no-field-hour' sx={{ ...styles.hoursContainer, backgroundColor: theme.palette.primary.main, marginBottom: 1 }}>
                            <Stack direction='column' justifyContent='center' alignItems='center' sx={{  flex: 1 }} >
                            <Typography>{timeLogged(hours)}</Typography>
                                {TeamWorkedDays &&<Typography variant='caption' color='white'>({TeamWorkedDays})</Typography>}
                            </Stack>
                        </Box>
                    </Stack>
                </Grid>
        </Grid>
        </AccordionDetails>
      </Accordion>
      </Grid>
                </Grid>}
                </Grid>
            </Grid>
            {propay_id && <Grid className='goal-slider-right' item lg={6} md={6} sm={6} xs={12}>
                <Box sx={{ minHeight: 130, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Stack className='goal-slider-width' sx={{ width: '98%' }}>
                        {base_wage === 0 ? (<HeadingLabel sx={{ textAlign: 'center' }}>Your wage is zero</HeadingLabel>) : max_hours > hours ? (
                        employee_id && 
                            <>
                            <label className='total-team-hours'>{translate('resources.propayCalculators.fields.total_team_hours')}</label>
                            <PrettoSlider
                                value={teamPercent}
                                valueLabelDisplay='auto'
                                valueLabelFormat={() => {
                                    return convertNumToTime(_.round(max_hours - teamPercent, NUMBER.TWO))
                                }}
                                min={min}
                                max={max}
                                step={step}
                                marks={[{ value: min, label: convertNumToTime(_.round(max_hours, NUMBER.TWO)) + ' Hours' }, 
                                { value: max, label: convertNumToTime(_.round(max_display, NUMBER.TWO)) + ' Hours' }]}
                                onChange={(event: Event, value: number) => {
                                    setTeamPercent(value)
                                }}
                            />
                            {(max_hours-teamPercent-(hours-workerLoggedHour)) > 0 && <><EmployeeName id={employee_id} empObj={selected_employee_ids_obj} />
                            <PrettoSlider
                                        className='pretto-worker-hours'
                                        value={workerPercent}
                                        valueLabelDisplay='auto'
                                        valueLabelFormat={() => {
                                            return convertNumToTime(_.round((max_hours-teamPercent-(hours-workerLoggedHour) - workerPercent), NUMBER.TWO));
                                        } }
                                        min={minWorker}
                                        max={maxWorker}
                                        step={stepWorker}
                                        marks={[{ value: minWorker, label: convertNumToTime(_.round((max_hours-teamPercent-(hours-workerLoggedHour)), NUMBER.TWO)) + ' Hours' }, 
                                        { value: maxWorker, label: convertNumToTime(_.round(maxDisplayWorker, NUMBER.TWO)) + ' Hours' }]}
                                        onChange={(event: Event, value: number) => {
                                            setWorkerPercent(value);
                                        } } /></>}
                            </>
                             ) : (<HeadingLabel className='heading-label-goal-width' sx={{ textAlign: 'center' }}>
                                <Typography className='no-propay-selected'>Your worked hours exceed maximum hours</Typography></HeadingLabel>) 
                        }
                    </Stack>                    
                </Box>
            </Grid>}

            {(!employee_id || !propay_id) && <Grid className='goal-slider-right' item lg={6} md={6} sm={6} xs={12}>
                <Box sx={{ minHeight: 130, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Stack className='goal-slider-width goal-slider-disabled' sx={{ width: '98%' }}>                        
                        <>
                        <label className='total-team-hours'>{translate('resources.propayCalculators.fields.total_team_hours')}</label>
                        <PrettoSlider    
                            aria-label='TotalTeamHours'                        
                            valueLabelDisplay='auto'
                            disabled                            
                            min={0}
                            max={0}
                            step={0}                            
                        />
                        <label className='total-team-hours'>{translate('resources.propayCalculators.fields.only_worker_hours')}</label>
                        <PrettoSlider  
                            className='pretto-worker-hours'
                            aria-label='WorkerHours'                          
                            valueLabelDisplay='auto'
                            disabled                            
                            min={0}
                            max={0}
                            step={0}                            
                        />
                        </>
                    </Stack>                    
                </Box>
            </Grid>}

        </Grid>
    );
};

export const getBaseWage = (employee_wage) => {
    return  get(employee_wage, 'base_wage', 0.0)
}

const getWorkerGoal = (max_hours,wage_ids,hours,budget,bonus_split_type, workerHours) => {
    const no_of_employees = _.size(wage_ids);
    const new_wages = wage_ids?.map(employee_wage => {
        const new_hours = no_of_employees > 0 ? (((max_hours-workerHours)) / no_of_employees): 0;
        const base_wage = getBaseWage(employee_wage)
        const base_pay = _.round(new_hours * base_wage, NUMBER.TWO);
        return {
            bonus_per:employee_wage.bonus_per,
            hours:new_hours,
            base_pay: base_pay,
            base_wage: base_wage,
            employee_id: employee_wage.employee_id,
            is_remove_bonus:employee_wage.is_remove_bonus,
            earning:_.round(employee_wage.base_pay,NUMBER.TWO)
        };
    });

    const total_earning = _.sumBy(new_wages, 'base_pay');
    const diff = budget - total_earning;
    const wages_having_include_bonus_true = getBonusWages(new_wages);
    const worked_hours = _.sumBy(wages_having_include_bonus_true, 'hours');
    const wages_earning = _.map(new_wages,(wage)=>{
        return {
            ...wage,
            earning: wage.is_remove_bonus === false ?_.round(getBonus(diff,wage,worked_hours,bonus_split_type,total_earning) + wage.base_pay, NUMBER.TWO ):wage.base_pay,
        };
    })
    const hourly_rates = _.map(wages_earning, (wage) => {
        return { ...wage, pay_rate: _.round(wage.earning / wage.hours, NUMBER.TWO) };
    })
    
    return _.keyBy(hourly_rates, 'employee_id');
}

export const StyledCreate = styled(Create)({
    '.MuiFormHelperText-root': { display: 'none' },
    '.MuiFormHelperText-root.Mui-error': { display: 'block' },
    '.MuiPaper-elevation': {
        boxShadow: 'none',
    },
    '.MuiTableRow-root': {
        height: 40,
    },

    '.MuiInputBase-input': {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
    },
    '.MuiFormLabel-root': {
        fontWeight: 'bold',
    },
    '.MuiInputBase-formControl': {
        marginTop: 0,
    },
    '.MuiBox-root':{
        paddingTop:0,
        paddingBottom:0
    }
   
});

const PropayCalculator = () => {
    const identity = useIdentityContext();
    if(!identity) return null;
    return (
        <HasPermission resource='propay_calculator' action='read'>
            <DashboardGridItem className='propay_calculator' lg={12} md={12} sm={12} xs={12} sx={{mx:[NUMBER.TWO,0], marginBottom:[1,0]}}>
                <Card id='my-calculator' sx={{ borderRadius:[NUMBER.FIVE, NUMBER.TWO], display: 'flex', flexDirection: 'column' }}>
                    <CalculatorForm />                    
                </Card>
            </DashboardGridItem>
        </HasPermission>
    );
};

const MoneyFormField = ({format='$0,', ...rest}: any) => {
    const { input } = useInput(rest);
    return <Typography variant='h5'>{fCurrency(input.value, format)}</Typography>;
};

export default PropayCalculator;
