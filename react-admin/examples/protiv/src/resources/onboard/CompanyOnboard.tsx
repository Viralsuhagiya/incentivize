import * as React from 'react';
import _ from 'lodash';
import { useCallback, useState, useEffect } from 'react';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LogoOnlyLayout from '../../layout/LogoOnlyLayout';
import ThemeWrapper from '../../layout/ThemeWrapper';
import Terms from './Terms';
import CompanyOnboardDone from './CompanyOnboardDone';
import Payment from './Payment';
import CompanyOnboardLoading from './CompanyOnboardLoading';
import { useQuery } from 'react-query';
import PaymentProvider from './PaymentProvider';
import { useSearchParams } from 'react-router-dom';
import { useAuthenticated } from 'react-admin';


// ----------------------------------------------------------------------

export const CompanyOnboardContext = React.createContext<CompanyOnboardContextValue|undefined>(undefined);
type CompanyOnboardContextValue = {
    stripe_publishable_key: string,
    phone: string,
    email: string,
    country_id: number,
    zip: string,

}
export const useCompanyOnboardContext = (): CompanyOnboardContextValue => {
    const context = React.useContext(CompanyOnboardContext);
    return context
};

export const OnboardingLayout = ({children}:{children?}) => {
    useAuthenticated()
    return (
        <ThemeWrapper>
            <LogoOnlyLayout />
            <Outlet />
            {children}
            
        </ThemeWrapper>
    );
};

const onboardingRoutes = {
    '/onboard':'/onboard/payment',
    '/onboard/payment':'/onboard/done',
};

const getNext = (current) =>{
        return onboardingRoutes[current]
};
const getPath = (pathname) =>{
    return _.trimEnd(pathname,'/')
};
const CompanyOnboardView = () => {
    const [page, setPage] = useState('');
    const location = useLocation()
    const pathname = location.pathname;
    useEffect(()=>{
        setPage(getPath(pathname));
    },[pathname,setPage]);
    const navigate = useNavigate();
    
    const [searchParams, ] = useSearchParams({});
    const onDone = useCallback( (newTransactionData?) => {
        const next = getNext(page);
        _.forEach(newTransactionData, (val,key)=>{
            searchParams.set(key,val)
        })
        const search = searchParams.toString();
        console.log(`Redirect from ${page} to ${next} with search ${search}`);
        navigate({pathname:next, search:search});
    },[page, navigate, searchParams]);

    /**
     * init-payment
     *  - create stripe customer
     *  - get plans
     *  - get stripe config
     *  - get payment methods (already associatd cards)
     * */

    return (
        <Routes>
            <Route path="/*" element={<OnboardingLayout/>}>
                <Route path="" element={<Outlet/>}>
                    <Route path="" element={<><Terms onDone={onDone}/></>}/>
                    <Route path="payment" element={<><Payment onDone={onDone}/></>}/>
                    <Route path="done" element={<><CompanyOnboardDone /></>}/>
                </Route>
            </Route>
        </Routes>       
    )
}

const CompanyOnboard = () => {
    const {data:onboardingData, isLoading, error} = useQuery('onboardingInfo', PaymentProvider.onboardingInfo);
    console.log('Onboarding Loaded', onboardingData, isLoading, error);
    return (
        <>
            <>
            {!isLoading  && onboardingData && <>
                <CompanyOnboardContext.Provider value={{...onboardingData}}>
                    <CompanyOnboardView />
                </CompanyOnboardContext.Provider>
            </>
            }
            { (isLoading||error) && <OnboardingLayout><CompanyOnboardLoading error={error}/></OnboardingLayout>}
            </>        
        </>
    );
};

export default CompanyOnboard;
