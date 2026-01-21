import React from 'react';
import { render } from '@testing-library/react-native';
import SearchResult from '../SearchResult';

describe('SearchResult', () => {
    const mockUser = {
        rank: 1,
        username: 'champion_user',
        rating: 5000,
    };

    it('renders user details correctly', () => {
        const { getByText } = render(<SearchResult user={mockUser} />);
        expect(getByText('#1')).toBeTruthy();
        expect(getByText('champion_user')).toBeTruthy();
        expect(getByText('⭐ 5,000 pts')).toBeTruthy();
    });

    it('displays correct status message for rank 1', () => {
        const { getByText } = render(<SearchResult user={mockUser} />);
        expect(getByText("🎉 Champion! You're #1!")).toBeTruthy();
    });
});
