import * as React from 'react';
import PropTypes from 'prop-types';
import DownloadIcon from '@mui/icons-material/GetApp';
import _ from 'lodash';
import {
    fetchRelatedRecords,
    useDataProvider,
    useListContext,
    SortPayload,
    Exporter,
    FilterPayload,
} from 'ra-core';
import { Button, ButtonProps } from 'ra-ui-materialui';


export const GroupByExportButton = (props: any) => {
    const {
        onClick,
        label = 'ra.action.export',
        icon = defaultIcon,
        exporter: customExporter,
        labelResource,
        sort, // deprecated, to be removed in v4
        ...rest
    } = props;
    const {
        exporter: exporterFromContext,
        total,
        data
    } = useListContext(props);
    const exporter = customExporter || exporterFromContext;
    const dataProvider = useDataProvider();
    const handleClick = ()=> {
        var newData = _.map(data,function(record) {
            return {...record}
        });
        exporter &&
        exporter(
            newData,
            fetchRelatedRecords(dataProvider),
            dataProvider,
            labelResource
        )
    };

    return (
        <Button
            onClick={handleClick}
            label={label}
            disabled={total === 0}
            {...sanitizeRestProps(rest)}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <DownloadIcon />;

const sanitizeRestProps = ({
    basePath,
    filterValues,
    resource,
    ...rest
}: Omit<GroupByExportButtonProps, 'sort' | 'maxResults' | 'label' | 'exporter'>) =>
    rest;

interface Props {
    basePath?: string;
    exporter?: Exporter;
    filterValues?: FilterPayload;
    icon?: JSX.Element;
    label?: string;
    maxResults?: number;
    labelResource?: string;
    onClick?: (e: Event) => void;
    resource?: string;
    sort?: SortPayload;
}

export type GroupByExportButtonProps = Props & ButtonProps;

GroupByExportButton.propTypes = {
    basePath: PropTypes.string,
    exporter: PropTypes.func,
    filterValues: PropTypes.object,
    label: PropTypes.string,
    maxResults: PropTypes.number,
    labelResource: PropTypes.string,
    resource: PropTypes.string,
    sort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    icon: PropTypes.element,
};
