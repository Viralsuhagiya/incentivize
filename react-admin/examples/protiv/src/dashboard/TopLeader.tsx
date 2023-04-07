import { Typography, Box, MenuItem, FormControl, Grid } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import moment from 'moment';
import { useState } from 'react';
import { useGetList } from 'react-admin';
import { useQueryClient } from 'react-query';
import { getLastMonthDate, getLastWeeksDate } from '../utils/Constants/ConstantData';
import { NUMBER } from '../utils/Constants/MagicNumber';
import { useNavigate } from 'react-router-dom';
import MyAvatar from '../components/MyAvatar';
import TopLeaderIcon from '../assets/leader-top-icon.svg';
import { StyledTypography } from '../resources/payrolls/Payrolls';
import { InfoLabel } from '../components/fields/InfoLabel';

const TopLeaders = (props: any) => {

  const week = moment(getLastWeeksDate()).format('YYYY-MM-DD');
  const month = moment(getLastMonthDate()).format('YYYY-MM-DD');
  const navigate = useNavigate();
  const [date, setDate] = useState(week);
  const queryClient = useQueryClient();

  const handleChange = (event: SelectChangeEvent) => {
    setDate(event.target.value);
    queryClient.invalidateQueries(['attendances', 'getList']);

  };

  return (
    <div className='top-leader-sec'>
      <Box className='dashboard-card-top-head'>
        <div className='dashboard-card-left-head'>
          <Typography variant='h3'>Top Leaders
            <InfoLabel height={18} icon='ri:error-warning-fill'>
              <StyledTypography>Hours saved on ProPays compared to the max budget. Saved hours are split based on the proportionate hours worked on each ProPay</StyledTypography>
            </InfoLabel>
          </Typography>
          <Typography variant='subtitle2' gutterBottom>Saved hours on ProPay</Typography>
        </div>
        <div className='dashboard-card-right-head'>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <Select
                labelId='demo-simple-select-helper-label'
                id='demo-simple-select-helper'
                value={date}
                onChange={handleChange}
              >
                <MenuItem value={week} selected>Last Week</MenuItem>
                <MenuItem value={month}>Last Month</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </Box>

      <Grid className='top-leader-row' container spacing={3}>
        <Grid item lg={6} md={6} sm={12} xs={12} className='leader-sec-col'>
          <ul className='top-leader-ul'>
            <li>
              <div className='leader-avtaar'>
                <MyAvatar />
                <div className='leader-no-badge'><span>2</span></div>
              </div>
              <div className='top-leader-title'>Tim David</div>
              <div className='top-leader-hour'><strong>20.16</strong> hrs</div>
            </li>
            <li className='leader-active'>
              <div className='leader-main-title'>Workers
                <img src={TopLeaderIcon} alt='Icon' className='top-leader-icon' />
              </div>
              <div className='leader-avtaar'>
                <MyAvatar />
                <div className='leader-no-badge'><span>1</span></div>
              </div>
              <div className='top-leader-title'>Steve Smith</div>
              <div className='top-leader-hour'><strong>28.33</strong> hrs</div>
            </li>
            <li>
              <div className='leader-avtaar'>
                <MyAvatar />
                <div className='leader-no-badge'><span>3</span></div>
              </div>
              <div className='top-leader-title'>Alex Carey</div>
              <div className='top-leader-hour'><strong>18.42</strong> hrs</div>
            </li>
          </ul>

          <ul className='top-leader-listing'>
            <li>
              <MyAvatar />
              <div className='leader-listing-body'>
                <div className='leader-listing-title'>Jonny Bairstow</div>
                <div className='leader-ranking'>Rank 4</div>
              </div>
              <div className='leader-list-hours'><strong>10.56</strong> hrs</div>
            </li>
            <li>
              <MyAvatar />
              <div className='leader-listing-body'>
                <div className='leader-listing-title'>Joe Root</div>
                <div className='leader-ranking'>Rank 5</div>
              </div>
              <div className='leader-list-hours'><strong>6.53</strong> hrs</div>
            </li>
          </ul>

        </Grid>

        <Grid item lg={6} md={6} sm={12} xs={12} className='leader-sec-col'>
          <ul className='top-leader-ul'>
            <li>
              <div className='leader-avtaar'>
                <MyAvatar />
                <div className='leader-no-badge'><span>2</span></div>
              </div>
              <div className='top-leader-title'>Harry Kane</div>
              <div className='top-leader-hour'><strong>38.45</strong> hrs</div>
            </li>
            <li className='leader-active'>
              <div className='leader-main-title'>Manager
                <img src={TopLeaderIcon} alt='Icon' className='top-leader-icon' />
              </div>
              <div className='leader-avtaar'>
                <MyAvatar />
                <div className='leader-no-badge'><span>1</span></div>
              </div>
              <div className='top-leader-title'>Mason Mount</div>
              <div className='top-leader-hour'><strong>40.30</strong> hrs</div>
            </li>
            <li>
              <div className='leader-avtaar'>
                <MyAvatar />
                <div className='leader-no-badge'><span>3</span></div>
              </div>
              <div className='top-leader-title'>Phil Foden</div>
              <div className='top-leader-hour'><strong>36.00</strong> hrs</div>
            </li>
          </ul>

          <ul className='top-leader-listing'>
            <li>
              <MyAvatar />
              <div className='leader-listing-body'>
                <div className='leader-listing-title'>Jude Bellingham</div>
                <div className='leader-ranking'>Rank 4</div>
              </div>
              <div className='leader-list-hours'><strong>28.30</strong> hrs</div>
            </li>
            <li>
              <MyAvatar />
              <div className='leader-listing-body'>
                <div className='leader-listing-title'>Jordan Pickford</div>
                <div className='leader-ranking'>Rank 5</div>
              </div>
              <div className='leader-list-hours'><strong>26.00</strong> hrs</div>
            </li>
          </ul>

        </Grid>

      </Grid>


    </div>
  );
};
export default TopLeaders;
