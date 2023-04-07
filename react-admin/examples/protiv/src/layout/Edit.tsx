import * as React from 'react';
import { ReactElement } from 'react';
import {
    EditProps,
    Edit as RaEdit
} from 'react-admin';
import {Title} from './Title';
import { styled } from '@mui/material/styles';

export const Edit = (props: EditProps & { children: ReactElement }): ReactElement => (
    <StyledEdit title={<Title />} {...props} />
);
const StyledEdit = styled(RaEdit)({
    [`& .RaEdit-noActions`]: { 'margin-top': '0px' }
});
