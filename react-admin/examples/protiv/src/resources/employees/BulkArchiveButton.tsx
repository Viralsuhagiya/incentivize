import * as React from 'react';
import PropTypes from 'prop-types';
import ArchiveIcon from '@mui/icons-material/Archive';
import { styled, alpha } from '@mui/material/styles';

import {
    Button,
    BulkActionProps,
    useUnselectAll
} from 'react-admin';
import useArchiveEmployee from './useArchiveEmployee';
import { NUMBER } from '../../utils/Constants/MagicNumber';

const PREFIX = 'RaBulkArchiveButton';

export const BulkArchiveButtonClasses = {
    archiveButton: `${PREFIX}-archiveButton`,
};

const StyledButton = styled(Button, { name: PREFIX })(({ theme }) => ({
    [`&.${BulkArchiveButtonClasses.archiveButton}`]: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, NUMBER.ZERO_POINT_ONE_TWO),
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));

const BulkArchiveButton = (props: BulkActionProps) => {
    const { selectedIds } = props
    const unselectAll = useUnselectAll('employees');
    const {archive, loading}  = useArchiveEmployee({selectedIds, onSuccess:unselectAll});

    return (
        <StyledButton
            label="resources.employees.action.archive"
            onClick={() => archive()}
            className={BulkArchiveButtonClasses.archiveButton}
            disabled={loading}
        >
            <ArchiveIcon />
        </StyledButton>
    );
};

BulkArchiveButton.propTypes = {
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default BulkArchiveButton;
