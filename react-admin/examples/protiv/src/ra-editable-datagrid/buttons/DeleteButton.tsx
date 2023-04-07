import React, { Fragment, FC, ReactElement } from 'react';
import { IconButton } from '@mui/material';
import ActionDelete from '@mui/icons-material/Delete';
import classnames from 'classnames';
import inflection from 'inflection';
import {
    useTranslate,
    MutationMode,
    Record,
    RedirectionSideEffect,
} from 'react-admin';
import useDeleteWithConfirmController from './useDeleteWithConfirmController';
import { ConfirmModal } from '../../components/ConfirmModal';

const DeleteButton: FC<DeleteButtonProps> = ({
    basePath,
    className,
    confirmTitle = 'ra.message.delete_title',
    confirmContent = 'ra.message.delete_content',
    label = 'ra.action.delete',
    mutationMode,
    record,
    resource,
    onSuccess,
    closeDropdown,
    redirect: redirectTo = 'list',
}) => {
    const { open, isLoading, handleClick, handleDialogClose, handleDelete } =
        useDeleteWithConfirmController({
            mutationMode,
            resource,
            record,
            redirect: redirectTo,
            basePath,
            onSuccess,
        });
    const loading = isLoading;
    const translate = useTranslate();
    const translatedLabel = translate(label, { _: label });

    const handleDleteClick = (e) => {
        handleClick(e);
    }
    const DeleteClick = (e) => {
        handleDelete(e);
        closeDropdown();
    }
    const CloseDialog = (e) => {
        handleDialogClose(e);
        closeDropdown();

    }

    return (
        <Fragment >
                <IconButton
                    aria-label={translatedLabel}
                    onClick={handleDleteClick}
                    className={classnames('ra-delete-button', className)}
                    key="button"
                    size="small"
                >
                Delete Attendance
                </IconButton>
            <ConfirmModal
                  isOpen={open}
                  loading={loading}
                  title={confirmTitle}
                  content={confirmContent}
                  translateOptions={{
                    name: inflection.humanize(
                        translate(`resources.${resource}.name`, {
                            smart_count: 1,
                            _: inflection.singularize(resource||''),
                        }),
                        true
                    ),
                    id: '',
                    }}                  
                    onClose={(e) => {
                        CloseDialog(e);
                  } }
                  onConfirm={DeleteClick}
                    />
        </Fragment>
    );
};

interface Props {
    basePath?: string;
    className?: string;
    confirmTitle?: string;
    confirmContent?: string;
    icon?: ReactElement;
    label?: string;
    mutationMode?: MutationMode;
    onClick?: (e: MouseEvent) => void;
    record?: Record;
    redirect?: RedirectionSideEffect;
    resource?: string;
    invalid?: boolean;
    pristine?: boolean;
    saving?: boolean;
    submitOnEnter?: boolean;
    undoable?: boolean;
    onSuccess?: ()=>void;
    closeDropdown: ()=>void;
}

type DeleteButtonProps = Props;

export default DeleteButton;
