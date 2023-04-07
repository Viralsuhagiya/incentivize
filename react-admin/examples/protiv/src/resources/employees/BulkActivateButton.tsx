import * as React from 'react';
import PropTypes from 'prop-types';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { styled } from '@mui/material/styles';

import {
    Button,
    BulkActionProps,
    useUnselectAll
} from 'react-admin';
import useActivateEmployee from './useUnarchiveEmployee';

const PREFIX = 'RaBulkActivateButton';

export const BulkActivateButtonClasses = {
    activateButton: `${PREFIX}-activateButton`,
};

const StyledButton = styled(Button, { name: PREFIX })(({ theme }) => ({
}));

const BulkActivateButton = (props: BulkActionProps) => {
    const { selectedIds } = props
    const unselectAll = useUnselectAll('employees');
    const {activate, loading}  = useActivateEmployee({selectedIds, onSuccess:unselectAll});

    return (
        <StyledButton
            label="resources.employees.action.activate"
            onClick={() => activate()}
            className={BulkActivateButtonClasses.activateButton}
            disabled={loading}
        >
            <UnarchiveIcon />
        </StyledButton>
    );
};

BulkActivateButton.propTypes = {
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BulkActivateButton;
