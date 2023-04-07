import * as React from 'react';
import { forwardRef } from 'react';
import { MenuItemLink, useTranslate } from 'react-admin';
import Typography from '@mui/material/Typography';
import BusinessIcon from '@mui/icons-material/Business';
import {UserMenu} from './UserMenu';
import { Button, Divider, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { getPolicies } from '../resources/policies';
import { useQuery } from 'react-query';
import _ from 'lodash';
import SelectCompany from './SelectCompany';
import DialogForm from '../components/DialogForm';
import { PROTIV_BILLING_LINK } from '../utils/Constants/ConstantData';
import { useGetIdentityOptimized } from '../components/identity';

const SwitchCompany = forwardRef<any, any>((props, ref) => {
    const diaglogRef: any = React.useRef();
    const translate = useTranslate()
    const {identity} = props
  
    const onClick = () => {
        diaglogRef.current.open()
    }
    return (
        <>
        {
            identity?.user_companies?.allowed_companies &&
            <>
            <MenuItemLink
                ref={ref}
                to=''
                primaryText={translate('dashboard.switch_company')}
                leftIcon={<BusinessIcon />}
                onClick={onClick}
                sidebarIsOpen
            />
            <DialogForm title={translate('dashboard.select_company')} ref={diaglogRef}>
                <SelectCompany {...props}/>
            </DialogForm>
            </>
        }
        </>
    );
});
const UserMenuFooter = () => {
    const { data } = useQuery('policies',getPolicies);
    console.log('Data is ',data);
    return (
            <>
        {data&&<>
        <Divider />
        <Stack direction='row' sx={{ml:2,mr:2}} justifyContent='center' alignItems='center'>
            {data&&data.policies.map((policy)=>(<><Button
                component={Link}
                color='secondary'
                to={`/policies/${policy.type}`}
                >
                    {policy.label}
            </Button>
            {_.last(data.policies)!==policy&&<Typography variant='body2' color='inherit'>•</Typography>}
            </>))
            }                
        </Stack>
    </>}
    </>)
};

const UserBiilingLink = () => {
    const { identity } = useGetIdentityOptimized()
    console.log(identity, 'identityidentity')
    if(identity?.user_type === 'admin' || !identity?.user_type)
    {
    return(        
            <Button className='billing-profile' onClick={()=> window.open(PROTIV_BILLING_LINK, '_blank')}>
             Billing
            </Button>
        );
    }else{
        return <></>;
    };
};

export const CustomUserMenu = (props: any) => (
    <UserMenu {...props} userMenuFooter={<UserMenuFooter />}>
        <SwitchCompany />
        <UserBiilingLink />
    </UserMenu>
);
