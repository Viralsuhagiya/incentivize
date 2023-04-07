import React, { FC } from 'react';
import { useTranslate } from 'react-admin';
import { IconButton } from '@mui/material';
import ContentSave from '@mui/icons-material/Done';

const SaveFieldButton: FC<Props> = ({
    dirty,
    handleSubmit,
    invalid,
    quitEditMode,
    saving,
    autoSave,
    undoable,
}) => {
    const translate = useTranslate();

    const onClick = (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        console.log("On click called");
        evt.stopPropagation();
        evt.preventDefault();

        if (dirty && invalid) {
            return;
        }
        if (!dirty) {
            quitEditMode();
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
                onClick={!autoSave?onClick:()=>{
                    //TODO: fix me this is dirty hack.
                    //this is done to allow manually close even if its auto save.
                    //in case if its auto save we cannot do everything from here
                    //because it will fire blure as well when we click button
                    //so only in case where  select input is not dirty and so it will not fire blur
                    //so atleast user can manually click this to close edit mode of the field.
                    if (!dirty) {
                        quitEditMode();
                        return;
                    }
                }}
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
    autoSave?: boolean;
}

export default SaveFieldButton;
