import { TableBody } from '@mui/material';
import classnames from 'classnames';
import * as React from 'react';
import { cloneElement, FC } from 'react';
import PropTypes from 'prop-types';

import { DatagridBodyProps, DatagridClasses, DatagridRow } from 'react-admin';
import { NUMBER } from '../../utils/Constants/MagicNumber';

const RowIndexDatagridBody: FC<DatagridBodyProps> = React.forwardRef(
    (
        {
            basePath,
            children,
            className,
            data,
            expand,
            hasBulkActions,
            hover,
            onToggleItem,
            resource,
            row,
            rowClick,
            rowStyle,
            selectedIds,
            isRowSelectable,
            ...rest
        },
        ref
    ) => (
        <TableBody
            ref={ref}
            className={classnames(
                'datagrid-body',
                className,
                DatagridClasses.tbody
            )}
            {...rest}
        >
            {data.map((record, rowIndex) =>
                cloneElement(
                    row,
                    {
                        basePath,
                        className: classnames(DatagridClasses.row, {
                            [DatagridClasses.rowEven]: rowIndex % NUMBER.TWO === 0,
                            [DatagridClasses.rowOdd]: rowIndex % NUMBER.TWO !== 0,
                            [DatagridClasses.clickableRow]: rowClick,
                        }),
                        expand,
                        hasBulkActions: hasBulkActions && !!selectedIds,
                        hover,
                        id: record.id,
                        key: record.id,
                        onToggleItem,
                        record:{...record,rowIndex:rowIndex},
                        resource,
                        rowClick,
                        selectable: !isRowSelectable || isRowSelectable(record),
                        selected: selectedIds?.includes(record.id),
                        style: rowStyle ? rowStyle(record, rowIndex) : null,
                    },
                    children
                )
            )}
        </TableBody>
    )
);

RowIndexDatagridBody.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    // @ts-ignore
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    // @ts-ignore
    expand: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    hasBulkActions: PropTypes.bool.isRequired,
    hover: PropTypes.bool,
    onToggleItem: PropTypes.func,
    resource: PropTypes.string,
    row: PropTypes.element,
    rowClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    rowStyle: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any),
    styles: PropTypes.object,
    isRowSelectable: PropTypes.func,
};

RowIndexDatagridBody.defaultProps = {
    data: [],
    hasBulkActions: false,
    row: <DatagridRow />,
};

// trick material-ui Table into thinking this is one of the child type it supports
// @ts-ignore
RowIndexDatagridBody.muiName = 'TableBody';

export default RowIndexDatagridBody;
