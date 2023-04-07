import { Grid } from '@mui/material';
import HowWorkImage01 from '../../assets/how-work-img-01.svg';
import HowWorkImage02 from '../../assets/how-work-img-02.svg';
import HowWorkImage03 from '../../assets/how-work-img-03.svg';

const ImportDataHelperText = () => {
    return(
        <>
         <div className='upload-file-head how-does-work-head'>
                <h4>HOW IT WORKS</h4>
                <p>Please refer to the steps below</p>
            </div>

            <Grid className='how-work-sec' container spacing={4}>
                <Grid item md={4} sm={4} xs={12}>
                    <figure>
                        <div className='how-work-img'>
                            <img src={HowWorkImage01} alt='How does it works' />
                        </div>
                        <h5>Upload .xls or csv file </h5>
                        <p>Feel free to use any file with a single header. The next step will be to match the header. Currently we only support data with a checkin and check out time. We provided a sample file just incase you need it. </p>
                    </figure>
                </Grid>
                <Grid item md={4} sm={4} xs={12}>
                    <figure>
                        <div className='how-work-img'>
                            <img src={HowWorkImage02} alt='How does it works' />
                        </div>
                        <h5>Match columns with fields</h5>
                        <p>Once uploaded match all relevant columns. Protiv will recognize the column names and order next time you upload and auto match. </p>
                    </figure>
                </Grid>
                <Grid item md={4} sm={4} xs={12}>
                    <figure>
                        <div className='how-work-img'>
                            <img src={HowWorkImage03} alt='How does it works' />
                        </div>
                        <h5>Match names with file</h5>
                        <p>Match user, job, and ProPay names not found. Protiv will change the names so next time it automatically matches with the file. Once finished all time will show up in time page and fully mapped.</p>
                    </figure>
                </Grid>
            </Grid>
        </>
    )
}
export default ImportDataHelperText;
