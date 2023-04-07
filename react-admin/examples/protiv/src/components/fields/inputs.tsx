import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { Icon } from '@iconify/react';
import { DateTimePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import {
    Box, IconButton, InputAdornment,
    Stack, TextField as DefaultTextField, Typography
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import moment from 'moment';
import React, { useState } from 'react';
import {
    AutocompleteInput as RaAutocompleteInput, DateInput, DateTimeInput, NumberInput,
    TextInput, useGetIdentity, useInput
} from 'react-admin';
import { convertNumToTime } from '../../utils/formatter';
import { convertNumber } from './fields';

export const assumeUnsetIfUndefined = (fields:string[]) => {
    return (data:any) => {
        fields.forEach(element=>{
            if(data[element]===undefined){
                data[element] = 0;
            }
        });
        return data;
    }
};
const commonDateFormat = 'YYYY-MM-DD HH:mm:ss';

  
export const MoneyInlineInput = (props: any) => <NumberInput
  variant="standard"
  label={false}
  InputProps={{
      startAdornment: (
          <InputAdornment position="start">$</InputAdornment>
      ),
  }}
  {...props}
  type='number'
/>
export const MoneyInput = (props: any) => <NumberInput
    InputProps={{
        pattern: '^[0-9]*$',
        startAdornment: (
            <InputAdornment position="start">$</InputAdornment>
        ),
        
    }}
    {...props}
  />

export const AutocompleteInput = styled(RaAutocompleteInput)(({ theme }) => ({
    'width': '200px',
}));


export const PasswordInputField = (props: any) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    return (
        <TextInput
        type={showPassword ? "text" : "password"}
        autoComplete="new-password" 
        InputProps={{
            endAdornment: (
            <InputAdornment position="end">
                <IconButton onClick={handleShowPassword} edge="end">
                <Icon icon={showPassword ? eyeFill : eyeOffFill} fr=''/>
                </IconButton>
            </InputAdornment>
            ),
        }}
        {...props}
        ></TextInput>
    );
};



const CustomDatePicker = React.forwardRef((props:any, ref:any) => {
    const {onChange, ...rest} = props;
    const {record,basePath,label,margin,resource,source,validate,variant, ...others} = rest;
    return (
    <LocalizationProvider dateAdapter={DateAdapter}>
        <DatePicker
            label=""
            onChange={(newValue:any) => {
                if(newValue){  
                    props.onChange(newValue.format("YYYY-MM-DD"));
                } else {
                    props.onChange(null);
                }
            }}
            inputRef={ref}
            renderInput={(params) => {
                return <DefaultTextField variant={variant} {...params} sx={{width:'100%'}}  />
            }}
            {...others}
        />
    </LocalizationProvider>);
});

const StyledDateInput = styled(DateInput)(({ theme }) => ({
    '.MuiInputLabel-root' : {
        backgroundColor: "#fff",
    },
}));

export const DatePickerInput = (props: any) => {
    return (
        <StyledDateInput 
            InputProps={
            {
                inputComponent:CustomDatePicker,
                inputProps:{...props}}
            }
            {...props}
        />
    )
}



const CustomTimePicker = React.forwardRef((props:any, ref:any) => {
    const {onChange,  ...rest} = props;
    const {record,basePath,label,margin,resource,source,validate,variant, ...others} = rest;
    console.log("CustomTimePicker---", rest);
    return (
    <LocalizationProvider dateAdapter={DateAdapter}>
        <TimePicker
            label=""
            onChange={(newValue:any) => {
                if(newValue){  
                    props.onChange(newValue.format(commonDateFormat));
                } else {
                    props.onChange(null);
                }
            }}
            inputRef={ref}
            renderInput={(params) => {
                return <DefaultTextField {...params} sx={{width:"100%"}}  />
            }}
            {...others}
        />
    </LocalizationProvider>);
});

export const TimePickerInput = (props: any) => {
    return (
        <DateTimeInput 
            InputProps={
            {
                inputComponent:CustomTimePicker,
                inputProps:{...props}}
            }
            {...props}
        />
    )
}

const CustomDateTimePicker = React.forwardRef((props:any, ref:any) => {
    const {onChange,  ...rest} = props;
    const {record,basePath,label,margin,resource,source,validate,variant, ...others} = rest;
    console.log("CustomTimePicker---", rest);
    return (
    <LocalizationProvider dateAdapter={DateAdapter}>
        <DateTimePicker
            label=""
            onChange={(newValue:any) => {
                if(newValue){  
                    props.onChange(newValue.format(commonDateFormat));
                } else {
                    props.onChange(null);
                }
            }}
            inputRef={ref}
            renderInput={(params) => {
                return <DefaultTextField sx={{minWidth:250}} {...params} />
            }}
            {...others}
        />
    </LocalizationProvider>);
});

export const DateTimePickerInput = (props: any) => {
    return (
        <DateTimeInput 
            InputProps={
            {
                inputComponent:CustomDateTimePicker,
                inputProps:{...props}}
            }
            {...props}
        />
    )
}

export const TimeField = (props: any) => {
    const { input } = useInput(props);
    const theme = useTheme();
    const value = convertNumToTime(input.value)
    return (
        
         <Stack direction="column" sx={{ justifyContent: 'flex-start', whiteSpace: 'nowrap', alignItems: "center",paddingLeft:1 }} spacing={0.5}>
            <Typography variant="h6" sx={{color:"#919EAB",top:-20,fontSize:12}}>{props.label}</Typography>
            <Box sx={{
                boxShadow: 4,
                display: 'flex',
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 2,
                marginTop: 2,
                top: -20,
                height: 59,
                minWidth: 60, color: theme.palette.primary.main }}>
                {input.value >= 0 ? value : '--:--'}
            </Box>
        </Stack>
    );
};

export const ReactDateTimeInput = (props:any) => {
    const parse = (value:string)=>{
        return moment(value).format(commonDateFormat);
    }
    return <DateTimeInput parse={parse} {...props} />
}

export const HoursFormatInput = (props:any) => {
    const { loaded, identity } = useGetIdentity();
    if (!loaded) {
        return null;
    }
    const convertStringToNumber = value => {
        if (isNaN(value)){
            return '00:00'
        } else{
            return convertNumber(value, identity)
        }
    };
    return <TextInput format={convertStringToNumber} {...props} />
};
