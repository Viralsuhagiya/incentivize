import { NUMBER } from './MagicNumber';
import {VALIDATION} from './ValidationMessages'
// import { read, utils } from 'xlsx';

export const ACTIVE_TAB = {
    DASHBOARD: '/',
    PROPAY: '/propay/propay',
    BONUSES: '/propay/payroll/attendances',
    ADD_TIME: '/attendances/create',
    ATTENDANCE: '/attendances',
};

export const PROTIV_BILLING_LINK = 'https://billing.protiv.com/p/login/7sIeYUdyuedG1Y46oo';

export const HELP_CENTER_URL = "https://help.protiv.com";

export const ImportStep =[
                          'Mapping Attendance Fields',
                          'Mapping Job Details',
                          'Mapping Employee Fields',
                          'Mapping Propay Fields'
                          ];

export const LIST = {
    LIST: 'List',
    CARD: 'Card',
};

export const timeLogged = (hour: number) => {
    const decimalTimeString = hour.toString();
    let decimalTime = parseFloat(decimalTimeString);
    decimalTime = decimalTime * NUMBER.SIXTEY * NUMBER.SIXTEY;
    const hours = Math.floor((decimalTime / (NUMBER.SIXTEY * NUMBER.SIXTEY)));
    decimalTime = decimalTime - (hours * NUMBER.SIXTEY * NUMBER.SIXTEY);
    const minutes = Math.floor((decimalTime / NUMBER.SIXTEY));
    decimalTime = decimalTime - (minutes * NUMBER.SIXTEY);
    const totalHour = (hours < NUMBER.TEN && hours > NUMBER.ZERO) ? `0${hours}` : hours; 
    const totalMinutes = minutes < NUMBER.TEN ? `0${minutes}` : minutes;  
     return (`${totalHour}:${totalMinutes}`);   
  };

export const isMobile = () =>{
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    {
        return true;
     }
   else {
        return false;
         }
};

export const truncateString = (string: string) => (string.length > NUMBER.TWENTY_ONE ? `${string.substring(NUMBER.ZERO, NUMBER.TWENTY_FIVE)}…` : string);
export const truncatePropayName = (string: string) => (string.length > NUMBER.TWENTY_ONE ? `${string.substring(NUMBER.ZERO, NUMBER.FIFTEEN)}…` : string);

export const getLastWeeksDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - NUMBER.SEVEN);
  };


  export const getLastMonthDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - NUMBER.THIRTY);
  };

  
export const statusClass = (status: string) => {
    if(status === 'approved') return `green-status-btn card-status-btn`;
    else if(status === 'cancelled') return `red-status-btn card-status-btn`;
else if(status === 'paid') return `paid-status-btn card-status-btn`;
    return `card-status-btn`;
  };

  export const RemoveDuplicateObject= (arr: any) => {
    const uniqueArrayOfObjects = Array.from(new Set(arr.map(a => a.jonName))).map(jonName => {
      return arr.find(a => a.jonName === jonName);
    });
    return uniqueArrayOfObjects;
    
  };
  
  export const removeDuplicates = (arr: any) => {
    const uniqueArray = arr.reduce((accumulator, currentValue) => {
      if (accumulator.indexOf(currentValue) === -1) {
        accumulator.push(currentValue);
      }
      return accumulator;
    }, []);
      return uniqueArray;
  };
  
export const columnMapper = [
  {label: 'Employee Name', value: 'employee_name'},
  {label: 'Check In', value: 'start'},
  {label: 'Check Out', value: 'end'},
  {label: 'Task', value: 'task'},
  {label: 'Date', value: 'date'},
  {label: 'Hours', value: 'hours'},
  {label: 'Job', value: 'job'},
  {label: 'Propay', value: 'propay'},
  {label: 'First Name', value: 'first_name'},
  {label: 'Last Name', value: 'lats_name'},
  {label: 'Employee ID', value: 'id'}
]
export const requiredColumnsFirstName = ['Job', 'Check In', 'Check Out', 'First Name', 'Last Name',];
export const requiredColumnsFullName = ['Job', 'Check In', 'Check Out', 'Employee Name'];


/*function to handle import step one required column selected or not validation*/
export const validateNext = (stepOne,rquiredColumns, dateIncluded) => {
  return new Promise((resolve, reject) => {
    const columnsMarkedRequired = (!dateIncluded) ? [...rquiredColumns,'Date'] : rquiredColumns;
    const missingColumns = columnsMarkedRequired?.filter(col => {
      const newObj = { ...stepOne}; // Merge dateFormat and timeFormat into stepOne
      const matchingKey = Object.keys(newObj).find(key => (newObj[key]?.label === col || (key === col && newObj[key]?.label)));
      const matchingValue = newObj[matchingKey]?.value;
      return !matchingKey || !matchingValue || matchingValue.length === NUMBER.ZERO;
    });
    if (missingColumns.length > NUMBER.ZERO) {
      const message = `Missing required columns: ${missingColumns.join(', ')}`;
      resolve({ valid: false, message });
    } else {
      resolve({ valid: true, message: 'Step one is valid.' });
    }
  });
};

/*function to handle import step one required employee data validation*/
export const validateFileHaveData = (fileData, keyVal, JobKey) => {
  return new Promise((resolve, reject) => {
    if (keyVal && JobKey) {
      const systememployeeData = fileData?.map((row: any) => {
        const employeeName = keyVal.length >= NUMBER.TWO ? `${row[keyVal[NUMBER.ZERO]]} ${row[keyVal[NUMBER.ZERO]]}` : row[keyVal[NUMBER.ZERO]];
        return {
          name: employeeName,
          employee_id: employeeName
        };
      });
      const systemJobData = fileData?.map((row: any) => {
        const jobName = row[JobKey];
        return {
          name: jobName,
          employee_id: jobName
        };
      });
      if (systememployeeData.length > NUMBER.ZERO && systemJobData.length > NUMBER.ZERO ) {
        resolve({ valid: true, message: 'file is valid.' });
      } else {
        const message = `File do not contain required data to process`;
        resolve({ valid: false, message });
      }
      }else{
        resolve({ valid: false, message: 'Key missing.' });
      }
  });
};

/*function to handle csv and excel file validations */
export const validateCsvAndExcelFile = (file: File) => {
  return new Promise((resolve, reject) => {
      if (!file || file.size <= NUMBER.ZERO) {
        resolve({
          success: false,
          message: VALIDATION.INVALID_FILE
        });
      }else{
        resolve({
          success: true,
          message: VALIDATION.VALID_FILE
        });
      }
  }); 
};      

export const findFileType = (file) => {
  if (file.name.endsWith('.csv')) {
    return 'csv'
  } else {
       return 'xlsx'  
 }
};
