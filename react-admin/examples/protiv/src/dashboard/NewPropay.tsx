import CloseIcon from '@mui/icons-material/Close';

import {
    Stack,
    Typography,
    Card,
    Box,
    IconButton,
    Hidden,
} from '@mui/material';
import { useState } from 'react';
import {
    useTranslate,
    ResourceContextProvider,
} from 'react-admin';
import { RESOURCES } from '../constants';
import { HasPermission } from '../resources/payrolls/Payrolls';
import { PropayCreate } from '../resources/propays/Propay';
import { NUMBER } from '../utils/Constants/MagicNumber';
import { CardLoader, DashboardGridItem } from './Dashboard';

const newPropayText = 'resources.propays.new_propay';

const PropayForm = (props: any) => {
    const translate = useTranslate();
    return (
        <ResourceContextProvider value={RESOURCES.PROPAYS}>
            <PropayCreate
                redirect="/"
                title={translate(newPropayText)}
                {...props}
            />
        </ResourceContextProvider>
    );
};

const NewPropayCard = (props: any) => {

    const translate = useTranslate();

    const [focused, setFocused] = useState(false);
    const gotFocus = () => {
        setFocused(true);
    };
    const lostFocus = () => {
        setFocused(false);
    };

    const containerStyle = focused === false ? styles.smContainer : styles.smContainerFocused;
    return (
        <>
            <HasPermission resource={'propays'} action="add" loader={<CardLoader/>}>
                <DashboardGridItem md={focused ? NUMBER.TWELVE : NUMBER.SIX} lg={focused ? NUMBER.TWELVE : NUMBER.FOUR}>
                    <Hidden smUp>
                        <Box sx={containerStyle}>
                            <Card sx={{
                                display: 'flex', 
                                alignItems: 'center', 
                                p: 3, 
                                ...(!focused && styles.smCard), 
                                ...(focused && {
                                    borderRadius:0,
                                    padding:{
                                        xs:2
                                    },
                                })
                            }}>
                                <Stack direction="column" alignItems="center" justifyContent="center" width={'100%'} sx={{ border:0}} >
                                    <Stack sx={{ flexGrow: 1, flexDirection:'row', width:'100%', alignItems:'center', justifyContent: focused ? 'space-between' : 'center' }}>
                                        <Typography fontSize={{ lg: 18, md: 16, sm: 16,xs: 16 }} fontWeight='bold' sx={{alignSelf:'center', border:0}}>
                                                {translate(newPropayText)}
                                            </Typography>
                                            {focused && (
                                            <IconButton
                                                color="primary"
                                                aria-label="upload picture"
                                                onClick={lostFocus}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        )} 
                                    </Stack>
                                    
                                <PropayForm
                                    isFromDashboard={true}
                                    isExpand={focused}
                                    gotFocus={gotFocus}
                                    lostFocus={lostFocus}
                                />
                                </Stack>
                            </Card>
                        </Box>
                    </Hidden>
                    <Hidden smDown>
                    <Card sx={{ display: 'flex',  justifyContent:'flex-start', p: 3,flexDirection:'column' }}>
                        <Stack sx={{ flexGrow: 1, flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                            <Typography variant="subtitle2">
                                {translate(newPropayText)}
                                
                            </Typography>
                            {focused && (
                                    <IconButton
                                        color="primary"
                                        aria-label="upload picture"
                                        onClick={lostFocus}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                )}
                        </Stack>
                        <PropayForm
                            isFromDashboard={true}
                            isExpand={focused}
                            gotFocus={gotFocus}
                            lostFocus={lostFocus}
                        />
                    </Card>
                    </Hidden>
                </DashboardGridItem>
            </HasPermission>
            {!focused && props.children}
        </>
    );
};

const styles = {
    smContainer: {
        display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', 
        marginTop:{
            xs:3,
            sm:'unset'
        }
    },
    smContainerFocused: {
        marginTop:{
            xs:0,
            sm:'unset'
        }
    },
    smCard:{
        width:'80%', borderRadius:50,
    }
}

export default NewPropayCard;
