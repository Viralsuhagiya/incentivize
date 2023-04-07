import { Stack, Tooltip, Typography } from '@mui/material';
import { AutocompleteInput, LinearProgress, useInput, useListContext, useTranslate } from 'react-admin';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { getBaseWage } from './PropayCalculator';
import { NUMBER } from '../utils/Constants/MagicNumber';
import { truncateString } from '../utils/Constants/ConstantData';
import { convertNumToTime } from '../utils/formatter';


/*this method is receiving employee object with (name and id) and returns employee name */
export const EmployeeName = (props:any) => {
    const { id, empObj } = props
      const EmployeeDetail = empObj.filter((detail) => (detail.id === id));
      const workerName = EmployeeDetail[NUMBER.ZERO]?.name.split(' ');
        return(
          <>
          {workerName?.[NUMBER.ZERO].length > NUMBER.TWENTY_ONE ? <Tooltip title={workerName?.[NUMBER.ZERO]} placement='bottom' arrow>
              <label>Set the number of hours {workerName?.[NUMBER.ZERO] && truncateString(workerName?.[NUMBER.ZERO].toString())} will work</label>
              </Tooltip>
              :
              <label>Set the number of hours {`${workerName?.[NUMBER.ZERO]}`} will work</label>
              }
          
          </>
        );
      };

      /*this method is receiving employee object with (name and id) and returns employee name */
export const OneEmployeeName = (props:any) => {
    const { empObj } = props
      const EmployeeDetail = empObj[NUMBER.ZERO];
      const workerName = EmployeeDetail?.name.split(' ');
        return(
          <>
          {workerName?.[NUMBER.ZERO].length > NUMBER.TWENTY_ONE ? <Tooltip title={workerName?.[NUMBER.ZERO]} placement='bottom' arrow>
              <label>Set the number of hours {workerName?.[NUMBER.ZERO] && truncateString(workerName?.[NUMBER.ZERO].toString())} will work</label>
              </Tooltip>
              :
              <label>Set the number of hours {`${workerName?.[NUMBER.ZERO]}`} will work</label>
              }
          
          </>
        );
      };




export const Employees = ({identity,EmployeeCount, ...rest}: any) => {
    const { input } = useInput(rest);
    const { data, isLoading } = useListContext(rest);
    const values = input.value || [];
    if (isLoading) return <LinearProgress />;
    const choices = values.length > 0 ? _.sortBy(data, 'id') : [];
    if(choices.length === 0){
        return <Typography className='no-propay-selected' sx={{height:32, display:'flex', alignItems:'center', justifyContent:'center'}} >No ProPay Selected</Typography>
    };
    if(identity.user_type === 'worker'){
        return (<WorkerEmployeesView choices={choices} identity={identity}/>);
    } else if(EmployeeCount === NUMBER.ONE){
        return (<EmployeesViewForOneWorker choices={choices} identity={identity}/>);
    } else {
        return (<ManagerEmployeesView choices={choices}/>);
    }
};

const LabelStyle = {lg: 15,md: 15,sm: 14,xs: 14};

export const WorkerEmployeesView = ({choices, identity}: any) => {
    return (
        <Stack sx={{ flexDirection:'row',alignItems:'center',justifyContent:'center', flex:1,}}>
            <Stack sx={{alignItems:'center',justifyContent:'center', flex:1,}}>
                <Typography className='no-propay-selected' fontSize={LabelStyle} fontWeight='bold' >{identity.name}</Typography>
            </Stack>
        </Stack>
        );
};
export const EmployeesViewForOneWorker = ({choices, identity}: any) => {
    return (
        <Stack className='propay-worker-label' sx={{ flexDirection:'row',alignItems:'center',justifyContent:'center', flex:1,}}>
            <Stack sx={{alignItems:'center',justifyContent:'center', flex:1,}}>
                <label>Worker</label>
                <Typography className='no-propay-selected' fontSize={LabelStyle} fontWeight='bold' >{choices[NUMBER.ZERO]?.display_name}</Typography>
            </Stack>
        </Stack>
        );
};


