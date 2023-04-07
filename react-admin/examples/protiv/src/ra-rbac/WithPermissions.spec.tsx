import * as React from 'react';
import { render, act } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import * as stories from '../stories/3-WithPermissions.stories';
import { NUMBER } from '../utils/Constants/MagicNumber';

const { Basic, NoAccess, AdminAccess, AdditionalProps } =
    composeStories(stories);

describe('WithPermissions', () => {
    it('does not render children on mount', () => {
        const { queryAllByText } = render(<Basic />);
        expect(queryAllByText('Allowed')).toHaveLength(0);
    });

    it('returns children when the user has role or permission for the resource and action', async () => {
        const { queryAllByText } = render(<Basic />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, NUMBER.FOUR_HUNDRED_TEN));
        });
        expect(queryAllByText('Allowed')).toHaveLength(NUMBER.TWO);
    });

    it('does not render children when the user has no permissions', async () => {
        const { queryAllByText } = render(<NoAccess />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, NUMBER.TWO_HUNDRED_TEN));
        });
        expect(queryAllByText('Allowed')).toHaveLength(0);
    });

    it('renders children when the user has wildcard permissions', async () => {
        const { queryAllByText } = render(<AdminAccess />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, NUMBER.TWO_HUNDRED_TEN));
        });
        expect(queryAllByText('Allowed')).toHaveLength(NUMBER.THREE);
    });

    it('passes additional props down to the children', async () => {
        const { queryByText } = render(<AdditionalProps />);
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, NUMBER.TWO_HUNDRED_TEN));
        });
        expect(queryByText('John')).not.toBeNull();
        expect(queryByText('34')).not.toBeNull();
        expect(queryByText('read')).toBeNull();
        expect(queryByText('bar')).toBeNull();
    });
});
