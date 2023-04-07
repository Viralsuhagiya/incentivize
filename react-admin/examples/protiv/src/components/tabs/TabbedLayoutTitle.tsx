import React from 'react';
import { useResourceContext, useGetResourceLabel } from 'react-admin';
import { Helmet } from 'react-helmet-async';
import { NUMBER } from '../../utils/Constants/MagicNumber';

export const TabbedLayoutTitle = ({ className, record, defaultTitle, title, action: TitleAction=null, titleActionProps ,...rest }: any) => {
    const resource = useResourceContext(titleActionProps&&titleActionProps.resource?{resource:titleActionProps.resource}:rest);
    let defaultHeading = title;
    let defaultCreateLabel = `Create ${defaultHeading}`;
    const getResourceLabel = useGetResourceLabel();
    if (!defaultHeading) {
        defaultHeading = getResourceLabel(resource, NUMBER.TWO)
        defaultCreateLabel = 'New '+getResourceLabel(resource, 1)
    }
    return (
        <>
            <Helmet>
                <title>{defaultHeading}</title>
            </Helmet>
            {TitleAction&&<TitleAction label={defaultCreateLabel} {...titleActionProps}/>}
        </>
    );
};

