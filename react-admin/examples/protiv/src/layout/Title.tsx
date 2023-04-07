import React from 'react';
import { useResourceContext, useGetResourceLabel } from 'react-admin';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import { Helmet } from 'react-helmet-async';

import { useLayoutContext } from './Layout';
import { NUMBER } from '../utils/Constants/MagicNumber';

export const Title = (props: any) => {
    const {className, record, defaultTitle, title, action: TitleAction=null, titleActionProps, ...rest} = props;

    const { titleComponent } = useLayoutContext();    
    const resource = useResourceContext(titleActionProps&&titleActionProps.resource?{resource:titleActionProps.resource}:rest);
    let defaultHeading = title;
    let defaultCreateLabel = `Create ${defaultHeading}`;
    const getResourceLabel = useGetResourceLabel();
    if (!defaultHeading) {
        defaultHeading = getResourceLabel(resource, NUMBER.TWO)
        defaultCreateLabel = 'New '+getResourceLabel(resource, 1)
    }
    // const links = useGetBreadcrumbs(rest);
    if(titleComponent){
        const element = React.cloneElement(titleComponent, {
            ...props
        })
        return element;
    }
    return (
        <>
            <Helmet>
                <title>{defaultHeading === 'Mailtrackingvalues' ? 'Propay Detail' : defaultHeading}</title>
            </Helmet>

            <HeaderBreadcrumbs
                heading= {defaultHeading}
                action = {TitleAction&&<TitleAction label={defaultCreateLabel} {...titleActionProps}/>}
                links={[]}
            />
        </>
    );
};

export const EmptyTitle = (props: any) => {
    return (
        <div/>
    );
};
