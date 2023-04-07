import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useGetList } from 'react-admin';
import Select, { components } from 'react-select';
import ScrollToTop from '../../components/ScrollToTop';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import AddEmployeeIcon from '../../assets/person-add-black-24-dp.svg';
import Loader from '../../layout/Loader';
import AddEmployee from './AddEmployee'
import _ from 'lodash';

const SelectMenuButton = (props) => {
  const { setOpen } = props;
  return (
      <components.MenuList  {...props}>
          <button className='add-employee-btn' onClick={() => setOpen(true)}><img src={AddEmployeeIcon} alt='Icon'  /> Add Employee</button>
          {props.children}
      </components.MenuList >
  ) }

/*attendance import step one employee mapping flow*/
const AttendanceImportEmployeeMapper = (props) => {
    const {stepThree,handleChange, stepOne, setOptions, options, setStepThree, readFileData, selectedColumn} = props;
    const currentSort = { field: 'create_date', order: 'DESC' };
    ScrollToTop();
    const [fileEmployeeData, setFileEmployeeData] = React.useState<any>(null);
    const [displayedItems, setDisplayedItems] = React.useState(null);

    
    const systemEmployees = useGetList(
        'employees',
        { pagination: { page: NUMBER.ONE, perPage: NUMBER.ONE_THOUSAND }, sort: currentSort}   
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const employeeNameKey = selectedColumn['name']?.length > NUMBER.ONE ? Object.keys(stepOne).filter(key => ['First Name', 'Last Name'].includes(stepOne[key]?.label)) :
    (Object.keys(stepOne).filter(key => ['Employee Name'].includes(stepOne[key]?.label)));


    React.useEffect(() => {
        if(employeeNameKey?.length){
          const systememployeeData = readFileData?.map((row: any) => {
            const employeeName = employeeNameKey.length >= NUMBER.TWO ? `${row[employeeNameKey[NUMBER.ZERO]]} ${row[employeeNameKey[NUMBER.ONE]]}` : row[employeeNameKey[NUMBER.ZERO]];
            return {
              name: employeeName,
              employee_id: employeeName
            };
          });
          setFileEmployeeData(systememployeeData);
          setDisplayedItems(systememployeeData?.slice(NUMBER.ZERO, NUMBER.TWENTY))
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeNameKey?.length, readFileData?.length]);
    React.useEffect(() => {
      if(options.length === 0 && systemEmployees?.data){
        let option = systemEmployees?.data?.map(item => ({
          value: item.name,
          label: item.name,
          base_wage: item.base_wage,
          id: item.id
        }));
        setOptions(option);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemEmployees?.data])

    React.useEffect(() => {
        if(fileEmployeeData && options.length && _.isEmpty(stepThree)){
            const newObj = fileEmployeeData?.map(obj => {
                return { [obj.name]: (options.filter(object => object.label.toLocaleLowerCase() === obj.name.toLocaleLowerCase())[NUMBER.ZERO]) };
                });
                const result = Object.assign({}, ...newObj);
                setStepThree(result);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileEmployeeData,options.length, systemEmployees?.data])

    const handleLoadMore = () => {
        setDisplayedItems(prevDisplayedItems => [
          ...prevDisplayedItems,
          ...fileEmployeeData?.slice(
            prevDisplayedItems.length,
            prevDisplayedItems.length + NUMBER.TWENTY
          )
        ]);
      };

      const isLoading = () => {
        if(!fileEmployeeData || !displayedItems || systemEmployees.isLoading )
        {
          return true;
        }else{
          return false;
        }
      };
      const [openviewattendence, setOpen] = React.useState(false);
      return(
        <>
        <div className='mapping-field-msg'>
        <Typography>Please map unrecognized employees with Protiv employees. If no match is found please create new or time entry will not be uploaded.</Typography>
        </div>
        {isLoading() ? <Loader/> : <div className='mapping-table mapping-table-step-three'>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>CSV Employee</th>
                                    <th>Propay Employee</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {displayedItems && displayedItems.map((employee) => {
                                    return(
                                    <tr>
                                        <td>{employee?.name}</td>                                        
                                        <td>
                                            <Select
                                                className="basic-single"
                                                value={stepThree[employee?.name]}
                                                // defaultValue={stepThree[employee?.name]}
                                                placeholder='Select'
                                                components={{ MenuList: (props) => <SelectMenuButton {...props} employeeNameKey={employeeNameKey} options={options} setOpen={setOpen} /> }}                               
                                                onChange={(value) => handleChange(value, employee?.name)}
                                                isClearable={true}
                                                isSearchable={true}
                                                required={true}
                                                name="color"                                                    
                                                options={options}
                                            />

                                        </td>
                                    </tr>)})}
                                </tbody>
                            </table>
        </div> }
        <AddEmployee openviewattendence={openviewattendence} setOpen={setOpen} setOptions={setOptions} systemEmployees={systemEmployees} />
        {displayedItems?.length !== NUMBER.ZERO && displayedItems?.length < fileEmployeeData?.length && fileEmployeeData !== null && 
        <button className='load-more-import-data' onClick={handleLoadMore}>Load More</button>}
        </>
    )
}
export default AttendanceImportEmployeeMapper;
