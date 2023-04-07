import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

import { Button, ButtonProps } from 'react-admin';
import { useSimpleFormIteratorItem } from './useSimpleFormIteratorItem';

export const RemoveItemButton = (props: Omit<ButtonProps, 'onClick'>) => {
    const { remove } = useSimpleFormIteratorItem();

    return (
        <Button  onClick={() => remove()} {...props}>
            <DeleteIcon />
        </Button>
    );
};
