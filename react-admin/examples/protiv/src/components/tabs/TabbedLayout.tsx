
import { Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, {    ChangeEvent,
    Children,
    cloneElement,
    isValidElement,
    useState,
} from 'react';
import {
    TabbedShowLayoutProps
} from 'react-admin';
import { Outlet, Routes, Route,useParams } from 'react-router-dom';
import { NUMBER } from '../../utils/Constants/MagicNumber';
import {TabbedLayoutTabs} from './TabbedLayoutTabs';

const DefaultTabs = <TabbedLayoutTabs />;


export const TabbedLayout = (props: Omit<TabbedShowLayoutProps, 'record'>&{noTitle?: boolean,route?:{}}) => {
    const {
        children,
        className,
        spacing,
        divider,
        route,
        syncWithLocation = true,
        tabs = DefaultTabs,
        value,
        noTitle,
        ...rest
    } = props;
    const nonNullChildren = Children.toArray(children).filter(
        child => child !== null
    );
    const [tabValue, setTabValue] = useState<number|string>(0);

    const handleTabChange = (event: ChangeEvent<{}>, val: any): void => {
        if (!syncWithLocation) {
            setTabValue(val);
        }
    };
    const params = useParams();
    const paramValue = route ? route[params['*'].split('/')[0]]: params['*'].split('/')[0];

    const renderTabHeaders = () =>
        cloneElement(
            tabs,
            {
                onChange: handleTabChange,
                syncWithLocation,
                value: syncWithLocation? paramValue:tabValue,
            },
            nonNullChildren
        );

    return (
        <Root className={className} {...sanitizeRestProps(rest)}>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <>
                            <RootTabbedLayoutHeader>
                                {renderTabHeaders()}
                                {!noTitle&&<div id="react-admin-title" className="bonus-layout-tabs" />}
                            </RootTabbedLayoutHeader>

                            <Divider />
                            <div
                                className={
                                    TabbedLayoutClasses.content
                                }
                            >
                                <Outlet />
                            </div>
                        </>
                    }
                >
                    {Children.map(nonNullChildren, (tab, index) =>
                        isValidElement(tab) ? (
                            <Route
                                path={tab.props.path}
                                element={cloneElement(tab, {
                                    context: 'content',
                                    spacing,
                                    divider,
                                })}
                            />
                        ) : null
                    )}
                </Route>
            </Routes>          
        </Root>          
    );


}
const PREFIX = 'RaTabbedLayout';

export const TabbedLayoutClasses = {
    content: `${PREFIX}-content`,
};

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    flex: 1,
    [`& .${TabbedLayoutClasses.content}`]: {
        paddingTop: `${theme.spacing(NUMBER.TWO)}`,
    },
}));

const sanitizeRestProps = ({
    resource,
    basePath,
    version,
    initialValues,
    staticContext,
    translate,
    tabs,
    ...rest
}: any) => rest;


const RootTabbedLayoutHeader = styled('div', {name: 'RootTabbedLayoutHeader' })(({ theme }) => ({
    display:'flex',
    alignItems:'flex-end',
    [`& #react-admin-title`]: {
        marginLeft: `auto`,
        order:2,
    },
}));

