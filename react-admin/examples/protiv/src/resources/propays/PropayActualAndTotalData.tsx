/* eslint-disable array-callback-return */
import { Typography } from '@mui/material';
import { convertNumber } from '../../components/fields';
import { useIdentityContext } from '../../components/identity';
import { timeLogged } from '../../utils/Constants/ConstantData'
import { useTranslate } from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import { InfoLabel } from '../../components/fields/InfoLabel';

const PropayActualAndTotalData = (props: any) => {
    const {maxHours, record} = props;
    const identity = useIdentityContext();
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        });

    const calculateBasepay = () => {
        let bonusOnlyHours = NUMBER.ZERO;
        record?.wage_ids?.map((workerData) => {
            if(!workerData.is_remove_bonus)
            {
             bonusOnlyHours = bonusOnlyHours + workerData.hours;
            }
        }); 
        return bonusOnlyHours;
    }

    const actualHoursForcalculation = calculateBasepay();
    const PercenatgeChange = (record.performance_bonus/record.attendance_earning)* NUMBER.HUNDRED;
    const PerhourChange = actualHoursForcalculation ? record.performance_bonus/actualHoursForcalculation : NUMBER.ZERO;
    const hoursMargin = Math.abs(maxHours) - record.hours;
    const translate = useTranslate();   

    return(
        <div className="budget-detail-sec">        
        <table className="table">
        <thead>
        <tr>
        <th>&nbsp;</th>
        <th>{translate("resources.propays.fields.propay_hours")}</th>
        <th>{translate("resources.propays.fields.value")}</th>
        </tr>        
        </thead>
        <tbody>
        <tr>
        <td>{translate("resources.propays.fields.budget")}</td>
        <td className="text-black">{maxHours && convertNumber(maxHours,identity)}</td>
        <td className="text-black">{formatter.format(record.budget)}</td>
        </tr>
        <tr>
        <td>{translate("resources.propays.fields.actuals")}</td>
        <td className="text-black">{timeLogged(record.hours)}</td>
        <td className="text-black">{formatter.format(record.attendance_earning)}</td>
        </tr>        
        </tbody>
        <tfoot>
        <tr>
        <td colSpan={2}>
        {translate("resources.propays.fields.total_bonus_payout")}
        </td>
        <td>
        <strong>{record.performance_bonus ? formatter.format(record.performance_bonus) : '$0.00'}</strong>               
        </td>
        </tr>

        {record.overage ? <tr>
        <td colSpan={2}>    
        {record.overage ? <><span>{translate("resources.propays.fields.overage")}</span><InfoLabel className='remove-bonus-tooltip' sx={{ height: 20 }} icon="ri:error-warning-fill" height={20}>
                                <Typography className='bonus-tooltip-cs'>{translate("resources.propays.earning_exceed_info")}</Typography>
                            </InfoLabel> <br /> </> : '' }         
        </td>
        <td>        
        {record.overage ? <strong>{formatter.format(record.overage)}</strong> : ''}       
        </td>
        </tr> : ''}

        <tr>
        <td>        
        {translate(`resources.propays.bonus_choices.bonus_split_type.${record.bonus_split_type}.label`!)}
        <InfoLabel className='remove-bonus-tooltip' sx={{height:20}} icon="ri:error-warning-fill" height={20}>
        <Typography className='bonus-tooltip-cs'>{translate(`resources.propays.bonus_choices.bonus_split_type.${record.bonus_split_type}.info`!)}</Typography> 
        </InfoLabel>                                                                    
        </td>
        <td>    {record.status === 'approved' &&
            <span className={`${hoursMargin > NUMBER.ZERO ? 'text-green': 'red-text'}`}>
                {hoursMargin > NUMBER.ZERO ? `+${convertNumber(hoursMargin,identity)}` : `-${convertNumber(hoursMargin,identity)}`}</span>
        }</td>
        <td>        
        {record.bonus_split_type === 'by_hours' && <span className='text-green'>
            {record.performance_bonus ? formatter.format(PerhourChange): formatter.format(NUMBER.ZERO)}/hr</span>}
        {record.bonus_split_type === 'by_wage' && <span className='text-green'>
            {record.performance_bonus ? parseFloat(PercenatgeChange.toString()).toFixed(NUMBER.TWO): '0'}%</span>}
        </td>
        </tr>
        
        </tfoot>
        </table>
        </div>
    )
}
export default PropayActualAndTotalData;
