import {useCallback, useMemo} from 'react';
// material
import { styled } from '@mui/material/styles';
// hooks
import { SelectInput } from 'react-admin';
import { Form } from 'react-final-form';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import useSwitchCompany from '../resources/company/useSwitchCompany';
import {get} from 'lodash';

// ----------------------------------------------------------------------

export const StyledSelectInput = styled(SelectInput)({
  'min-width': '150px',
});

const RootForm = styled(Form)({
  '.MuiFormHelperText-root': { display: 'none' },
  '.MuiFormHelperText-root.Mui-error': { display: 'block' },
});

const  RadioButtonGroup =  ({value, choices,onChange, disabled}) => {
  return (
    <FormControl>
      <RadioGroup
        defaultValue={value}
        name='radio-buttons-group'
        onChange={onChange}
      >
        {choices.map((item:any)=>(
          <FormControlLabel key={item.id} value={item.id} control={<Radio disabled={disabled}/>} label={item.name} />
        ))}    
      </RadioGroup>
    </FormControl>
  )
};

export default function SelectCompany({identity}) {
  const {loading, switchCompany} = useSwitchCompany();
  const handleChange = useCallback((event)=>{
    switchCompany({id:parseInt(event.target.value)})
  },[switchCompany])
  const choices = useMemo(
    () => {
      return get(identity, 'user_companies.allowed_companies',[]).map((record)=>({id:record[0],name:record[1]}));
    },
    [identity]
  );  
  return (<>
    <RootForm onSubmit={()=>{}} initialValues={{}}>
      {()=>(
        <RadioButtonGroup  disabled={loading} value={identity.user_companies.current_company[0]} choices={choices} onChange={handleChange} />
        )
      }
    </RootForm>
  </>)
};
