import trendingDownFill from '@iconify/icons-eva/trending-down-fill';
import trendingUpFill from '@iconify/icons-eva/trending-up-fill';
import { Icon } from '@iconify/react';
// material
import {
    alpha,
    Box,
    Card,
    Stack,
    styled,
    Typography,
    useTheme,
    Tooltip,
    Hidden
} from '@mui/material';
import { ApexOptions } from 'apexcharts';
import { useListContext, useTranslate, ListBase } from 'react-admin';
import ReactApexChart from 'react-apexcharts';
import { RESOURCES, PERIOD_STATUS } from '../constants';
import { fCurrency } from '../utils/formatter';
import { CardLoader, DashboardGridItem, ListGroup } from './Dashboard';
import moment from 'moment';
import _ from 'lodash';
import get from 'lodash/get';
import { NUMBER } from '../utils/Constants/MagicNumber';

// ------------------------------------------------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
    width: 24,
    height: 24,
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.success.main,
    backgroundColor: alpha(theme.palette.success.main, NUMBER.ZERO_POINT_ONE_SIX),
}));

// ------------------------------------------------------------------------------------------------------------
export const getPercentageChange = (oldNumber: number, newNumber: number) => {
    const decreaseValue = newNumber - oldNumber;
    return oldNumber !== 0 ? (decreaseValue / oldNumber) : (newNumber!==0 ? 1 : 0);
};

export const getFormatedPercent = (percent: number, format:string = '0.00%') => {
    return fCurrency(percent , format);
};

export const getFormatedPercentChange = (oldNumber: number, newNumber: number, format:string = '0.00%') => {
    return getFormatedPercent(getPercentageChange(oldNumber,newNumber), format);
};

const ActivePayrollCardView = (props: any) => {
    const translate = useTranslate();
    const { data:payrolls } = useListContext(props);
    if(!payrolls){
        return null;
    }
    const current:any = _.get(_.first(payrolls), 'period_status')==='closed' ? undefined :_.first(payrolls);
    const previous_periods = current?_.slice(payrolls, 1): [...payrolls];
    const last = _.first(previous_periods);
    const change_per = getPercentageChange(get(last,'net_earning',0), get(current,'net_earning',0))
    const chartData = _.reverse(previous_periods).map((item)=>( { value:item.net_earning, title:item.period_id_obj.name }))
    return (
        <DasbhoardCard 
            title={'resources.payrolls.active_payroll'}
            value={get(current,'net_earning',0)}
            value_name={get(current,'period_id_obj.name','No Data')}
            change_per={change_per}
            chartData={{
                title:translate('resources.payrolls.fields.gross_earning'),
                categories:chartData
            }}
        />
    );
};

const PercentChange = (props: any) => {
    const { change_per } = props;
    const theme = useTheme();

    return (
        <Stack
            direction='row'
            alignItems='center'
            spacing={1}
            sx={{ mt: 2, mb: 1 }}
        >
            <Hidden smDown>
                <IconWrapperStyle
                    sx={{
                        ...(change_per < 0 && {
                            color: 'error.main',
                            bgcolor: alpha(theme.palette.error.main, NUMBER.ZERO_POINT_ONE_SIX),
                        }),
                    }}
                >
                    <Icon
                        width={16}
                        height={16}
                        icon={change_per >= 0 ? trendingUpFill : trendingDownFill}
                        fr=''
                    />
                </IconWrapperStyle>
                <Typography component='span' variant='subtitle2'>
                    {change_per > 0 && '+'}
                    {getFormatedPercent(change_per)}
                </Typography>
            </Hidden>
            <Hidden smUp>
                <Typography component='span' variant='subtitle2'>
                    {change_per > 0 && '+'}
                    {getFormatedPercent(change_per)}
                </Typography>
                <IconWrapperStyle
                    sx={{
                        ...(change_per < 0 && {
                            color: 'error.main',
                            bgcolor: alpha(theme.palette.error.main, NUMBER.ZERO_POINT_ONE_SIX),
                        }),
                    }}
                >
                    <Icon
                        width={16}
                        height={16}
                        icon={change_per >= 0 ? trendingUpFill : trendingDownFill}
                        fr=''
                    />
                </IconWrapperStyle>

            </Hidden>

        </Stack>
    );
};

