import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TableCell } from '@mui/material';
import { TableCellProps } from '@mui/material/TableCell';
import {
    useResourceContext,
    Record
} from 'react-admin';

export const DatagridFooterCell = (
    props: DatagridFooterCellProps
): JSX.Element => {
    const {
        className,
        field,
        record,
        basePath,
        ...rest
    } = props;
    const resource = useResourceContext(props);

    return (
        <StyledTableCell
            className={classnames(className, field.props.footerClassName)}
            align={field.props.textAlign}
            variant="footer"
            {...rest}
        >
            {React.cloneElement(field, {
                record,
                basePath: field.props.basePath || basePath,
                resource,
            })}
        </StyledTableCell>
    );
};

DatagridFooterCell.propTypes = {
    className: PropTypes.string,
    basePath: PropTypes.string,
    field: PropTypes.element,
    // @ts-ignore
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    resource: PropTypes.string,
};

export interface DatagridFooterCellProps
    extends Omit<TableCellProps, 'classes'> {
    className?: string;
    basePath?: string;
    field?: JSX.Element;
    record?: Record;
    resource: string;
}

const PREFIX = 'RaDatagrFooterCell';

export const DatagridFooterCellClasses = {
    icon: `${PREFIX}-icon`,
};

const StyledTableCell = styled(TableCell, { name: PREFIX })(({ theme }) => ({
    [`& .MuiSvgIcon-root`]: {
        display: 'none',
    },
    [`& .Mui-active .MuiSvgIcon-root`]: {
        display: 'inline',
    },
}));
