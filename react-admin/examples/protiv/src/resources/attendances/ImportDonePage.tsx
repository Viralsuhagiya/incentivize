
import { useEffect, useState } from 'react';
import { useGetOne } from 'react-admin';
import { useParams } from 'react-router';
import EmptyFolderImport from '../../assets/empty-folder-copy.svg';
import Loader from '../../layout/Loader';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { DownloadFilureReasons } from './FileDownload';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

/* this component is to show the status of attendance import process. */
const ImportDone = () => {
    const {id} = useParams()
    const { data, isLoading, refetch, error } = useGetOne('protivAttendanceImports',{ id });
    const [importFileData, setFileImportData] = useState<any>(null);
    const [importFileReason, setFileReason] = useState<any>(null)
    useEffect(() => {
        if (data?.status === 'processing') {
          const intervalId = setInterval(() => {
            refetch();
          }, NUMBER.THREE_THOUSAND);
          return () => clearInterval(intervalId);
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [data?.status, refetch]);        
    
    useEffect(() => {
    if(data && data.result && !isLoading){
        setFileImportData(JSON.parse(data.result));
    }
    }, [data, data?.result, importFileData, isLoading])

    const getArray = (data) => {
        const arr = [];
        if (importFileData && importFileData.failure_reasons) {
          for (let i = 0; i < importFileData.failure_reasons.length; i++) {
            let fileObj:{reason : string} = importFileData.failure_reasons[i];
            if (data && data[i]) {
              let fileData = fileObj[data[i]];
              fileObj = { ...fileData, reason: fileObj.reason, employee_name:fileData?.employee_name?.label ? fileData?.employee_name?.label : null,
                propay_name:fileData?.propay_name?.label ? fileData?.propay_name?.label : null, job_name:fileData?.job_name?.label ? fileData?.job_name?.label : null};
                arr.push(fileObj);
            }
          }
        }
        return arr;
      };

      const getKeys = () => {
      const attendanceHeaders = [];
      return new Promise((resolve) => {
          for (let i = 1; i <= importFileData?.failure_reasons?.length; i++) {
                attendanceHeaders.push(`attendance_${i}`);
          }
            resolve(attendanceHeaders)    
        });
    };
    const getReasons = async () => {
        const arrData  = await getKeys();
        const getArrayData =  getArray(arrData);
        setFileReason(getArrayData);
    }
    useEffect(() => {
        if(importFileData?.failure_reasons){
            getReasons();
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [importFileData?.failure_reasons.length])

          return (
            <>
            {(!data && !error) ? <Loader /> :
            <>
                {importFileData && data?.status === 'success' ?
                    <div className='complete-import'>
                    <h2 className="MuiTypography-root MuiTypography-h2 main-title main-title-mobile">Completed Your Import</h2>
                    <div className='complete-import-box'>
                    <h4>{importFileData?.success_count} contacts will be added to your participant list</h4>
                    <ul>
                    <li>-   Import from: <span>{data?.filename}</span></li>
                    <li>-   Update existing employees: <span>{data?.is_existing_employee_update ? 'Yes':'No'}</span></li>
                    <li>-   Failed Contacts: <span>{importFileData?.failure_count}</span></li>
                    </ul>
                    {(importFileData?.failure_reasons?.length && importFileReason) ? <p>You can access the failed records from the below link and the reason for the failure. Please click on the below link to check the details. 
                    <DownloadFilureReasons reasons={importFileReason} fileName={data?.filename}/>
                    </p>: ''}
                    </div>
                </div>
                 : 
                (!data && <div className='attendance-import no-result-found'>
                <img src={EmptyFolderImport} alt='alt' />
                <p><strong>No Record Found</strong></p>
                <p></p>
                </div>)
               }  
               {
                data?.status === 'processing' &&
                <div className='attendance-import no-result-found'>
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                  </Box>
                  <p>
                  <strong>Import Is Under Progress
                  </strong>
                  </p>                  
                  </div>
                  }
                {data?.status === 'pending' && <div className='attendance-import no-result-found'>
                <img src={EmptyFolderImport} alt='alt' />
                <p><strong>Unfinished Import</strong></p>
                <p></p>
                </div>}
            </>
            }            
        </>
      ); 
    } 
 
export default ImportDone;
