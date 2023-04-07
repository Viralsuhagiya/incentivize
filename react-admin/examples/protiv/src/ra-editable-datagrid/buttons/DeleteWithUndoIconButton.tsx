import React, { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import ActionDelete from '@mui/icons-material/Delete';
import classnames from 'classnames';
import {
    useTranslate,
    Record,
    RedirectionSideEffect,
    useDeleteWithUndoController,
} from 'react-admin';

const DeleteWithConfirmIconButton: FC<DeleteWithConfirmIconButtonProps> = ({
    basePath,
    className,
    label = 'ra.action.delete',
    record,
    resource,
    redirect: redirectTo = 'list',
}) => {
    const { isLoading, handleDelete } = useDeleteWithUndoController({
        resource,
        record,
        redirect: redirectTo,
        basePath,
    });
    const loading = isLoading;
    const translate = useTranslate();
    const translatedLabel = translate(label, { _: label });
    return  (
        <IconButton
            aria-label={translatedLabel}
            disabled={loading}
            onClick={handleDelete}
            className={classnames('ra-delete-button', className)}
            key="button"
            size="small"
        >
            <ActionDelete color="error" />
        </IconButton>
    );
};

interface Props {
    basePath?: string;
    className?: string;
    confirmTitle?: string;
    confirmContent?: string;
    icon?: ReactElement;
    label?: string;
    onClick?: (e: MouseEvent) => void;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    undoable?: boolean;
}

type DeleteWithConfirmIconButtonProps = Props;

DeleteWithConfirmIconButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    confirmTitle: PropTypes.string,
    confirmContent: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.any,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string,
    icon: PropTypes.element,
};

export default DeleteWithConfirmIconButton;
