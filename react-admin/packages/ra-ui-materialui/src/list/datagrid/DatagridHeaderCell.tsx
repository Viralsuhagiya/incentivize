import * as React from 'react';
import { styled } from '@mui/material/styles';
import { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TableCell, TableSortLabel, Tooltip, IconButton, Typography, Popover,Box } from '@mui/material';
import { TableCellProps } from '@mui/material/TableCell';
import {
    FieldTitle,
    useTranslate,
    SortPayload,
    useResourceContext,
} from 'ra-core';
import { Icon } from '@iconify/react';

export const DatagridHeaderCell = (
    props: DatagridHeaderCellProps
): JSX.Element => {
    const {
        className,
        field,
        currentSort,
        updateSort,
        isSorting,
        ...rest
    } = props;
    const resource = useResourceContext(props);

    const translate = useTranslate();

    return (
        <StyledTableCell
            className={classnames(className, field.props.headerClassName)}
            align={field.props.textAlign}
            variant="head"
            {...rest}
        >
            {updateSort &&
            field.props.sortable !== false &&
            (field.props.sortBy || field.props.source) ? (
                <Tooltip
                    title={translate('ra.action.sort')}
                    placement={
                        field.props.textAlign === 'right'
                            ? 'bottom-end'
                            : 'bottom-start'
                    }
                    enterDelay={300}
                >
                    <TableSortLabel
                        active={
                            currentSort.field ===
                            (field.props.sortBy || field.props.source)
                        }
                        direction={currentSort.order === 'ASC' ? 'asc' : 'desc'}
                        data-sort={field.props.sortBy || field.props.source} // @deprecated. Use data-field instead.
                        data-field={field.props.sortBy || field.props.source}
                        data-order={field.props.sortByOrder || 'ASC'}
                        onClick={updateSort}
                        classes={DatagridHeaderCellClasses}
                    >
                        <FieldTitle
                            label={field.props.label}
                            source={field.props.source}
                            resource={resource}
                        />
                    </TableSortLabel>
                </Tooltip>
            ) : (
                <FieldTitle
                    label={field.props.label}
                    source={field.props.source}
                    resource={resource}
                />
            )}
            {field.props.infoText && <InfoLabel value={translate(field.props.infoText)}/>}
        </StyledTableCell>
    );
};

const StyledIconButton = styled(IconButton)({
    padding:0,
    paddingLeft:5
})
export const InfoLabel = ({value}:{value: string}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    if(!value) return null;
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <>
            <StyledIconButton  onClick={handleClick}>
                <Icon icon="eva:question-mark-circle-fill" fr='' />
            </StyledIconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                <Box sx={{maxWidth:300}}>
                    <Typography sx={{ p: 2 }}>{value}</Typography>
                </Box>
            </Popover>
        </>
    );
}
DatagridHeaderCell.propTypes = {
    className: PropTypes.string,
    field: PropTypes.element,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }).isRequired,
    isSorting: PropTypes.bool,
    resource: PropTypes.string,
    updateSort: PropTypes.func,
};

export interface DatagridHeaderCellProps
    extends Omit<TableCellProps, 'classes'> {
    className?: string;
    field?: JSX.Element;
    isSorting?: boolean;
    resource: string;
    currentSort: SortPayload;
    updateSort?: (event: any) => void;
}

export default memo(
    DatagridHeaderCell,
    (props, nextProps) =>
        props.updateSort === nextProps.updateSort &&
        props.currentSort.field === nextProps.currentSort.field &&
        props.currentSort.order === nextProps.currentSort.order &&
        props.isSorting === nextProps.isSorting &&
        props.resource === nextProps.resource
);

const PREFIX = 'RaDatagridHeaderCell';

export const DatagridHeaderCellClasses = {
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
