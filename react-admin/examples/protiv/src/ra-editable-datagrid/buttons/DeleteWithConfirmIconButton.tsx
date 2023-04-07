import React, { Fragment, FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import ActionDelete from '@mui/icons-material/Delete';
import classnames from 'classnames';
import inflection from 'inflection';
import {
    Confirm,
    useTranslate,
    MutationMode,
    Record,
    RedirectionSideEffect,
} from 'react-admin';
import useDeleteWithConfirmController from './useDeleteWithConfirmController';
import { ConfirmModal } from '../../components/ConfirmModal';

const DeleteWithConfirmIconButton: FC<DeleteWithConfirmIconButtonProps> = ({
    basePath,
    className,
    confirmTitle = 'ra.message.delete_title',
    confirmContent = 'ra.message.delete_content',
    label = 'ra.action.delete',
    mutationMode,
    record,
    resource,
    onSuccess,
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

    return (
        <Fragment >
            {/*tooltip is cauing trouble not allowing to click button as tooltip is visible, when the editable grid is there within table
             <Tooltip title={translatedLabel}> */}
                <IconButton                    
                    className={classnames('ra-delete-button edit-delete-btn', className)}
                    key="button"
                    size="small"
                >
                    <ActionDelete />
                </IconButton>
                <IconButton
                    aria-label={translatedLabel}
                    onClick={handleClick}
                    className={classnames('ra-delete-button', className)}
                    key="button"
                    size="small"
                >
                    <ActionDelete color="error" />
                </IconButton>
            {/* </Tooltip> */}            
            
            {/* <Confirm
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
                    id: record ? record.id : undefined,
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            /> */}
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
                    handleDialogClose(e);
                  } }
                  onConfirm={handleDelete}
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
    onSuccess: PropTypes.func,
};

export default DeleteWithConfirmIconButton;
