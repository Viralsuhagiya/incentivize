import * as React from 'react';
import { render, act } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from '../stories/2-useCanAccess.stories';
import { NUMBER } from '../utils/Constants/MagicNumber';

const { Basic, NoAccess, AdminAccess } = composeStories(stories);

describe('useCanAccess', () => {
    it('returns loading on mount', () => {
        const { queryAllByText } = render(<Basic />);
        expect(queryAllByText('Loading')).toHaveLength(NUMBER.THREE);
    });

    it('returns true when the user has role or permission for the resource and action', async () => {
        const { queryAllByText } = render(<Basic />);
        expect(queryAllByText('Loading')).toHaveLength(NUMBER.THREE);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, NUMBER.FOUR_HUNDRED_TWENTY));
        });
        expect(queryAllByText('Loading')).toHaveLength(0);
        expect(queryAllByText('Allowed')).toHaveLength(NUMBER.TWO);
        expect(queryAllByText('Restricted')).toHaveLength(1);
    });

    it('returns false when the user has no permissions', async () => {
        const { queryAllByText } = render(<NoAccess />);
        expect(queryAllByText('Loading')).toHaveLength(NUMBER.THREE);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, NUMBER.TWO_HUNDRED_TEN));
        });
        expect(queryAllByText('Loading')).toHaveLength(0);
        expect(queryAllByText('Restricted')).toHaveLength(NUMBER.THREE);
    });

    it('returns true when the user has wildcard permissions', async () => {
        const { queryAllByText } = render(<AdminAccess />);
        expect(queryAllByText('Loading')).toHaveLength(NUMBER.THREE);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, NUMBER.TWO_HUNDRED_TEN));
        });
        expect(queryAllByText('Loading')).toHaveLength(0);
        expect(queryAllByText('Allowed')).toHaveLength(NUMBER.THREE);
    });
});
