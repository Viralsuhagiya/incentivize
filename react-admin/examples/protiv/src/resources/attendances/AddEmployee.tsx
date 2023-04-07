import { DialogContent, Grid, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { RadioButtonGroupInput } from 'ra-ui-materialui';
import React, { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { FormWithRedirect, minValue, required, SaveButton, TextInput
} from 'react-admin';
import {
    EmailInput,
    MoneyInput
} from '../../components/fields';
import { PhoneInput } from '../../components/fields/PhoneInput';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { user_type_selection } from '../employees/Employee';
import { StyleToolbar } from '../payrolls/weeklyEntries';
import CloseIcon from '@mui/icons-material/Close';
import { InfoLabel } from '../../components/fields/InfoLabel';

const validateEmail = (employeeData, email) => {
    return new Promise((resolve, reject) => {
      const found = employeeData.some(obj => obj.email === email);
      if (found) {
        resolve({
          exists: true,
          message: 'This email already exists.'
        });
      } else {
        resolve({
          exists: false,
          message: 'valid and new email'
        });
      }
    });
  }
  

/* Action for AddEmployee Page */
const AddEmployee = (props: any) => {
    const {openviewattendence, setOpen, setOptions, systemEmployees} = props;
    const [emailError, setError] = useState('');
    const handleCloseviewattendence = () => setOpen(false);
    const onSaveForm = async (formData, formProps) => {
        if(formProps?.valid){
            const newFormData = {...formData, label: formData.name, value: formData.name}
            const newEmail: any = await validateEmail(systemEmployees.data,formData?.email)
            if(newEmail.exists){
                setError(newEmail.message);
            }else{
            setError('');
            setOptions(previous => [...previous, newFormData]);
            setOpen(false)
            }
        }else{
            setError('');
        }
    }

    return (
        <>
            <div className='add-employee-dropdown'>
                <Dialog
                    open={openviewattendence}
                    onClose={handleCloseviewattendence}
                    aria-labelledby='modal-modal-title'
                    aria-describedby='modal-modal-description'
                    className='common-diaglog-modal add-employee-modal'
                >
                    <DialogTitle>      
                    Add Employee  
        <IconButton
          aria-label='close'
          onClick={handleCloseviewattendence}
          sx={{
            position: 'absolute',
            right: NUMBER.EIGHT,
            top: NUMBER.EIGHT,
            color: (theme) => theme.palette.grey[NUMBER.FIVE_HUNDRED],
          }}
        >
          <CloseIcon />
        </IconButton>        
        </DialogTitle>

                    <DialogContent>
                        {emailError && <div className='add-employee-error'>
                        <InfoLabel sx={{height:10}} icon='ri:error-warning-fill' height={12}></InfoLabel>
                            {emailError}
                        </div>}
                        <FormWithRedirect {...props}
                            render={(formProps: any) => {
                                return (
                                    <Stack direction='column'>
                                        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ width: '100%' }} className='team-first-last' spacing={2}>
                                            <TextInput fullWidth source='name' label='Name' size='medium' validate={required()} />
                                        </Stack>
                                        <MoneyInput fullWidth source='base_wage' validate={[minValue(0, 'Must be positive value'), required()]} sx={{ pr: 1 }} />
                                        <RadioButtonGroupInput
                                            className='user-type-radio'                                            
                                            source='user_type'
                                            variant='standard'
                                            defaultValue={'worker'}
                                            choices={user_type_selection}
                                            validate={required()}
                                        />
                                        <PhoneInput fullWidth source='mobile_number' />
                                        <EmailInput fullWidth source='email' validate={required()}/>
                                        <Grid className='muitoolbar-addtime' container columnSpacing={0} sx={{ marginTop:0 }}>
                            <StyleToolbar
                                sx={{
                                    bottom: 0,
                                    marginBottom: 0,
                                    marginLeft: 3,
                                    marginRight: 3,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: '#FFF',
                                    flex: 1,
                                    position: 'relative',
                                    justifyContent: 'space-between',
                                }}
                                record={formProps.record}
                                invalid={formProps.invalid}
                                handleSubmit={formProps.handleSubmit}
                                handleSubmitWithRedirect={formProps.handleSubmitWithRedirect}
                                saving={formProps.saving}
                                basePath={''}>
                                
                              <SaveButton onSave={(data)=>onSaveForm(data, formProps)} />
                            </StyleToolbar>
                          </Grid>                                    
                        </Stack>
                                )
                    }} />
                </DialogContent>
            </Dialog>
        </div>
    </>
);
};
export default AddEmployee;