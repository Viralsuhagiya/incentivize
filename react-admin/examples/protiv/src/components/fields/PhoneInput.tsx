import { TextFieldProps } from '@mui/material/TextField';
import { MuiPhoneNumberProps } from 'material-ui-phone-number';
import { FieldTitle, InputProps, useInput } from 'ra-core';
import * as React from 'react';
import { InputHelperText, sanitizeInputRestProps } from 'react-admin';
import MuiPhoneNumber from 'material-ui-phone-number';
import _ from 'lodash'

export type PhoneInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'helperText' | 'label'> & Omit<MuiPhoneNumberProps,'label'|'onChange'|'helperText'>;

export const PhoneInput = ({
    defaultValue,
    initialValue,
    label,
    name,
    options,
    source,
    resource,
    helperText,
    margin = 'dense',
    onBlur,
    onChange,
    onFocus,
    validate,
    variant = 'outlined',
    disableAreaCodes=true,
    countryCodeEditable=false,
    defaultCountry='us',
    onlyCountries,
    ...rest
}: PhoneInputProps) => {
        const nodeRef = React.useRef(null);
        const isValid = React.useCallback((val)=>{
            if(nodeRef.current){
                const {selectedCountry : {iso2, format, dialCode}, formattedNumber} = nodeRef.current.state
                if(formattedNumber===`+${dialCode}`){
                    console.log(`IsValid Empty => ', iso2:${iso2}, format:${format}, dialCode:${dialCode}, formattedNumber:${formattedNumber}, val:${val}, Valid:true`)
                    return true;
                }
                else if (formattedNumber && format){
                    console.log(`IsValid => ', iso2:${iso2}, format:${format}, dialCode:${dialCode}, formattedNumber:${formattedNumber}, val:${val}, Valid:${format.length === formattedNumber.length}`)
                    return formattedNumber.indexOf(`+${dialCode}`)===0 && format.length === formattedNumber.length    
                }
            }
        },[nodeRef])
        const validatePhone = value => (!value || isValid(value))?undefined:`Phone Number is Invalid`;
        const newValidate = !validate?validatePhone:(typeof validate === 'function'? [validate, validatePhone]:[...validate,validatePhone])
        const parsePhone = React.useCallback((value)=>{
            if(nodeRef.current){
                if(!value){
                    return value;
                }
                const {selectedCountry : {dialCode}} = nodeRef.current.state

                const unformattedNumber = value.replace(/[\s\\(\\)-]/g, '');
                if(unformattedNumber===`+${dialCode}`){
                    console.log('Parse Phone ', value, '');
                    return '';
                }
                console.log('Parse Phone ', value, unformattedNumber);
                return unformattedNumber;
            }
        },[nodeRef])
        const { id, input, isRequired, meta } = useInput({
            defaultValue,
            initialValue,
            name,
            onBlur,
            onChange,
            onFocus,
            parse:parsePhone,
            resource,
            source,
            validate:newValidate,
            ...rest,
        });
        const { error, submitError, touched } = meta;      
        //this is some custom logic to handle some edge cases when we copy paste after selecting all in the text box.
        // const [lastDialCode, setLastDialCode] = React.useState('');
        // const handleInput = React.useCallback((e)=>{
        //     const { value } = e.target;
        //     if(nodeRef.current){
        //         const {selectedCountry : {iso2, format, dialCode}, formattedNumber} = nodeRef.current.state
        //         if (formattedNumber && format){
        //             console.log(`handleInput => ', iso2:${iso2}, format:${format}, dialCode:${dialCode}, lastDialCode:${lastDialCode}, formattedNumber:${formattedNumber}, val:${value}, Valid:${format.length === formattedNumber.length}`)
        //         }
        //         const unformatedVal = value.replace(/[\s]/g, '');
        //         if(unformatedVal && unformatedVal[0]!=='+'){
        //             const newVal = `+${dialCode}${unformatedVal}`
        //             console.log('Handle Input Force Change to ',newVal);
        //             e.target.value = newVal
        //             return nodeRef.current.handleInput(e);
        //         }else{
        //             return nodeRef.current.handleInput(e)
        //         }
                
        //     }            
        // },[nodeRef,lastDialCode])
        // const handleChange = React.useCallback((val)=>{
        //     if(nodeRef.current){
        //         const {selectedCountry : {iso2, format, dialCode}, formattedNumber} = nodeRef.current.state
        //         if (formattedNumber && format){
        //             console.log(`OnChange => ', iso2:${iso2}, format:${format}, dialCode:${dialCode}, lastDialCode:${lastDialCode}, formattedNumber:${formattedNumber}, val:${val}, Valid:${format.length === formattedNumber.length}`)
        //             if(formattedNumber.indexOf(`+${dialCode}`)!==0){
        //                     const unformatedVal = formattedNumber.replace(/\D/g, '');
        //                     const newVal = `+${lastDialCode}${unformatedVal}`
        //                     console.log('Force Change to ',newVal);
        //                     nodeRef.current.updateFormattedNumber(newVal)
        //             }else{
        //                 setLastDialCode(dialCode);
        //             }
                    
        //         }
        //     }

        // },[nodeRef,lastDialCode, setLastDialCode])
    return (
            <MuiPhoneNumber
                id={id}
                {...input}
                placeholder='(702) 123-4567'
                onlyCountries={['us','in']}
                disableAreaCodes={disableAreaCodes}
                countryCodeEditable={false}
                disableCountryGuess={true}
                disableInitialCountryGuess={true}
                defaultCountry={defaultCountry}
                jumpCursorToEnd={true}
                className='ra-phone-number'
                sx={{
                    '.MuiPhoneNumber-flagButton':{
                        maxWidth:'30px' /**fix for firefox as it was showing flag very big */
                    },
                    '& svg':{
                        width:'100%' /**fix for safari as it was not showing flag */
                    }
                }}
                variant={variant}
                margin={margin}
                helperText={
                    <InputHelperText
                        touched={touched}
                        error={error || submitError}
                        helperText={helperText}
                    />
                }    
                error={!!(touched && (error || submitError))}
                ref={nodeRef}
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }     
                {...options}
                {...sanitizeInputRestProps(rest)}

                />
   );
};