export const ManagerEmployeesView = ({choices}: any) => {
    const translate = useTranslate();
    return (<StyledAutoCompleteInput
        label= {translate('resources.propayCalculators.fields.selected_employee_id')}
        source='selected_employee_id'
            choices={choices}
            fullWidth={true}
            variant="standard"
            size="small"
            underlineShow={false}
        />)
};

export const HeadingLabel = ({children,...rest}) => {
    return<Typography fontSize={{ lg: 18, md: 16, sm: 12,xs: 12 }} fontWeight='bold' {...rest}>{children}</Typography>
}

export const NumberToTimeFormField = (props: any) => {
    const { input } = useInput(props);
    return (
        <HeadingLabel>{convertNumToTime(input.value)}</HeadingLabel>
    );
};


export const getPayRate = (employee_id: string, wage_ids: any) => {
    const wage = _.find(wage_ids, function (employee_wage) {
        return employee_wage.employee_id === employee_id;
    });
    return getBaseWage(wage);
};

export const getBonus = (remAmt,wage,max_hours,bonus_split_type,total_earning) => {
    let bonus=0.0;
    if (bonus_split_type === 'by_percentage') {
        bonus =  max_hours > 0 ? (remAmt * wage.bonus_per):0;
    } else if (bonus_split_type === 'by_wage') {
        const per_by_wage = total_earning > 0 ? (remAmt / total_earning):0
        bonus = max_hours > 0 ? (per_by_wage * wage.base_pay):0;
    } else {
        bonus = max_hours > 0 ? ((remAmt / max_hours) * wage.hours):0;
    }
    return bonus
}

export const getBonusWages = (wages) => {
    return  _.filter(wages, wage => wage.is_remove_bonus === false );
}

export const CheckResult = (propayId,propayType,empId) => {
    if(!propayType || !propayId){
        return true;
    } else if((propayType ==='WORKER' && empId ==='@all') || (propayType ==='WORKER' &&!empId)){
        return true;
    }else {
        return false;
    }
    }
    

export const getGoal = (max_hours,wage_ids,hours,amount,bonus_split_type) => {
    const no_of_employees = _.size(wage_ids);
    const new_wages = wage_ids?.map(employee_wage => {
        const new_hours = no_of_employees > 0 ? ((max_hours - hours) / no_of_employees) + employee_wage.hours : 0;
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
    const diff = amount - total_earning;
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


export const StyledAutoCompleteInput = styled(AutocompleteInput)({
    width:'100%',
    '.MuiTextField-root':{
        margin:0,
    },
    '.MuiFormControl-root':{
        height: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '600',
        Color: '#272727',
    },
    '.MuiInput-root.MuiInput-underline.MuiInputBase-root': {
        paddingRight:10
    },
    '.MuiAutocomplete-inputRoot':{
        padding:0
    },
    '.MuiInput-root.MuiInput-input':{
        padding:0,
        borderBottom:0
    },
    input:{
        textAlign:'center',
        borderBottom:'none',
        borderBox:'none',
    },
    '.MuiInput-root::before':{
        borderBottom:0
    },
    '.MuiInput-root:after':{
        borderBottom:0
    },
    '.MuiInput-root:hover':{
        borderBottom:0
    },
});

export const styles ={
    amountContainer: {
        width:['95%','75%','70%'], 
        borderRadius:50, 
        color:'white',
        boxShadow: 4,
        py:0.5,
        height:35,
        alignItems:'stretch',
        justifyContent:'stretch', 
        display:'flex'
    },
    gridCenter:{
        display:'flex', 
        justifyContent:'center', 
        alignItems:'center'
    },
    employeeContainer:{
        borderRadius:10,
        boxShadow: 4,
        minWidth:'90%',
        display:'flex',
        flexGrow:1,
        justifyContent:'center',
        alignItems:'center',
        px:1.2
    },
    autocomplete:{
        border:0
    },
    hoursContainer:{
        display:'flex',
        flexGrow:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop:2
        
    }
};

