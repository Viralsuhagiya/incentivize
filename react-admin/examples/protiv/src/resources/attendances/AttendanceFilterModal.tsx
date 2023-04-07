import { Button, Menu, Badge } from '@mui/material';
import moment from 'moment';
import { useEffect } from 'react';
import { AutocompleteArrayInput, Filter, useListContext } from 'react-admin';
import { DateRangeInputFilter } from '../../components/fields/DateRangeInputFilter';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { StyledReferenceArrayInput } from '../payrolls/Payrolls';
import { useGetIdentityOptimized } from '../../components/identity';
import { useNavigate } from 'react-router';
import { getIntegratedNonIntegrated } from './Attendance';


/*List of filters in modal for web view */
const AttendanceFilterModal = ({ show, handleClose,anchorEl,setFilterCount, ...props }) => {
    const {
      filterValues,
      } = useListContext();

      useEffect(() => {
        if (filterValues?.start && filterValues?.period_id) {
          setFilterCount(NUMBER.TWO);
       }else if (filterValues?.start || filterValues?.period_id) {
        setFilterCount(NUMBER.ONE);
       }else{
         setFilterCount(NUMBER.ZERO);
       };
      }, [filterValues, setFilterCount]);
  return(       
    <>      
      <Menu
          anchorEl={anchorEl}
          id='attendance-filter-menu'
          className='attendance-filter-dropdown'
          open={show}
          onClose={handleClose}
          PaperProps={{
            elevation: 0         
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}        
          >
        <Filter {...props}>
          <StyledReferenceArrayInput
            source='period_id._in'
            reference='periods'
            label='Period'
            sort={{ field: 'start_date', order: 'DESC' }}
            filter={{ start_date: { _lte: moment().format('YYYY-MM-DD') } }}
            alwaysOn
          >
            <AutocompleteArrayInput source='name' />
          </StyledReferenceArrayInput>
          <DateRangeInputFilter source='start' alwaysOn startText={'From'} endText={'To'} />
        </Filter>
        </Menu>  
    </>
  );
  };
  export default AttendanceFilterModal;

  export const FilterModalButton = ({ handleShow,filterCount, ...props }) => {
    const { identity } = useGetIdentityOptimized();
    return(
    <Button className={`${identity?.user_type === 'wroker' || !getIntegratedNonIntegrated(identity) ? 'attendence-filter-btn-reset' : ''} worker-filter-btn attendence-filter-btn`} onClick={handleShow}>Show filters Modal 
    <Badge color='primary' badgeContent={filterCount} max={NUMBER.FIVE}></Badge></Button>  
    );
  };
  export const AddTimeButton = () => {
    const { identity } = useGetIdentityOptimized();
  const navigate = useNavigate();
    return(
    <Button className={`${identity?.user_type === 'wroker' || !getIntegratedNonIntegrated(identity) ? 'attendance-add-time-button-reset' : ''} attendance-add-time-button`} onClick={() => navigate('create')}>Add Time</Button>  
    );
  };
  