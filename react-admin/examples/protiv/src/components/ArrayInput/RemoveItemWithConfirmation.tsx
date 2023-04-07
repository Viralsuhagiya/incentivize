import React, { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Button, ButtonProps } from 'react-admin';
import { useSimpleFormIteratorItem } from './useSimpleFormIteratorItem';
import { ConfirmModal } from '../ConfirmModal';

export const RemoveItemWithConfirmation = (props: Omit<ButtonProps, 'onClick'>) => {
    const { remove } = useSimpleFormIteratorItem();
    const handleDelete = () => {
       remove();
       setOpenConfiromDialog(false);
    }
    const [OpenConfiromDialog, setOpenConfiromDialog] = useState(false);
    return (
        <>
        <Button
            onClick={() => setOpenConfiromDialog(true)}
            style={{minWidth:0}}
        >
            <DeleteIcon />
        </Button>

        <ConfirmModal
            isOpen={OpenConfiromDialog}
            loading={false}
            title='Delete Item'
            content='Are you sure you want to delete this item?'                  
            onClose={() => setOpenConfiromDialog(false)}
            onConfirm={handleDelete}
            {...props}
        />
        </>
    );
};