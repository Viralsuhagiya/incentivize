import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useGetList } from 'react-admin';
import Select from 'react-select';
import ScrollToTop from '../../components/ScrollToTop';
import { RemoveDuplicateObject } from '../../utils/Constants/ConstantData';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import MatchedTickIcon from '../../assets/matched.svg'
import Loader from '../../layout/Loader';
import _ from 'lodash';

/*attendance import step one job mapping flow*/
const AttendanceImportJobMapper = (props) => {
    const {stepTwo,handleChange, stepOne, setStepTwo, readFileData} = props;
    const currentSort = { field: 'create_date', order: 'DESC' };
    ScrollToTop();
    const [jobNames, setJobNames] = React.useState<any | null>(null);
    const [displayedItems, setDisplayedItems] = React.useState(null);

    const systemJobs = useGetList(
        'jobs',
        { pagination: { page: NUMBER.ONE, perPage: NUMBER.ONE_THOUSAND }, sort: currentSort}   
    );

    const handleLoadMore = () => {
        setDisplayedItems(prevDisplayedItems => [
          ...prevDisplayedItems,
          ...jobNames?.slice(
            prevDisplayedItems.length,
            prevDisplayedItems.length + NUMBER.TWENTY
          )
        ]);
      };
    
      const options = systemJobs?.data?.map(item => ({
        value: item.id,
        label: item.full_name,
        revenue: item.revenue,
        id: item.id
      }));
    
      const jobNameKey = Object.keys(stepOne).find(key => stepOne[key]?.label === 'Job');
      React.useEffect(() => {
          if(jobNameKey){
              const jobData = readFileData?.map((row: any) => {
                  const jobName = row[jobNameKey];
                  const jobId = row[jobNameKey];
                  return {
                    jonName: jobName,
                    job_id: jobId
                  };
                });
                setJobNames(RemoveDuplicateObject(jobData));
                  };
      }, [jobNameKey, readFileData]);
      React.useEffect(() => {
          if(jobNames && options && _.isEmpty(stepTwo)){
              const newObj = jobNames?.map(obj => {
                  return { [obj.jonName]: (options.filter(object => object.label.toLocaleLowerCase() === obj.jonName.toLocaleLowerCase())[NUMBER.ZERO] ? 
                    options.filter(object => object.label.toLocaleLowerCase() === obj.jonName.toLocaleLowerCase())[NUMBER.ZERO] : 'Create') };
                  });
                  const result = Object.assign({}, ...newObj);
                  setStepTwo(result);
                  setDisplayedItems(jobNames?.slice(NUMBER.ZERO, NUMBER.TWENTY))
          }else if(jobNames  && !_.isEmpty(stepTwo)){
            setDisplayedItems(jobNames?.slice(NUMBER.ZERO, NUMBER.TWENTY))
          }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [jobNames, systemJobs?.data, stepTwo]);  
      const isLoading = () => {
        if(!jobNames || !displayedItems || systemJobs.isLoading)
        {
          return true;
        }else{
          return false;
        }
      };
      return(
        <>
        <div className='mapping-field-msg'>
                <Typography>Please map unrecognized jobs to jobs in Protiv. All new jobs will automatically be added into the system.</Typography>
        </div>
        {isLoading() ? <Loader/>
        :<div className='mapping-table mapping-table-step-two'>
                <table className='table'>
                    <thead>
                    <tr>
                        <th>CSV Job Name</th>
                        <th>Protiv Job Name</th>
                        <th>&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                        {displayedItems && displayedItems.map((jobs) => {
                        return(
                        <tr>
                            <td>{jobs?.jonName}</td>                                        
                            <td>
                                <Select
                                    className='basic-single'
                                    defaultValue={stepTwo[jobs?.jonName]}
                                    placeholder='Select'
                                    onChange={(value) => handleChange(value, jobs?.jonName)}
                                    isClearable={true}
                                    isSearchable={true}
                                    required={true}
                                    name='color'                                                    
                                    options={options}
                                />

                            </td>
                            {stepTwo[jobs?.jonName] !== 'Create' && stepTwo[jobs?.jonName] !== null &&  <td><img src={MatchedTickIcon} alt='' /></td>}
                        </tr>)}
                        )}
                    </tbody>
                </table>
        </div>}
        {displayedItems?.length !== NUMBER.ZERO && displayedItems?.length < jobNames?.length && 
        <button className='load-more-import-data' onClick={handleLoadMore}>Load More</button>}
        </>
    )
};
export default AttendanceImportJobMapper;
