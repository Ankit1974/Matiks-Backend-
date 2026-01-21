import React from 'react';
import { render } from '@testing-library/react-native';
import SearchEmptyState from '../SearchEmptyState';

describe('SearchEmptyState', () => {
    it('renders with default props', () => {
        const { getByText } = render(<SearchEmptyState />);
        expect(getByText('Search for a player to see their rank')).toBeTruthy();
        expect(getByText('Try searching for: user_1, user_100, etc.')).toBeTruthy();
    });

    it('renders with custom message and hint', () => {
        const { getByText } = render(
            <SearchEmptyState message="No results found" hint="Try a different query" />
        );
        expect(getByText('No results found')).toBeTruthy();
        expect(getByText('Try a different query')).toBeTruthy();
    });
});
