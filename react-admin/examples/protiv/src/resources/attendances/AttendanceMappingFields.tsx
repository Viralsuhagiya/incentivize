import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import _ from 'lodash';
import { useCreate, useNotify, useQuery, useUpdate } from 'react-admin';
import Dropzone from 'react-dropzone';
import { useNavigate } from 'react-router';
import { read, utils } from 'xlsx';
import IconsFile from '../../assets/icons-file.svg';
import DataImportIconSuccess from '../../assets/insert-drive-file-black-24-dp-success.svg';
import { ConfirmModal } from '../../components/ConfirmModal';
import { DialogLeavingPage } from '../../components/DialogLeavingPage';
import { useGetIdentityOptimized } from '../../components/identity/useGetIdentityOptimized';
import ScrollToTop from '../../components/ScrollToTop';
import { useNavigatingAway } from '../../hooks/useNavigatorBlock';
import { findFileType, ImportStep, isMobile, removeDuplicates, requiredColumnsFirstName, requiredColumnsFullName, validateCsvAndExcelFile, validateFileHaveData, validateNext } from '../../utils/Constants/ConstantData';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { post } from '../onboard/PaymentProvider';
import AttendanceImportHistory from './AttendaceImportHistory';
import AttendanceImportPropayMapper from './AttendanceImportStepFour';
import AttendanceImportColumnMapper from './AttendanceImportStepOne';
import AttendanceImportEmployeeMapper from './AttendanceImportStepThree';
import AttendanceImportJobMapper from './AttendanceImportStepTwo';
import DownloadExcel from './FileDownload';
import ImportDataHelperText from './ImportHelperText';
// import { canAccessCheckInOut } from './Attendance';
// import { usePermissionsOptimized } from '../../components/identity';
import Loader from '../../layout/Loader';
import { Icon } from '@iconify/react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Select from 'react-select';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

