import { Box, Link, Stack, Typography } from '@mui/material';
import React from 'react';
import { Layout } from '../../layout';
import { styled } from '@mui/material/styles';
import { Tab, TabbedLayout, TabbedLayoutTitle } from '../../components/tabs';
import { Logout } from 'react-admin';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useQuery } from 'react-query';
import { DateField } from '../../components/fields/DateField';
export const StyledTabbedLayout = styled(TabbedLayout, { name: 'TabList' })(
    ({ theme }) => ({
        [`& .Mui-selected`]: {
            fontSize: 'x-large',
        },
        [`& .MuiDivider-root`]:{
            display: 'none'
        }
    })
);
const FrameStyle= styled(Box)(({ theme }) => ({
    height:window.innerHeight,
    borderWidth:0,
    padding:theme.spacing(1),  
    overflow:'auto'
  }));
const PoliciesTabs = (props: any) => {
    const { data } = useQuery('policies',getPolicies);

    return (
        <Layout className='policies-wrapper' logout={<Logout button />} noTitle titleComponent={<TabbedLayoutTitle />}>
            <StyledTabbedLayout>
                {data&&data.policies.map((policy,idx)=>(
                    <Tab key={policy.type} label={policy.label} path={policy.type} value={policy.type}>
                        <FrameStyle>
                            <Policy label={policy.label} type={policy.type}/>
                        </FrameStyle>
                    </Tab>
                ))
                }
            </StyledTabbedLayout>
        </Layout>
    );
};
export const getPolicies = () => {
    console.log('Getting policies')
    return fetch(`/api/policies`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
    .then(response => {
        console.log('Response', response);
        return response.json();
    }).then(response=>{
        return response&&response.result;
    })    
}
const getPolicy =  ({queryKey}) => {
    console.log('Getting policy', queryKey);
    return fetch(`/api/policies/${queryKey}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
    .then(response => {
        console.log('Response', response);
        return response.json()
    }).then(response=>{
        return response&&response.result;
    })
}
export const  Policy = ({label, type}) => {
    const { data, isLoading, error, isSuccess } = useQuery(type,getPolicy);
    return (
        <>            
            {isLoading && <><Typography>{label}</Typography>Loading...</>}
            {error && <><Typography>{label}</Typography>${error}</>}
            {isSuccess && data &&
                <>
                    <Stack direction='row' alignItems={'center'} spacing={1}>
                        <Typography variant='h6'>{data.title}</Typography>
                        
                        <Typography variant='caption'><Link color='secondary' href={data.pdf_file_url}> <FileDownloadIcon fontSize='small' /> Download</Link></Typography>
                        
                    </Stack>
                    <Typography variant='body2'>Effective Date: <DateField source='effective_date' record={data}/></Typography>

                    {data.body_html&&<StyledDiv dangerouslySetInnerHTML={{__html: data.body_html}} />}
                </>
            }
        </>
    )
};
const StyledDiv = styled('div')(({ theme }) => ({
    'overflow':'auto',
    'scrollBehavior':'smooth'
}));

export default React.memo(PoliciesTabs);


