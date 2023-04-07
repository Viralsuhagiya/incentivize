import _ from 'lodash';
export const getDialCode = (locale:string, defaultCode?:string): string => {
    const dialCodesByLocale = {
        'en-us':'+1',
        'en-in':'+91'
    }
    const dialCode = _.get(dialCodesByLocale, _.trim(locale).toLowerCase(), defaultCode)
    return dialCode;        
};
export const formatUsername = (username:string, options?:any):string => {
    let newusername = _.trim(username)
    if(isPhoneNumber(newusername)){
        newusername = formatPhoneNumber(newusername, options)
    }
    console.log(`Formated Username '${username}' => '${newusername}'`);
    return newusername
};
export const formatPhoneNumber = (username:string, options?:any):string => {
    username = username.replace(/[\s\(\)-]/g, '');
    if(username[0]!=='+'){
        const dialCode = getDialCode(_.get(options||{},'locale'), '+1')
        username = `${dialCode}${username}`
    }
    return username
};
export const isPhoneNumber = (username:string): boolean =>{
    const phoneNumberRegEx = /^\+?[\d\s\(\)-]*$/g
    return phoneNumberRegEx.test(_.trim(username))
};

