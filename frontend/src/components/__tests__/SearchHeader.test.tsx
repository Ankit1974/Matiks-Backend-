import React from 'react';
import { render } from '@testing-library/react-native';
import SearchHeader from '../SearchHeader';

describe('SearchHeader', () => {
    it('renders with default props', () => {
        const { getByText } = render(<SearchHeader />);
        expect(getByText('🔍 Search Player')).toBeTruthy();
        expect(getByText("Find any player's rank")).toBeTruthy();
    });

    it('renders with custom title and subtitle', () => {
        const { getByText } = render(
            <SearchHeader title="Custom Search" subtitle="Custom Subtitle" />
        );
        expect(getByText('Custom Search')).toBeTruthy();
        expect(getByText('Custom Subtitle')).toBeTruthy();
    });
});
