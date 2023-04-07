import { useEffect } from 'react';
import { useRedirect } from 'react-admin';
import { useLocation } from 'react-router';
import { useIdentityContext } from './IdentityContext';

const useCompanyAccess = () => {
    const identity = useIdentityContext();
    const redirectTo = useRedirect();
    const location = useLocation()
    useEffect(()=>{
        if(redirectTo && identity && location){
            if(identity.company_id === 1 && !identity.user_companies) {
                redirectTo('/no-company')
            } else {
                if(location.pathname==="/no-company"){
                    redirectTo('/')
                }
            }
        }
    },[redirectTo, identity, location])

}

export default useCompanyAccess;