export const HandleAttendanceImport = (props: any) => {

    const [file, setFile] = React.useState<any | null>(null);
    const [readFileData, setReadFileData] = React.useState<any | null>([]);
    const [base64FileUrl, setBase64FileUrl] = React.useState<string>('');
    const [dataImported, setDataImported] = React.useState<boolean>(false);
    const [fileError, setShowFileError] = React.useState<boolean>(false);
    const [cancelImportProcess, setCancelImportProcess] = React.useState<boolean>(false);
    const [fileData, setFileData] = React.useState<any | null>(null);
    const [progress, setProgress] = React.useState(NUMBER.ZERO);
    const [csvHeader, setCsvHeader] = React.useState<any | null>(null);
    const [columnModalOpen, setColumnModalOpen] = React.useState<boolean>(false);
    const [FormatModalOpen, setFormatModalOpen] = React.useState<boolean>(false);
    const [selectedColumn, setSelectedColumn] = React.useState<any>({});
    const [selectedFormats, setSelectedFormats] = React.useState<any>({});
    const [selectedFormatsError, setSelectedFormatsError] = React.useState<boolean>(false);
    const [selectedColumnError, setSelectedColumnError] = React.useState<boolean>(false);


    const navigate = useNavigate();
    const notify = useNotify();
    const {identity} = useGetIdentityOptimized();
    ScrollToTop();
    const cancelProcess = () => {
        setCancelImportProcess(true);
    }
    const confirmCancel = () => {
        setCancelImportProcess(false);
        setColumnModalOpen(false);
        setSelectedColumn({});
        setSelectedFormats({});
        setSelectedFormatsError(false);
        setSelectedColumnError(false);
        setFormatModalOpen(false);
        setFile(null);
        setFileData(null);
        setProgress(NUMBER.ZERO);
        setCsvHeader(null);
        window.scrollTo(NUMBER.ZERO, NUMBER.ZERO);
    }

    const handleFileUpload = async (acceptedFile, valid) => {
    if (!valid[0]){
        setShowFileError(false);
        const file = acceptedFile[NUMBER.ZERO];
        const isValid: any = await validateCsvAndExcelFile(file);
        if (isValid?.success) {
            setFileData(acceptedFile[NUMBER.ZERO]);
            const reader = new FileReader();
            const rABS = !!reader.readAsBinaryString;
            reader.onload = e => {
                const parsedData = e.target.result;
                let fileData = e.target.result;
                if (typeof fileData === 'object') {
                    fileData = new TextDecoder('utf-8').decode(fileData);
                }
                const fileType = findFileType(file);
                if(fileType === 'csv'){
                    const csvUrl = "data:text/csv;base64," + btoa(fileData);
                    setBase64FileUrl(csvUrl);
                }else{
                    const xlsUrl = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + btoa(fileData);
                    setBase64FileUrl(xlsUrl); 
                }
          
                const fileRead = read(parsedData, { type: rABS ? 'binary' : 'array' });
                let sheet = fileRead.Sheets[fileRead.SheetNames[NUMBER.ZERO]];
                let sheetData: any = utils.sheet_to_json(sheet);
                let csvColumns = Object.keys(sheetData[NUMBER.ZERO]);
                csvColumns = removeDuplicates(csvColumns);
                csvColumns = csvColumns.map((header, index) => {
                    if (header?.startsWith('__EMPTY')) {
                      return `COLUMN_${index + NUMBER.ONE}`;
                    }
                    return header;
                  });                
                setCsvHeader(removeDuplicates(csvColumns));
                setReadFileData(sheetData);        
            }
            reader.onprogress = (ev) => {
                setProgress(Math.round((ev.loaded / ev.total) * NUMBER.HUNDRED));
            };

            if (rABS) reader.readAsBinaryString(file);
            else reader.readAsArrayBuffer(file);
        }
        else {
            notify(isValid?.message);
        };
    }else{
        setShowFileError(true);
    }
    };
    const isMobileDevice = isMobile();
    React.useEffect(() => {
        if (isMobileDevice) {
            navigate('/attendances');
        }
    }, [isMobileDevice, navigate])

    React.useEffect(() => {
        if (progress === NUMBER.HUNDRED) {
            setColumnModalOpen(true);
            setFile(fileData);
            setDataImported(true);
            setTimeout(() => {
                setDataImported(false);
                setProgress(NUMBER.ZERO);
            }, NUMBER.SIX_THOUSAND)
        }
    }, [fileData, progress]);

    const columnMapper = React.useRef([]);
    const dateFields = React.useRef([]);
    const TimeFields = React.useRef([]);
    const NameFormats = React.useRef([]);

    // const { permissions } = usePermissionsOptimized();
    // const checkInOutAddtime = canAccessCheckInOut({
    //     permissions,
    //     resource: 'feature_check_in_out',
    // });
    const handleColumnSelection = (value: any, columnName: string) => {
        // limit the number of selected options to 2 for the 'name' column
        if (columnName === 'name' && value && value.length > NUMBER.TWO) {
          return;
        }
        setSelectedColumn((previous) => ({
          ...previous,
          [columnName]: value ? value : null
        }));
      };
    const handleFormatSelection = (value: any, formatColumnName: string) => {
        setSelectedFormats((previous) => ({...previous, [formatColumnName]: value ? value : undefined}));
    };

    const handleNext = () => {
        if(!selectedColumn['name']?.length || !selectedColumn['dateFormat']){
            setSelectedColumnError(true);
        }else{
            setColumnModalOpen(false);
            setFormatModalOpen(true);    
        }
    } 
    const handleBack = () => {
        setColumnModalOpen(true);
        setFormatModalOpen(false);
    }
    const handleSave = () => {
        if(!selectedFormats['nameFormat'] || !selectedFormats['dateFormat']){
            setSelectedFormatsError(true);
        }else{
            setColumnModalOpen(false);
            setFormatModalOpen(false);    
        }
    }
    const dateVal = React.useRef();
    const userNameVal = React.useRef();

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const employeeNameKey = selectedColumn['name']?.length > NUMBER.ONE ? selectedColumn['name']?.map((item:{label: string}) => item?.label) :
    (selectedColumn['name']?.length && [selectedColumn['name'][NUMBER.ZERO]?.label]);
    const dateKey = selectedColumn['dateFormat'] ? selectedColumn['dateFormat']?.label : '';
    const dataFields = readFileData?.length && readFileData[NUMBER.ZERO]
    React.useEffect(() => {
        if(dataFields && employeeNameKey && employeeNameKey.length){
        dateVal.current = (dataFields && dataFields[dateKey]);
        userNameVal.current = (dataFields && employeeNameKey?.length > NUMBER.ONE ? `${dataFields[employeeNameKey[NUMBER.ZERO]]} ${dataFields[employeeNameKey[NUMBER.ONE]]}` : (dataFields && dataFields[employeeNameKey[NUMBER.ZERO]]));
        }
      }, [dataFields, dateKey, employeeNameKey])

      const filteredNameOptions = selectedColumn?.name?.length > NUMBER.ONE ? NameFormats?.current?.filter(option => option.value === 'first_last_name_sep') : 
      NameFormats?.current?.filter(option => option.value !== 'first_last_name_sep');
      React.useEffect(() => {
        if(filteredNameOptions && filteredNameOptions.length === NUMBER.ONE && columnModalOpen){
            setSelectedFormats((previous) => ({...previous, 'nameFormat': filteredNameOptions[NUMBER.ZERO] }));
        } 
        if(filteredNameOptions && filteredNameOptions.length > NUMBER.ONE && columnModalOpen){
            setSelectedFormats((previous) => ({...previous, 'nameFormat': undefined}));
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [filteredNameOptions.length])

    return (
        <>
        {identity?.company?.id && 
        <ComponentThatUsesUseQuery id={identity.company.id} NameFormats={NameFormats} 
          dateFields={dateFields} TimeFields={TimeFields} columnMapper={columnMapper} /> }
            <div className='import-data-page no-file-choosen-box'>
                <h2 className="MuiTypography-root MuiTypography-h2 main-title main-title-mobile">
                    <span className='back-button-attendence' onClick={() => navigate(-NUMBER.ONE)}>Back</span>
                    Import Data</h2>
                {!file &&
                    <>
                      <div className='attendance-import'>
                            <div className='attendance-import-row'>
                                <div className='upload-file-head'>
                                <div className='upload-file-left-head'>
                                    <h4>Welcome to import</h4>
                                    <p>You will be able to simply upload your time, jobs, and user files.</p>
                                </div>
                                <div className='upload-file-right-head'>
                                <Icon width={20} height={20} icon="ri:error-warning-fill" fr='' /> We are only supporting Check-In and Check-Out time.
                                </div>
                                </div>

                                <form id="file-upload-form" className="uploader">
                                    <Dropzone maxFiles={NUMBER.ONE} accept={{'text/csv': ['.csv'],'application/vnd.ms-excel': ['.xls'],'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':['.xlsx']}} 
                                    onDrop={(file, reason) => handleFileUpload(file, reason)}>
                                    {({getRootProps, getInputProps}) => (
                                        <label htmlFor="file-upload" id="file-drag">                                        
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                        <img id="file-image" src="#" alt="Preview" className="hidden" />
                                        <div id="start">
                                            <div className='upload-file-text'>Drop file to attach or <span>browse</span></div>
                                            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                                <g fill="none" fill-rule="evenodd">
                                                    <path d="M0 0h40v40H0z" />
                                                    <path d="M20 3.33a13.335 13.335 0 0 1 13.227 11.638 10.833 10.833 0 0 1-4.894 20V35H11.667v-.032a10.833 10.833 0 0 1-4.894-20A13.335 13.335 0 0 1 20 3.33zm0 10.003-6.667 8.334h5v6.666h3.334v-6.666h5L20 13.333z" fill="#FC6E45" fill-rule="nonzero" />
                                                </g>
                                            </svg>
                                            <div id="notimage" className="hidden">Please select an image</div>                                            
                                        </div>
                                        </div>
                                        {fileError && <span className='red-text'>File must be of type csv, xls or xlsx and should only be one file at a time.</span>}                                        
                                        </label>
                                    )}
                                    </Dropzone>
                                </form>

                                <div className='col-mapping-wrapper'>
                                    {!file && <>
                                        {/* {checkInOutAddtime ? <> */}
                                        {/* <DownloadExcelFileDuration /> */}
                                        <DownloadExcel />
                                        {/* </> :
                                        <DownloadExcelFilePayPeriod />} */}
                                    </>}
                                </div>
                                {fileData && progress !== NUMBER.HUNDRED && <div className='import-progress-div'>                                    
                                    <img src={IconsFile} alt='Icons File' />
                                    {fileData?.name}
                                    <button className='import-cancel-file' onClick={() => confirmCancel()}>Cancel</button>   
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}><LinearProgress variant="determinate" value={progress} /></Box>
                                </div>}
                               <ImportDataHelperText/>
                            </div>
                         <AttendanceImportHistory {...props}/>
                        </div>
                        {dataImported && <div className='alert-data-msg alert-data-msg-success'>
                                    <div className='alert-data-msg-wrap'>
                                        <div className='alert-data-msg-icon'><img src={DataImportIconSuccess} alt='alt' /></div>
                                        <div className='alert-data-msg-body'>
                                            <h4>Your data has been Imported successfully</h4>
                                            <p>Please map data fields</p>
                                        </div>
                                    </div>
                                </div>
                        }
                    </>
                }
            </div>
            <ImportColumnSelectionModal 
            selectedColumnError={selectedColumnError}
            isOpen={columnModalOpen} 
            handleNext={handleNext}
            handleCancel={cancelProcess}
            columnMapper={csvHeader}
            handleColumnSelection={handleColumnSelection}
            selectedColumn={selectedColumn}
            setSelectedColumn={setSelectedColumn}
            />  
            <ImportFromatSelectionModal 
            dateVal={dateVal.current}
            userNameVal={userNameVal.current}
            isOpen={FormatModalOpen} 
            selectedFormatsError={selectedFormatsError}
            filteredNameOptions={filteredNameOptions}
            handleCancel={cancelProcess}
            handleBack={handleBack}
            dateFields={dateFields.current} 
            setSelectedFormats={setSelectedFormats}
            NameFormats={NameFormats.current}
            handleFormatSelection={handleFormatSelection}
            selectedFormats={selectedFormats}
            selectedColumn={selectedColumn}
            handleSave={handleSave}
            />
            <ConfirmModal
                isOpen={cancelImportProcess}
                title='Cancel Import'
                content="Are you sure you want to cancel the import? Your data will no longer be available after cancelling the process."
                onClose={() => setCancelImportProcess(false)}
                onConfirm={confirmCancel}
            />
            {(file && !columnModalOpen && !FormatModalOpen) && 
            <AttendanceMappingFieldsStepper selectedColumn={selectedColumn} selectedFormats={selectedFormats} dateFields={dateFields} TimeFields={TimeFields} base64FileUrl={base64FileUrl} 
            columnMapper={columnMapper.current} readFileData={readFileData} file={file} csvHeader={csvHeader} cancelProcess={cancelProcess} />}
        </>
    );
};

const ComponentThatUsesUseQuery = (props) => {
    const {columnMapper, id, dateFields, TimeFields, NameFormats} = props;
    const { data } = useQuery({
        type: 'getOne',
        resource: 'Company',
        payload: { id: id },
      });
    columnMapper.current = data ? JSON.parse(data.import_mapped_fields.replace(/'/g, "\"")) : [];
    dateFields.current = data ? JSON.parse(data.import_date_format.replace(/'/g, "\"")) : [];
    TimeFields.current = data ? JSON.parse(data.import_time_format.replace(/'/g, "\"")) : [];
    NameFormats.current = data ? JSON.parse(data.employee_name_format.replace(/'/g, "\"")) : [];
    return(
    <>
    </>
  );
}

export default function AttendanceMappingFieldsStepper(props: any) {
    const { csvHeader, cancelProcess,file, readFileData,base64FileUrl, columnMapper,selectedColumn, selectedFormats} = props;
    const [importId, setImportId] = React.useState(null);
    const notify = useNotify();
    ScrollToTop();
    const [create, {isLoading}] = useCreate();
    const fileUpload = () =>{
        create(
            'protivAttendanceImport',
            { data: {'original_data': base64FileUrl, filename:file?.name}},
            {
                onSuccess: (response: any) => {
                    setImportId(response.id)
                    notify('File Uploaded');
                },
                onError: (error: any) => {
                    notify(`Element Failed ${error.message}`);
                },
            }
        );
    }
    React.useEffect(() => {
        if(!importId){
            fileUpload();
        }
       // eslint-disable-next-line react-hooks/exhaustive-deps
       }, [importId])
   
    const [activeStep, setActiveStep] = React.useState(NUMBER.ZERO);
    const [skipAlert, setSkipAlert] = React.useState(false);
    const [stepOne, setStepOne] = React.useState({});
    const [dateFormat, setDateFormat] = React.useState('');
    const [timeFormat, setTimeFormat] = React.useState('');
    const [stepTwo, setStepTwo] = React.useState({});
    const [stepThree, setStepThree] = React.useState({});
    const [stepFour, setStepFour] = React.useState([]);
    const [options, setOptions] = React.useState([]);
    const rquiredColumns = selectedColumn?.name.length < NUMBER.TWO ? requiredColumnsFullName : requiredColumnsFirstName;
    const employeeNameKeyValue = selectedColumn['name']?.length > NUMBER.ONE ? Object.keys(stepOne).filter(key => ['First Name', 'Last Name'].includes(stepOne[key]?.label)) :
    (Object.keys(stepOne).filter(key => ['Employee Name'].includes(stepOne[key]?.label)));
    const JobKey = Object.keys(stepOne).find(key => stepOne[key]?.label === 'Job');

    const [update, data] = useUpdate();
    const onUpdateStepOne = () =>{
        update(
            'protivAttendanceImports',
            {
                id:importId,
                data: {id: importId,'mapped_fields_data': JSON.stringify(stepOne), 'employee_name_format': JSON.stringify(selectedFormats?.nameFormat),
                'date_format': JSON.stringify(selectedFormats?.dateFormat)},
                previousData: {id:importId, 'mapped_fields_data':{}}
            },
            {
                mutationMode: 'pessimistic',
                onSuccess: () => {
                    const newActiveStep = activeStep + NUMBER.ONE;
                    setActiveStep(newActiveStep);
                        },
                onError: (error: any) => {
                    notify(`Element Failed Updated ${error.message}`);
                },
            }
        );
    }
    const onUpdateStepTwo = () =>{
        const updatedStepTwo = {};
        for (const [key, value] of Object.entries(stepTwo)) {
        if (value === "Create") {
            updatedStepTwo[key] = {label:key, value: key};
        } else {
            updatedStepTwo[key] = value;
        }
        }
        update(
            'protivAttendanceImports',
            {
                id:importId,
                data: {id: importId,'jobs_data': JSON.stringify(updatedStepTwo)},
                previousData: {id:importId, 'jobs_data':{}}

            },
            {
                mutationMode: 'pessimistic',
                onSuccess: () => {
                    const newActiveStep = activeStep + NUMBER.ONE;
                    setActiveStep(newActiveStep);
                    },
                onError: (error: any) => {
                    notify(`Element Failed Updated ${error.message}`);
                },
            }
        );
    }
    const onUpdateStepThree = () =>{
        update(
            'protivAttendanceImports',
            {
                id:importId,
                data: {id: importId,'employees_data': JSON.stringify(stepThree)},
                previousData: {id:importId, 'employees_data':{}}

            },
            {
                mutationMode: 'pessimistic',
                onSuccess: () => {
                    const newActiveStep = activeStep + NUMBER.ONE;
                    setActiveStep(newActiveStep);
                },
                onError: (error: any) => {
                    notify(`Element Failed Updated ${error.message}`);
                },
            }
        );
    }

    React.useEffect(() => {
        const columns = selectedColumn?.name?.length > NUMBER.ONE ? columnMapper.filter(obj => obj.label.toLocaleLowerCase() !== 'employee name') : columnMapper.filter(obj => (obj.label.toLocaleLowerCase() !== 'first name' || obj.label.toLocaleLowerCase() !== 'last name'));
        if(columnMapper.length && _.isEmpty(stepOne)){
            setStepOne(csvHeader ? csvHeader.reduce((acc, value) => 
            ({...acc, [value]: columns.filter(obj => obj.label.toLocaleLowerCase() === value.toLocaleLowerCase())[NUMBER.ZERO]}), {}) : {})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnMapper, csvHeader, stepOne, isLoading])

    const handleNext = async () => {
        const validateFirstStep: any = await validateNext(stepOne,rquiredColumns, selectedColumn['checkBox']);
        const validateEmployeeData: any = await validateFileHaveData(readFileData,employeeNameKeyValue, JobKey);
        if (validateFirstStep.valid && validateEmployeeData.valid) {
            handleNextApicall();
        } else if(!validateFirstStep.valid) {
            notify(validateFirstStep.message)
        }else{
            notify(validateEmployeeData.message)
        }
    };
    const handleNextApicall = () => {
        if(activeStep === NUMBER.ZERO){
            onUpdateStepOne();
        }else if(activeStep === NUMBER.ONE){
            onUpdateStepTwo();
        }else if(activeStep === NUMBER.TWO){
            onUpdateStepThree();
        }
    }

    const handlePrevious = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - NUMBER.ONE);
    };
    
    const handleChangeStepOne = (value: any, stepOneColumnName: string) => {
        setStepOne((previous) => ({...previous, [stepOneColumnName]: value ? value : undefined}));
    };
    const handleChangeStepTwo = (value: any, stepTwoColumnName: string) => {
        setStepTwo((previous) => ({...previous, [stepTwoColumnName]: value ? value : undefined}));
    };
    const handleChangeStepThree = (value: any, stepThreeColumnName: string) => {
        setStepThree((previous) => ({...previous, [stepThreeColumnName]: value ? value : undefined}));
    };
    const handleChangeStepFour = (value: any, stepFourKey: string, index: number) => {
            setStepFour((previous) => {
              const newArray = [...previous];
              newArray[index][stepFourKey] = value ? value : undefined;
              return newArray;
            });
          };
    const [finalApiCall, setFinalCall] = React.useState(false);
    const [canShowDialogLeavingPage, setCanShowDialogLeavingPage] = React.useState(true);
      const [
        showDialogLeavingPage,
        confirmNavigation,
        cancelNavigation
      ] = useNavigatingAway(canShowDialogLeavingPage);
    const navigate = useNavigate();

    const handleProced = () => {
        fetchProcessedData(stepFour, importId, setFinalCall, setCanShowDialogLeavingPage);
        setCanShowDialogLeavingPage(false);
    };

    const confirmSkip = async () => {
        const param = {"process_final_data": true, import_id: importId};
        const response = await handleApicallOnSkip(param);
        setCanShowDialogLeavingPage(false);
        if(response.status === 'success'){
          setFinalCall(true);
        }else{
            setCanShowDialogLeavingPage(true);
        }
    };

    const handleApicallOnSkip = async (params) => {
        const data = {
            jsonrpc: '2.0',
            params: params
        };
          const res = await post(
            '/api/process-final-data',
            data
          ) as any;
          if (res && res.error) {
            return Promise.reject(res);
          } else {
            return Promise.resolve(res);
        }
    }

    React.useEffect(() => {
        if(!canShowDialogLeavingPage && finalApiCall){
            navigate(`/attendances/import/${importId}/done`); 
        }
    }, [canShowDialogLeavingPage,finalApiCall, importId, navigate])

    return (
        <>
            <ImportStepsFlow activeStep={activeStep} />
            <div className='maping-body-box'>
            <>     
            {activeStep === NUMBER.ZERO && !isLoading &&  
            <AttendanceImportColumnMapper selectedColumn={selectedColumn} columnMapper={columnMapper} stepOne={stepOne} csvHeader={csvHeader} 
                dateFormat={dateFormat} setDateFormat={setDateFormat} handleChange={handleChangeStepOne} timeFormat={timeFormat} setTimeFormat={setTimeFormat}/>}
            {activeStep === NUMBER.ONE && 
            <AttendanceImportJobMapper  stepOne={stepOne} setStepTwo={setStepTwo} stepTwo={stepTwo} readFileData={readFileData} handleChange={handleChangeStepTwo}/>}
            {activeStep === NUMBER.TWO && 
            <AttendanceImportEmployeeMapper selectedColumn={selectedColumn} options={options} setOptions={setOptions} stepOne={stepOne} setStepThree={setStepThree} 
                readFileData={readFileData} stepThree={stepThree} handleChange={handleChangeStepThree}/>}
            {activeStep === NUMBER.THREE && 
            <AttendanceImportPropayMapper importId={importId} stepFour={stepFour} setStepFour={setStepFour} handleChange={handleChangeStepFour}/>}
            <NextPreviousAttendanceImport handleProced={handleProced} setSkipAlert={setSkipAlert} handleNext={handleNext} activeStep={activeStep} handlePrevious={handlePrevious} cancelProcess={cancelProcess}/>
            </>
            </div>
            <DialogLeavingPage
                showDialog={showDialogLeavingPage}
                setShowDialog={setCanShowDialogLeavingPage}
                confirmNavigation={confirmNavigation}
                cancelNavigation={cancelNavigation}
            />
            <ConfirmModal
                isOpen={skipAlert}
                title='Skip Step'
                content="Are you sure you want to skip this step?"
                onClose={() => setSkipAlert(false)}
                onConfirm={confirmSkip}
            />
            {(isLoading || data.isLoading || (!canShowDialogLeavingPage && !finalApiCall)) && <Loader/>}
        </>
    );
}

/*attendance import step flow ui */
const ImportStepsFlow = (props) => {
    const { activeStep } = props;
    return (
        <>
            <Box className='mapping-field-steps' sx={{ width: '100%' }}>
                <Stepper alternativeLabel activeStep={activeStep}>
                    {ImportStep.map((label) => (
                        <Step key={label}>
                            <StepButton color="inherit">
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </>
    );
};

/*attendance import actions like next,previous and cancel*/
const NextPreviousAttendanceImport = (props) => {
    const { handleNext, activeStep, handlePrevious, cancelProcess, setSkipAlert, handleProced } = props;
    return (
        <>
            <Box className='mapping-toolbar' sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                {activeStep !== NUMBER.ZERO && <Button
                    color="inherit"
                    className='mapping-prev-btn'
                    onClick={handlePrevious}
                    sx={{ mr: 1 }}
                >
                    Previous
                </Button>}
                <Box sx={{ flex: '1 1 auto' }} />
                {activeStep === NUMBER.THREE && <Button className='mapping-skip-btn' onClick={() => setSkipAlert(true)}>
                    Skip
                </Button>}
                <Button className='mapping-prev-btn' onClick={() => cancelProcess()} sx={{ mr: 1 }}>
                    Cancel
                </Button>
                {activeStep !== NUMBER.THREE && <Button className='mapping-next-btn' onClick={handleNext} sx={{ mr: 1 }}>
                    Next
                </Button>}
                {activeStep === NUMBER.THREE && <Button className='mapping-next-btn' sx={{ mr: 1 }} onClick={() => handleProced()}>
                    Proceed
                </Button>}
            </Box>
        </>
    );
};

const fetchProcessedData = async (params, importId, setFinalCall, setCanShowDialogLeavingPage) => {
    const chunkSize = NUMBER.TWENTY;
    let finalResponse;
    const totalChunks = Math.ceil(params.length / chunkSize);
    for (let i = NUMBER.ZERO; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;
        const chunkData = params.slice(start, end).reduce((acc, curr, index) => {
            acc[index] = curr;
            return acc;
        }, {});

        if (i === totalChunks - NUMBER.ONE) {
            const finalData = { process_final_data: true, import_id: importId, data: chunkData, page: i + NUMBER.ONE };
            const finalRequest = {
                jsonrpc: '2.0',
                params: finalData,
            };
            // eslint-disable-next-line no-loop-func
            setTimeout(async () => {
                finalResponse = await post('/api/process-final-data', finalRequest) as any;
                if (finalResponse && finalResponse.status) {
                    setFinalCall(true);
                    return Promise.resolve(finalResponse);  
                } else {
                    setCanShowDialogLeavingPage(true);
                    return Promise.reject(finalResponse);
                }    
            }, NUMBER.FOUR_HUNDRED * i);
        } else {
            const chunkRequest = {
                jsonrpc: '2.0',
                params: { data: chunkData, import_id: importId, page: i + NUMBER.ONE },
            };
            setTimeout(async () => {
                await post('/api/process-final-data', chunkRequest) as any;
            }, NUMBER.FOUR_HUNDRED * i);
        }
    }
};

/* Select Name and Date Modal */
const ImportColumnSelectionModal = (props) => {
    const { isOpen, handleNext, selectedColumnError,setSelectedColumn, handleColumnSelection, handleCancel, selectedColumn, columnMapper } = props;
    const options = columnMapper?.length && columnMapper?.map(item => ({
        value: item,
        label: item,
      }));
      const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
      const handleCheckbox = (e: any, stepOneColumnName: string) => {
        setSelectedColumn((previous) => ({...previous, [stepOneColumnName]: e.target.checked}));
      };

      const selectedLabels = Object.values(selectedColumn)?.flatMap((item: any) => Array.isArray(item) ? item.map(i => i?.label) : [item?.label]);
      const filteredOptions = options?.filter(option => !selectedLabels.includes(option?.label));
      
    return (
        <>
            <Dialog
                open={isOpen}
                aria-labelledby='popup-user-dialog-title'
                aria-describedby='popup-user-dialog-description'
                className='popup-user-modal time-format-modal'
            >
                <DialogTitle className='user-working-title'>
                Select Name, Date and Time
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className='user-working-description'>                    
                    <div className='form-group-modal'>
                    <Grid className='mapping-field-msg remove-mapping-field'>
                        <Typography>Please select columns in file that have both name and date. If Date & Time are in the same cell mark check box.</Typography>
                    </Grid>
                    <Select
                        className="basic-single"
                        isMulti
                        value={selectedColumn['name']}
                        placeholder='Name Column'
                        onChange={(e) => handleColumnSelection(e, 'name')}
                        isClearable={true}
                        isSearchable={true}
                        name="color"                                                    
                        options={filteredOptions}
                        classNamePrefix="react-select-unique"
                        required
                    />
                    {selectedColumnError && !selectedColumn['name']?.length && <span style={{ color: 'red' }}>Required!</span>}
                    </div>
                    <div className='form-group-modal'>
                    <Select
                        className="basic-single"
                        defaultValue={selectedColumn['dateFormat']}
                        placeholder='Date Column'
                        onChange={(e) => handleColumnSelection(e, 'dateFormat')}
                        isClearable={true}
                        isSearchable={true}
                        name="color"                                                    
                        options={filteredOptions}
                        classNamePrefix="react-select-unique"
                        required
                    />
                    {selectedColumnError && !selectedColumn['dateFormat'] && <span style={{ color: 'red' }}>Required!</span>}
                    </div>
                    <div className='form-group-modal'>
                    <Checkbox {...label} onChange={(e)=> handleCheckbox(e, 'checkBox')} checked={selectedColumn['checkBox']} /> Time included in date field
                    </div>                    
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button className='ra-confirm-import cancel-ra-confirm' onClick={()=> handleCancel()}>Cancel</Button>
                <Button className='ra-confirm-import' onClick={()=> handleNext()}>Next</Button>
                </DialogActions>
            </Dialog> 
        </>
    );
};

/* Confirm Name, Date And Time Format Modal */
const ImportFromatSelectionModal = (props: any) => {
    const { isOpen,dateVal,filteredNameOptions,userNameVal,selectedFormatsError,handleSave,selectedFormats,dateFields,handleFormatSelection, handleBack, handleCancel } = props; 

    return (
        <>
            <Dialog
                open={isOpen}
                aria-labelledby='popup-user-dialog-title'
                aria-describedby='popup-user-dialog-description'
                className='popup-user-modal time-format-modal'
            >
                <DialogTitle className='user-working-title'>
                    Please confirm Name, Date and Time format
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className='user-working-description'>
                    <Grid container spacing={1}>
                        <Grid xs={12} md={6}>
                        <div className='form-group-modal'>
                        <TextField disabled label="Name" value={userNameVal} variant="outlined" multiline fullWidth className='textarea-time-modal' /> 
                        </div>
                        </Grid>
                        <Grid xs={12} md={6}>
                        <Select
                            className="basic-single"
                            defaultValue={selectedFormats['nameFormat']}
                            placeholder='Name Format'
                            onChange={(e) => handleFormatSelection(e, 'nameFormat')}
                            isClearable={true}
                            isSearchable={true}
                            name="color"
                            classNamePrefix="react-select-unique"                                                    
                            options={filteredNameOptions}
                    />
                    {selectedFormatsError && !selectedFormats['nameFormat'] && <span className='required-time-modal' style={{ color: 'red' }}>Required!</span>}
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid xs={12} md={6}>
                        <div className='form-group-modal'>
                        <TextField disabled label="Date" value={dateVal} variant="outlined" fullWidth /> 
                        </div>
                        </Grid>
                        <Grid xs={12} md={6}>
                        <Select
                            className="basic-single"
                            defaultValue={selectedFormats['dateFormat']}
                            placeholder='Date Format'
                            onChange={(e) => handleFormatSelection(e, 'dateFormat')}
                            isClearable={true}
                            isSearchable={true}
                            name="color"
                            classNamePrefix="react-select-unique"                                                    
                            options={dateFields}
                    />
                    {selectedFormatsError && !selectedFormats['dateFormat'] && <span className='required-time-modal' style={{ color: 'red' }}>Required!</span>}
                        </Grid>
                    </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button className='ra-confirm-import cancel-ra-confirm' onClick={()=> handleBack()}>Previous</Button>
                <Button className='ra-confirm-import cancel-ra-confirm' onClick={()=> handleCancel()}>Cancel</Button>                
                <Button className='ra-confirm-import' onClick={()=> handleSave()}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};