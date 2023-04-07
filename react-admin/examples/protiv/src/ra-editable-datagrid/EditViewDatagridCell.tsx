import {useRef} from 'react';
import PropTypes from 'prop-types';
import { Record } from 'ra-core';
import { DatagridCellProps } from 'react-admin';
import { DatagridCell } from 'react-admin';
import {EditableDatagridCell} from './EditableDatagridCell';

const EditViewDatagridCell = ({field,basePath,isDragging, resource, key, className, onSuccess, isRowEditable, ...rest}: any) => {
    const { form, autoSave, noSaveButton } = field && field.props && field.props;
    const cellProps = { field, basePath, resource, key, className};
    const cellRef=useRef<any>();
    return (
        <>
            {form && <EditableDatagridCell
                    {...cellProps} 
                    isRowEditable={isRowEditable}
                    onSuccess={onSuccess}
                    autoSave={autoSave}
                    noSaveButton={noSaveButton}
                    {...rest}
            />}
            {!form && <DatagridCell ref={cellRef} sx={{width:isDragging && `${cellRef.current.offsetWidth}px`}} {...cellProps} {...rest}/>}
        </>
    );
}

EditViewDatagridCell.propTypes = {
    className: PropTypes.string,
    field: PropTypes.element,
    // @ts-ignore
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    basePath: PropTypes.string,
    resource: PropTypes.string,
    onSuccess: PropTypes.func,
    isRowEditable: PropTypes.func,
    isDragging: PropTypes.bool
};

export interface EditViewDatagridCellProps extends DatagridCellProps {
    basePath?: string;
    className?: string;
    field?: JSX.Element;
    isDragging?:boolean;
    record?: Record;
    resource?: string;
    onSuccess?: () => void;
    isRowEditable?: (record: Record) => boolean;
}

// What? TypeScript loses the displayName if we don't set it explicitly
EditViewDatagridCell.displayName = 'RaEditViewDatagridCell';

export default EditViewDatagridCell;
