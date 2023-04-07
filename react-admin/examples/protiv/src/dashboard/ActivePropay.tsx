import get from 'lodash/get';

// material
import {
    Box,
    Card,
    Stack,
    Typography,
    Hidden
} from '@mui/material';
import { useRecordContext, useTranslate } from 'react-admin';

// local
import { RESOURCES, PROPAY_STATUS } from '../constants';
import { GroupedRecrod, ListGroup, DashboardGridItem } from './Dashboard';
import { fNumber } from '../utils/formatter';
// ------------------------------------------------------------------------------------------------------------

const ActivePropayCardView = (props: any) => {
    const record = useRecordContext(props);
    const group_by_count = get(record, 'group_by_count');

    const translate = useTranslate();

    return (
        <DashboardGridItem>
             <Hidden smUp>
                <Box sx={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <Card sx={{ width:'80%', borderRadius:50, display: 'flex', alignItems: 'center', p: 3 }}>
                        <Stack direction="column" alignItems='center' justifyContent='center' width={'100%'} sx={{ border:0}} >
                            <Typography fontSize={{ lg: 18, md: 16, sm: 16,xs: 16 }} fontWeight='bold' sx={{alignSelf:'center', border:0}}>
                                {translate('resources.propays.active_propay')}
                            </Typography>
                            <Typography variant="h1" color="primary" sx={{padding:1}}>
                                {fNumber(group_by_count)}
                            </Typography>
                        </Stack>
                    </Card>
                </Box>
            </Hidden>
            <Hidden smDown>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">
                        {translate('resources.propays.active_propay')}
                    </Typography>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mt: 2, mb: 1,minHeight: 24, }}
                    >
                        {/* <IconWrapperStyle
                        sx={{
                            ...(PERCENT < 0 && {
                                color: 'error.main',
                                bgcolor: alpha(theme.palette.error.main, NUMBER.ZERO_POINT_ONE_SIX),
                            }),
                        }}
                    >
                        <Icon
                            width={16}
                            height={16}
                            icon={
                                PERCENT >= 0 ? trendingUpFill : trendingDownFill
                            }
                            fr=""
                        />
                    </IconWrapperStyle>
                    <Typography component="span" variant="subtitle2">
                        {PERCENT > 0 && '+'}
                        {fPercent(PERCENT)}
                    </Typography> */}
                    </Stack>

                    <Typography variant="h3">
                        {fNumber(group_by_count)}
                    </Typography>
                </Box>

                {/* <ReactApexChart
                type="bar"
                series={CHART_DATA}
                options={chartOptions}
                width={60}
                height={36}
            /> */}
            </Card>
            </Hidden>
        </DashboardGridItem>
    );
};

const ActivePropayCard = (props: any) => {
    return (
        <ListGroup
            resource={RESOURCES.PROPAYS}
            fields={['status']}
            filter={{
                status: {
                    _in: [PROPAY_STATUS.PENDING, PROPAY_STATUS.APPROVED],
                },
            }}
        >
            <GroupedRecrod>
                <ActivePropayCardView />
            </GroupedRecrod>
        </ListGroup>
    );
};

export default ActivePropayCard;
