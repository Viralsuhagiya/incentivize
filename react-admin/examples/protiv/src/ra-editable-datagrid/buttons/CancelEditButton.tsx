import { FC } from 'react';
import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const CancelEditButton: FC<Props> = ({ cancel }) => {
    return (
        //tooltip is cauing trouble not allowing to click button as tooltip is visible, when the editable grid is there within table
        // <Tooltip
        //     title={translate('ra.action.cancel', {
        //         _: 'ra.action.cancel',
        //     })}
        // >
            <IconButton onClick={cancel} size="small">
                <CancelIcon />
            </IconButton>
        // </Tooltip>
    );
};

export interface Props {
    cancel?: () => void;
}

export default CancelEditButton;
