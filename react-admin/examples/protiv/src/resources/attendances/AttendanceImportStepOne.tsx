
import Typography from '@mui/material/Typography';
import * as React from 'react';
import Select from 'react-select';
import ScrollToTop from '../../components/ScrollToTop';
import { NUMBER } from '../../utils/Constants/MagicNumber';



/*attendance import step one column mapping flow*/
const AttendanceImportColumnMapper = (props) => {
    const {handleChange, csvHeader, stepOne, columnMapper, selectedColumn} = props;
      const [displayedItems, setDisplayedItems] = React.useState(csvHeader?.slice(NUMBER.ZERO, NUMBER.TWENTY));
      ScrollToTop();

      const handleLoadMore = () => {
        setDisplayedItems(prevDisplayedItems => [
          ...prevDisplayedItems,
          ...csvHeader?.slice(
            prevDisplayedItems.length,
            prevDisplayedItems.length + NUMBER.TWENTY
          )
        ]);
      };

      React.useEffect(() => {
        setDisplayedItems(csvHeader?.slice(NUMBER.ZERO, NUMBER.TWENTY))
      }, [csvHeader])

      const options = columnMapper?.filter((option: any) => {
        const selectedLabels = Object.values(stepOne).map((item: {value: string,label: string}) => item?.label);
        if(selectedLabels.includes('Employee Name') || selectedColumn?.name.length < NUMBER.TWO){
          selectedLabels.push('First Name');
          selectedLabels.push('Last Name');
        }else if(selectedLabels.includes('First Name') || selectedLabels.includes('Last Name') || selectedColumn?.name.length >= NUMBER.TWO){
          selectedLabels.push('Employee Name');
        }
        if (!selectedLabels.includes(option.label)) {
          return true;
        }
        return false;
      });
      return(
        <>
        <div className='mapping-field-msg'>
                <Typography>Map relevant column header names with the correct protiv data fields.</Typography>
            </div>
        <div className='mapping-table'>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Column Name</th>
                        <th>Column #</th>
                        <th>Mapped Field</th>
                    </tr>
                    </thead>
                    <tbody>
                        {displayedItems && displayedItems.length> NUMBER.ZERO && displayedItems.map((columnName, index) => {
                        return(
                        <tr>
                            <td>{columnName}</td>
                            <td>{`${index < NUMBER.NINE ? `0${index+NUMBER.ONE}` : index+NUMBER.ONE}`}</td>
                            <td>
                            <Select
                                className="basic-single"
                                defaultValue={stepOne[columnName]}
                                placeholder='Select'
                                onChange={(e) => handleChange(e,columnName)}
                                isClearable={true}
                                isSearchable={true}
                                name="color"                                                    
                                options={options}
                                />
                            </td>
                        </tr>)
                        })}
                    </tbody>
                </table>
            </div>
            {displayedItems?.length !== csvHeader?.length && <button className='load-more-import-data' onClick={handleLoadMore}>Load More</button>}
        </>
    );
};
export default AttendanceImportColumnMapper;