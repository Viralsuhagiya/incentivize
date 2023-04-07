import * as React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import ContentCreate from '@mui/icons-material/Create';
import { useTranslate } from 'react-admin';

import { useEditRowContext } from '../useEditRowContext';

const EditRowButton = () => {
    const { open } = useEditRowContext();
    const translate = useTranslate();

    return (
        <Tooltip title={translate('ra.action.edit', { _: 'ra.action.edit' })}>
            <IconButton
                onClick={open}
                size="small"
                color="primary"
                aria-label="edit"
            >
                <ContentCreate />
            </IconButton>
        </Tooltip>
    );
};

export default EditRowButton;
