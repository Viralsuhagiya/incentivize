import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useGetList, useNotify } from 'react-admin';
import Select from 'react-select';
import ScrollToTop from '../../components/ScrollToTop';
import Loader from '../../layout/Loader';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { post } from '../onboard/PaymentProvider';

/*attendance import step one propay mapping flow*/
const AttendanceImportPropayMapper = (props) => {
    const {stepFour,handleChange,setStepFour, importId} = props;
    ScrollToTop();
    const notify = useNotify();
    const [filePropayData, setFilePropayData] = React.useState<any>(null)
    const [page, setPage] = React.useState(NUMBER.ZERO);
    const currentSort = { field: 'create_date', order: 'DESC' };
    const systemPropays = useGetList(
        'propays',
        { pagination: { page: NUMBER.ONE, perPage: NUMBER.ONE_THOUSAND }, sort: currentSort}   
    );

    const fetchProcessedData = async (params) => {
      const data = {
        jsonrpc: '2.0',
        params: params,
    };
      const res = await post(
        '/api/attendance-data',
        data
      ) as any;
      if (res && res.error) {
        return Promise.reject(res);
      } else {
        return Promise.resolve(res);
    }
  }
    const handleLoadRecord = async (pageNum: number) => {
      setPage(pageNum)
      let data = {import_id: importId, page:pageNum, limit:NUMBER.TWENTY};
      const res = await fetchProcessedData(data)
      if(res?.data){
        const arr = Object.keys(res.data).map(key => ({...res.data[key]}));
        setFilePropayData(res)
        setStepFour(arr);
      }else{
        notify(res.error)
      }
    }

    React.useEffect(() => {
      handleLoadRecord(NUMBER.ONE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const options = systemPropays?.data?.map(item => ({
        value: item.name,
        label: item.name,
        id: item.id,
        jobId: item.job_id
    }));
/*is loading commented for now */
    // const isLoading = () => {
    //   if(!stepFour?.length || systemPropays.isLoading )
    //   {
    //     return true;
    //   }else{
    //     return false;
    //   }
    // }
    const handleLoadMoreRecord = async (pageNum: number) => {
      setPage(pageNum)
      let data = {import_id: importId, page:pageNum, limit:NUMBER.TWENTY};
      const res = await fetchProcessedData(data)
      if(res?.data){
        const arr = Object.keys(res.data).map(key => ({...res.data[key]}));
        setStepFour(stepFour.concat(arr));
      }else{
        notify(res.error)
      }
    }

      return(
        <>
        <div className='mapping-field-msg'>
        <Typography>Please map all entries with jobs that have 2 or more ProPays linked.</Typography>
        </div>
       {systemPropays?.isLoading ? <Loader/> : <div className='mapping-table mapping-table-step-four'>
                            <table className='table'>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Job</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Propay</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {stepFour.length ? stepFour.map((user, index) => { 
                                      const filteredData = options.filter(item => item.jobId === user?.job_name?.id);                                       
                                      const defaultVal = stepFour[index] && stepFour[index]['propay_name'] ? stepFour[index]['propay_name'] : null;
                                      return(
                                    <tr>                                        
                                        <td>
                                        {user?.employee_name?.label}
                                        </td>
                                        <td>
                                        {user?.job_name?.label}
                                        </td>
                                        <td>
                                        {user?.start}
                                        </td>
                                        <td>
                                        {user?.end}
                                        </td>
                                        <td>
                                        <Select
                                                className='basic-single'
                                                value={defaultVal}
                                                placeholder='Select'
                                                onChange={(value) => handleChange(value, 'propay_name', index)}
                                                isClearable={true}
                                                isSearchable={true}
                                                required={true}
                                                name='color'                                                    
                                                options={filteredData}
                                        />
                                        </td>                                        
                                    </tr>)}): ''}

                                </tbody>
                            </table>
        </div>}
        {stepFour?.length !== NUMBER.ZERO && filePropayData?.total_count > stepFour?.length && <button className='load-more-import-data' onClick={()=>handleLoadMoreRecord(page+NUMBER.ONE)}>Load More</button>}
        </>
    );
};
export default AttendanceImportPropayMapper;
