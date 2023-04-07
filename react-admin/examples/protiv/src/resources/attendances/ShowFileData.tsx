import React, { useEffect, useState } from 'react';
import DataImportIcon from '../../assets/insert-drive-file-black-24-dp.svg';
import DataImportIconSuccess from '../../assets/insert-drive-file-black-24-dp-success.svg';
import { Box, LinearProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import { NUMBER } from '../../utils/Constants/MagicNumber';

const FileData = (props) => {
    const {file} = props;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
     if(file)
        {
            const reader = new FileReader();
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress((e.loaded / e.total) * NUMBER.HUNDRED);
          }
        };
        reader.onload = () => {
          // handle file contents
        };
        reader.readAsText(file);
        }
    },[file])
    return(
      <>
      {<ProgressBar progress={progress}/>}
      </>
    )
}
export default FileData;

const ProgressBar = (props) => { 
    const { progress } = props; 
    return (
      <>
      <div className='alert-data-msg-overlay'></div>
      {/* <Alert className="toast-success-msg" onClose={() => {}}>New entry created successfully.</Alert>       */}
      {progress == 100 && <><div className='alert-data-msg'>
                <div className='alert-data-msg-wrap'>
                <div className='alert-data-msg-icon'><img src={DataImportIcon} alt='alt' /></div>
                <div className='alert-data-msg-body'>
                    <h4>Data is importing from “Attendance.csv”</h4>
                    <p>Your data is proceeding in the background. Please wait while we get all member's data in the system.</p>                    
                </div>
                <button className='data-close-btn'>X</button>                
            </div>
            <Box className="progressbar-mui" sx={{ width: '100%' }}>
                        <LinearProgress variant="determinate" value={progress} />
            </Box>
            </div></>}
            {progress === 100 && <div className='alert-data-msg alert-data-msg-success'><div className='alert-data-msg-wrap'>
                <div className='alert-data-msg-icon'><img src={DataImportIconSuccess} alt='alt' /></div>
                <div className='alert-data-msg-body'>
                    <h4>Your data has been Imported successfully</h4>
                    <p>Please proceed to map data fields</p>
                </div>
            </div></div>}
            </>
    );
  };