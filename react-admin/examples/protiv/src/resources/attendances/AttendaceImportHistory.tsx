import moment from 'moment';
import { ListActions, ResourceContextProvider, useListContext } from "react-admin";
import { useNavigate } from 'react-router';
import Empty from '../../layout/Empty';
import { List } from '../../layout/List';
import { NUMBER } from "../../utils/Constants/MagicNumber";

/*attendance import history section ui only*/
const AttendanceImportHistory = () => {
    return(
        <>
          <div className='import-data-row'>
                            <div className='upload-file-head'>
                                    <h4>Import History</h4>
                                    <p>Please refer to the import history below. We maintain this history for the entirety of the account for your reference. Any changes must be completed manually through the time page. </p>
                                </div>

                                <div>
                                    <div className="import-data-table">
                                        <ResourceContextProvider value='protivAttendanceImports'>
                                        <List
                                            filterDefaultValues={{status:{_in:["success","processing"]}}}
                                            title=' '
                                            actions={<ListActions exporter={false}/>}
                                            sort={{ field: 'create_date', order: 'DESC' }}
                                            emptyWhileLoading
                                        >                
                                            <HistoryTable />                
                                        </List>
                                        </ResourceContextProvider>
                                    </div>
                                </div>
                            </div>
        </>
    );
};
export default AttendanceImportHistory;

const HistoryTable = () => {
    const { data, total } = useListContext();
    const navigate = useNavigate();
    return(
        <>
        <table className='table'>
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Type</th>
                    <th>File Name</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
             {total ? data.map((historyData) => {
                const outputFile = convertBase64ToFile(historyData.original_data,historyData.filename);
            return(
                <tr>
                    <td>{historyData.status === 'success' ? 'Completed' : 'In-Progress'}</td>
                    <td>Attendance</td>
                    <td>{outputFile && <span className='file-link'><FileDownload fileObject={outputFile} fileName={historyData.filename}/></span>}</td>
                    <td>{historyData?.create_uid_obj?.name}</td>
                    <td>{moment(historyData.write_date).format('MMM DD, YYYY')}</td>
                    <td onClick={() => navigate(`/attendances/import/${historyData.id}/done`)}><span className='file-link revert-link'>View Detail</span></td>
                </tr>                                                
            )}) 
            : 
            <tr>
            <td colSpan={6}><Empty /></td>
            </tr>
             } 
            </tbody>
            </table>
        </>
    );
}

const convertBase64ToFile = (base64String, fileName) => {
        var arr = base64String.split(',');
        if(arr.length > NUMBER.ONE){        
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: mime });
    }else{
        return '';
    }
    };
    
const FileDownload = ({ fileObject, fileName }) => {
    const downloadUrl = URL.createObjectURL(fileObject);
    return (
        <div className='download-file-link'>
        <a className='download-file-link' href={downloadUrl} download={fileName}>
        {fileName}
        </a>
        </div>
    );
};

      
      
      