const DashboardCardBarChart = ({title:chartTitle, categories}) => {
    const theme = useTheme();
    const translate = useTranslate();

    const series = [
        {
            name: chartTitle,
            data: categories.map(item => item.value),
        }
    ];

    const chartOptions: ApexOptions = {
        colors: [theme.palette.primary.main],
        chart: { sparkline: { enabled: true } },
        plotOptions: { bar: { columnWidth: '68%', borderRadius: 2 } },
        xaxis: {
            categories: categories.map(value => value.title),
        },
        tooltip: {
            x: { show: true },
            y: {
                formatter: (seriesName: number | string) => fCurrency(seriesName),
                title: { formatter: () => translate('resources.payrolls.fields.gross_earning') + ':'}
            },
            marker: { show: true },
        },
    };

    return (
        <ReactApexChart
            type='bar'
            series={series}
            options={chartOptions}
            width={60}
            height={36}
        />
    );
};

const DasbhoardCard = ({title, value, value_name, change_per, chartData }) => {
    const translate = useTranslate();

    return (
        <DashboardGridItem >
            <Hidden smUp>
                <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <Card sx={{ width:'80%', borderRadius:50, display: 'flex', alignItems: 'center', p: 3 }}>
                        <Stack direction='column' alignItems='center' justifyContent='center' width={'100%'} sx={{ border:0}} >
                            <Typography fontSize={{ lg: 18, md: 16, sm: 16,xs: 16 }} fontWeight='bold' sx={{alignSelf:'center', border:0}}>
                                {translate(title)}
                            </Typography>
                            <Stack direction='row' alignItems='flex-start' alignSelf='flex-start'  sx={{border:0}}>
                                <PercentChange change_per={change_per} />
                                <Tooltip title={value_name}>
                                    <Typography variant='h1' color='primary' sx={{padding:1}}>
                                        {fCurrency(value)}
                                    </Typography>
                                </Tooltip>    
                            </Stack>
                        </Stack>
                    </Card>
                </Box>
            </Hidden>

            <Hidden smDown>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <Box sx={{ flexGrow: 1}}>
                        <Typography variant='subtitle2'>
                            {translate(title)}
                        </Typography>
                        <PercentChange change_per={change_per} />
                        <Tooltip title={value_name}>
                            <Typography variant='h3'>
                                {fCurrency(value)}
                            </Typography>
                        </Tooltip>
                    </Box>
                    <DashboardCardBarChart {...chartData} />
                </Card>

            </Hidden>
        </DashboardGridItem>
    );
};

const ActivePayrolls = (props: any) => {
    const { data, isLoading } = useListContext(props);
    if (isLoading) 
    {
        return <CardLoader/>;
    }
    if (!data) 
    {
        return null;
    }
    let filters = {};
    let sort = { field: 'start_date', order: 'ASC' };
    let perPage = 1;
    if (data && data.length > 0) {
        filters = {
            start_date: {
                _lte: moment(data[0].end_date)
                    .add(1, 'day')
                    .format('YYYY-MM-DD'),
            },
        };
        sort = { field: 'end_date', order: 'DESC' };
        perPage = NUMBER.ELEVENT;
    }
    return (
        <ListGroup
            resource={RESOURCES.PAYROLLS}
            groupBy={[
                'period_id',
                'end_date:day',
                'start_date:day',
                'period_status',
            ]}
            lazy={false}
            fields={[
                'period_id',
                'net_earning',
                'end_date',
                'start_date',
                'period_status',
            ]}
            sort={sort}
            perPage={perPage}
            filter={filters}
            disableSyncWithLocation={true}
        >
            <ActivePayrollCardView />
        </ListGroup>
    );
};

const ActivePayrollCard = () => {
    return (
        <ListBase
            resource={RESOURCES.PERIODS}
            perPage={1}
            filter={{ status: { _eq: PERIOD_STATUS.CLOSED } }}
            sort={{ field: 'end_date', order: 'DESC' }}
        >
            <ActivePayrolls />
        </ListBase>
    );
};

export default ActivePayrollCard;
