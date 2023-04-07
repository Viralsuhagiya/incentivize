import { useParams, useLocation } from 'react-router-dom';

export const useGetBaseLocationForCurrentRoute = () => {
    const params = useParams();
    const location = useLocation();
    let basePath = location.pathname.substring(0,location.pathname.lastIndexOf(params['*']));
    if(basePath.endsWith('/')){
        basePath = basePath.substring(0,basePath.length-1);
    }
    return basePath;
};



