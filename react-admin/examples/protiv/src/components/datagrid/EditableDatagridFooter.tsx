import { Checkbox, TableCell, TableRow } from '@mui/material';
import classnames from 'classnames';
import {
    useListContext
} from 'ra-core';
import * as React from 'react';
import { Children, isValidElement } from 'react';
import { ExpandRowButton } from 'react-admin';
import { RowFormProps } from '../../ra-editable-datagrid/RowForm';
import { useListGroupController } from '../../ra-list-grouping';
import { DatagridClasses } from './DatagridFooter';
import { DatagridFooterCell } from './DatagridFooterCell';

export const EditableDatagridFooter = (props: RowFormProps) => {
    const {
        children,
        expand,
        hasBulkActions,
        selectable,
        resource,
        selected,
    } = props;
    //TODO: this will not work if the grid is under the ReferenceArrayField.
    //because we are not getting filter with ids there.
    const { filterValues } = useListContext(props);
    const groupByFields = Children.map(children, (field, index) => isValidElement(field) && field.props.groupBy ? field.props.source : null);
    const {
        data: listGroupData
    } = useListGroupController({ disableSyncWithLocation: true, resource: resource, groupBy: [], fields: groupByFields, filter: filterValues, lazy: false })
    const footerData = listGroupData && listGroupData[0];
    return (
            <TableRow
                className={classnames(
                    DatagridClasses.row,
                    DatagridClasses.footerRow
                )}
            >
                {expand && (
                    <TableCell padding="none">
                        <ExpandRowButton
                            expanded={false}
                            disabled
                        />
                    </TableCell>
                )}
                {hasBulkActions && (
                    <TableCell padding="checkbox">
                        {selectable && (
                            <Checkbox
                                color="primary"
                                checked={selected}
                                disabled
                            />
                        )}
                    </TableCell>
                )}
                {Children.map(children, (field, index) =>
                    isValidElement(field) && (field.props.groupBy ? (
                        <DatagridFooterCell
                            sx={{py:0}}
                            className={classnames(
                                DatagridClasses.footerCell,
                                `column-${(field.props as any).source}`
                            )}
                            field={isValidElement(field.props.groupBy) ? field.props.groupBy : field}
                            key={'footer-' + ((field.props as any).source || index)}
                            resource={resource}
                            record={footerData as any}
                        />
                    ) : <TableCell className={DatagridClasses.footerCell} />)
                )}
            </TableRow>
    );
};