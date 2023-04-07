import {useAppLocationState} from './useAppLocationState';
import {useResourcesBreadcrumbPaths} from './useResourcesBreadcrumbPaths';
import _ from 'lodash';


export const useGetBreadcrumbs = (
    props: any,
    resources?: []
): any[] => {
    const [, locations, ] = useAppLocationState();    
    const resourcesPaths = useResourcesBreadcrumbPaths();
    // const links = [{ name: "propay", href: "/propays" }, { name: "List" }];
    
    const links = locations && locations?_.reverse(locations).map((location) => {
        const resourceLocation = location&&location.path?resourcesPaths[location.path]:{label:'Dashboard',to:''};
        return { name:resourceLocation.label, href:"/"+resourceLocation.to }
    }):[];
    
    return links;
};
