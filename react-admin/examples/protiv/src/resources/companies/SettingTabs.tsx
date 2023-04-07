import { Icon } from '@iconify/react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { useRedirect} from 'react-admin';
import { CompanySetting } from './CompanySetting';
import { TSheetSetting } from './TSheetSetting';
import { DataverseSetting } from './DataverseSetting';
import { ZapierSetting } from './ZapierSetting';
import { SalesForceSetting } from './SalesForceSetting';
import { useLocation } from 'react-router-dom';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

import { useIdentityContext, usePermissionsOptimized } from '../../components/identity';
import { VericlockSetting } from './VericlockSetting';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { zapierIcon } from '../../assets';
import { canAccess } from '../../ra-rbac';

const StyledTabPanel = styled(TabPanel)({
    marginTop: 16,
});

const ROUTES ={
    '/setting' : 'general',
    '/setting/tsheet' : 'tsheet',
    '/setting/zapier' : 'zapier',
    '/setting/dataverse' : 'dataverse',
    '/setting/salesforce' : 'salesforce',
    '/setting/vericlock' : 'vericlock',
    '/setting/notifications' : 'notifications'
}

const SettingTabs = (props: any) => {
    const {pathname} = useLocation();
    const identity = useIdentityContext();
    const redirect = useRedirect();
    const [value, setValue] = React.useState(ROUTES[pathname] || 'general');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        if (newValue !== 'general') {
            redirect(newValue);
        } else {
            redirect('/setting');
        }
        setValue(newValue);
    };
    const { permissions } = usePermissionsOptimized();
    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab
                            icon={
                                <Icon
                                    icon="dashicons:admin-settings" 
                                    width={20}
                                    height={20}
                                    fr=""
                                />
                            }
                            label="General"
                            value="general"
                        />
                        {/** TODO: this all flags related to each connector need refactoring. UI should not be based on the flags of the connectors but based on what domain level features they are giving. */}
                        {!identity?.company?.allow_salesforce_api && !identity?.company?.allow_vericlock_api && !identity?.company?.allow_dataverse && <Tab
                            icon={
                                <Icon
                                    icon="ic:sharp-av-timer" 
                                    width={20}
                                    height={20}
                                    fr=""
                                />
                            }
                            label="TSheet"
                            value="tsheet"
                        />}
                        {canAccess({ permissions, resource: 'allow-dataverse', action: '*', }) && 
                            <Tab
                                icon={
                                    <Icon
                                        icon="ic:sharp-av-timer" 
                                        width={20}
                                        height={20}
                                        fr=""
                                    />
                                }
                                label="Dataverse"
                                value="dataverse"
                            />
                        }

                   
                        {identity?.company?.allow_salesforce_api && <Tab
                            icon={
                                <CloudQueueIcon/>
                            }
                            label="SalesForce"
                            value="salesforce"
                        />}
                        {identity?.company?.allow_zapier_api && <Tab
                            icon={<img src={zapierIcon} height={16} />}
                            label=""
                            value="zapier"
                        />}
                        {identity?.company?.allow_vericlock_api && <Tab
                            icon={
                                <QueryBuilderIcon/>
                            }
                            label="Vericlock"
                            value="vericlock"
                        />}
                        {/* <Tab
                            icon={
                                <Icon
                                    icon={bellFill}
                                    width={20}
                                    height={20}
                                    fr=""
                                />
                            }
                            label="Notifications"
                            value="notifications"
                        /> */}
                    </TabList>
                </Box>
                <StyledTabPanel value="general">
                    <CompanySetting />
                </StyledTabPanel>
                <StyledTabPanel value="tsheet">
                    <TSheetSetting/>
                </StyledTabPanel>
                <StyledTabPanel value="zapier">
                    <ZapierSetting/>
                </StyledTabPanel>
                <StyledTabPanel value="dataverse">
                    <DataverseSetting/>
                </StyledTabPanel>
                <StyledTabPanel value="salesforce">
                    <SalesForceSetting/>
                </StyledTabPanel>
                <StyledTabPanel value="vericlock">
                    <VericlockSetting/>
                </StyledTabPanel>
                {/* <StyledTabPanel value="notifications">
                    <RaTitle title={<Title title="Settings"/>}/>
                    Upcoming Notifications...
                </StyledTabPanel> */}
            </TabContext>
        </Box>
    );
};

export default SettingTabs;
