import * as React from 'react';
import {
    createContext,
    ReactElement,
    ReactNode,
    useCallback,
    useRef,
    useState,
} from 'react';
import _ from 'lodash';
import { ResourceLocationListener } from './ResourceLocationListener';
import { NUMBER } from '../../utils/Constants/MagicNumber';

/**
 * AppLocation type defines all required location information needed to define a location
 * It is mainly used by the location state object in LocationContext
 *
 * @type {Object}
 * @property {string} path dot based location path (eg: foo.bar.baz)
 * @property {Object} values location context values (eg: { record }, ...)
 */
export type AppLocation = { path: string; values?: any};
export type SetAppLocation = (appLocation:AppLocation) => void;
export type AppLocationState = [AppLocation, [AppLocation], SetAppLocation];
export const LocationContext = createContext<AppLocationState>(undefined as any);


export const defaultLocation = {
    path: '',
    values: {},
};

type AppLocationContextProps = {
    children: ReactNode;
    initialLocation?: AppLocation;
};

/**
 * The <AppLocationContext /> component allows to wrap our application inside an unique location context.
 * This component must be contained by our admin to be able to access the current registred resources from the redux store.
 *
 * So, the easiest way to include it is to use a custom Layout as a wrapper since you (probably) need to insert your breadcrumb here too.
 *
 * @example
 *
 *  import { AppLocationContext } from '@react-admin/ra-navigation';
 *  import { Admin, Resource, Layout } from 'react-admin';
 *
 *  const MyLayout = ({ children, ...props }) => {
 *      const classes = useStyles();
 *
 *      return (
 *          <AppLocationContext>
 *              <Layout {...props}>
 *                  {children}
 *              </Layout>
 *          </AppLocationContext>
 *      );
 *  };
 *
 *  const App = () => (
 *      <Admin dataProvider={dataProvider} layout={MyLayout}>
 *          <Resource name='posts' list={PostList} />
 *      </Admin>
 *  );
 */
const filterBreadcrumb = (locations: AppLocation[], currentList: AppLocation[], ):AppLocation[] => {
     /*current.forEach(item=>locations.push(item));*/
    const processLocations = (locations:AppLocation[] = [], current: AppLocation):AppLocation[] => {
        let index = _.findIndex(locations, { path: current.path, values:current.values });
        
        if (index===-1) {
            console.log('Item ', current, 'not found in ', locations,' RESETING Breadcrumb');            
            return [current];
        };

        locations = locations.slice(0,index);
        console.log('Item ', current, 'not FOUND at ', index ,'in', locations,' SLICING');
        return locations        
    };
    locations = _.reduce(currentList, processLocations, locations);
    console.log('Final Breadcrumbs ',locations);
    return locations;
};
export const AppLocationContext = ({
    children,
    initialLocation = defaultLocation,
}: AppLocationContextProps): ReactElement => {
    const locations = useRef<AppLocation[]>([]);
    const timeout = useRef<NodeJS.Timeout|null>(null);
    const [locations2, setLocation] = useState<AppLocation[]>([]);
    const location = locations2&& locations2.length>0?locations2[locations2.length-1]:null;
    const optimizedSetLocation = useCallback(
        (appLocation: AppLocation): void => {
            const {path, values} = appLocation
            console.log('::Set Location:: => ',appLocation, locations2);
            locations.current.push({path, values});
            if (!timeout.current) {
                timeout.current = setTimeout(() => {
                    const current = locations.current;
                    locations.current = [];
                    setLocation(filterBreadcrumb(locations2, current));
                    timeout.current = null;
                }, NUMBER.FIFTY);
            }
        },
        [locations2]
    );
    
    return (
        <LocationContext.Provider value={[location, locations2, optimizedSetLocation] as any}>
            <ResourceLocationListener />
            {children}
        </LocationContext.Provider>
    );
};
