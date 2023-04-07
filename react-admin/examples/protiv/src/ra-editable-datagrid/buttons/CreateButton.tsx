import React, { FC, ComponentProps } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslate } from 'react-admin';

const CreateButton: FC<Pick<ComponentProps<typeof IconButton>, 'onClick'>> =
    props => {
        const translate = useTranslate();
        const label = translate('ra.action.create', { _: 'ra.action.create' });
        return (
            <Tooltip title={label}>
                <IconButton
                    aria-label={label}
                    size="small"
                    color="primary"
                    {...props}
                    className={'Mui-active'}
                >
                    <AddIcon />
                    {props.children}
                </IconButton>
            </Tooltip>
        );
    };

export default CreateButton;
