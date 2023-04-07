import * as React from 'react';
import { Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import {
    useListContext,
    useResourceContext,
    Record,
    SortPayload,
} from 'ra-core';
import { TableCell, TableFooter, TableRow } from '@mui/material';
import classnames from 'classnames';
import _ from 'lodash';
import { DatagridClasses as RaDatagridClasses } from 'react-admin';
import { DatagridFooterCell } from './DatagridFooterCell';
import { useListGroupController } from '../../ra-list-grouping';

/**
 * The default Datagrid Header component.
 *
 * Renders select all checkbox as well as column header buttons used for sorting.
 */
export const DatagridFooter = (props: DatagridFooterProps) => {
    const {
        children,
        className,
        hasExpand = false,
        hasBulkActions = false,
    } = props;
    const resource = useResourceContext(props);
    //TODO: this will not work if the grid is under the ReferenceArrayField.
    //because we are not getting filter with ids there.
    const {filter,filterValues} = useListContext(props);
    const merged = {...filter,...filterValues};
    const groupByFields = Children.map(children, (field,index) => isValidElement(field) && field.props.groupBy ? field.props.source: null);
    const {
        data:listGroupData
    } = useListGroupController({disableSyncWithLocation:true, resource:resource,groupBy:[],fields:groupByFields,filter:merged, lazy:false})
    const footerData = listGroupData && listGroupData[0];

    return (
        <TableFooter className={classnames(className, DatagridClasses.tfoot)}>
            <TableRow
                className={classnames(
                    DatagridClasses.row,
                    DatagridClasses.footerRow
                )}
            >
                {hasExpand && (
                    <TableCell
                        padding="none"
                        className={classnames(
                            DatagridClasses.footerCell,
                            DatagridClasses.expandHeader
                        )}
                    />
                )}
                {hasBulkActions && (
                    <TableCell
                        padding="checkbox"
                        className={DatagridClasses.footerCell}
                    >
                    </TableCell>
                )}
                {Children.map(children, (field, index) =>
                    isValidElement(field) && field.props.groupBy ? (
                        <DatagridFooterCell
                            className={classnames(
                                DatagridClasses.footerCell,
                                `column-${(field.props as any).source}`
                            )}
                            field={isValidElement(field.props.groupBy)?field.props.groupBy:field}
                            key={'footer-'+((field.props as any).source || index)}
                            resource={resource}
                            record = {footerData as any}
                        />
                    ) : <TableCell className={DatagridClasses.footerCell}/>
                )}
            </TableRow>
        </TableFooter>
    );
};

DatagridFooter.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    currentSort: PropTypes.exact({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.arrayOf(PropTypes.any),
    hasExpand: PropTypes.bool,
    hasBulkActions: PropTypes.bool,
    resource: PropTypes.string,
};

export interface DatagridFooterProps<RecordType extends Record = Record> {
    children?: React.ReactNode;
    className?: string;
    hasExpand?: boolean;
    hasBulkActions?: boolean;
    size?: 'medium' | 'small';
    // can be injected when using the component without context
    currentSort?: SortPayload;
    data?: RecordType[];
    resource?: string;
}

DatagridFooter.displayName = 'DatagridFooter';
const PREFIX="RaDatagrid";
export const DatagridClasses = _.merge(RaDatagridClasses,{
    footerRow: `${PREFIX}-footerRow`,
    footerCell: `${PREFIX}-footerCell`,
    tfoot: `${PREFIX}-tfoot`,
});
