import React, { FC } from 'react';
import { useTranslate } from 'react-admin';
import { IconButton } from '@mui/material';
import ContentSave from '@mui/icons-material/Save';

const SaveRowButton: FC<Props> = ({
    dirty,
    handleSubmit,
    invalid,
    quitEditMode,
    saving,
    undoable,
}) => {
    const translate = useTranslate();

    const onClick = (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        evt.stopPropagation();
        evt.preventDefault();

        if (dirty && invalid) {
            return;
        }

        handleSubmit();

        if (undoable && quitEditMode) {
            quitEditMode();
        }
    };

    const label = translate('ra.action.save', {
        _: 'ra.action.save',
    });

    return (
        //tooltip is cauing trouble not allowing to click button as tooltip is visible, when the editable grid is there within table
        // <Tooltip title={label}>
            <IconButton
                aria-label={label}
                disabled={saving}
                onClick={onClick}
                size="small"
                color="primary"
            >
                <ContentSave />
            </IconButton>
        // </Tooltip>
    );
};

export interface Props {
    dirty: boolean;
    handleSubmit: () => void;
    invalid: boolean;
    quitEditMode?: () => void;
    saving?: boolean;
    undoable?: boolean;
}

export default SaveRowButton;
