import * as React from 'react';
import AddIcon from '@mui/icons-material/AddCircleOutline';
import { useSimpleFormIterator } from './useSimpleFormIterator';

import { Button, ButtonProps } from 'react-admin';

export const AddItemButton = (props: Omit<ButtonProps, 'onClick'>) => {
    const { add } = useSimpleFormIterator();
    return (
        <Button label="ra.action.add" onClick={() => add()} {...props}>
            <AddIcon />
        </Button>
    );
};
