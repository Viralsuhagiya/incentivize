import { useEffect, useRef,  } from 'react';

import { useResourceAppLocation } from './useResourceAppLocation';
import { useAppLocationState } from './useAppLocationState';
import { defaultLocation, AppLocation } from './AppLocationContext';
import { useLocation } from 'react-router';
/**
 * This component acts as a listener on changes in the resource location.
 * When the location of the resource changes, it modifies the location of the application accordingly.
 */
export const ResourceLocationListener = ({
    hasDashboard = false,
}: ResourceLocationListenerProps): null => {
    const nativLocation = useLocation();
    const [, , setLocation] = useAppLocationState();
    const resourceLocation = useResourceAppLocation();
    const currentResourceLocation = useRef<AppLocation>({} as AppLocation);
    // console.log("Resource Location Listner => Old => New", location, resourceLocation);
    // console.log("Resource Location Listner => Current =>", currentResourceLocation);

    useEffect(() => {
        const { path, values } = resourceLocation || defaultLocation;
        const  state  = nativLocation.state;

        console.log("ResourceLocationListener ",resourceLocation, path, values ,state);

        if (resourceLocation) {
            setLocation({path, values});
        } else if (currentResourceLocation.current) {
            // Reset the location state if the users navigated away from a resource page or the dashboard
            setLocation({} as AppLocation);
        }
        currentResourceLocation.current = resourceLocation;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(resourceLocation)]);

    return null;
};

export interface ResourceLocationListenerProps {
    hasDashboard?: boolean;
}
