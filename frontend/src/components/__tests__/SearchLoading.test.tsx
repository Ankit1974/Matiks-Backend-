import React from 'react';
import { render } from '@testing-library/react-native';
import SearchLoading from '../SearchLoading';

describe('SearchLoading', () => {
    it('renders with default message', () => {
        const { getByText } = render(<SearchLoading />);
        expect(getByText('Searching...')).toBeTruthy();
    });

    it('renders with custom message', () => {
        const { getByText } = render(<SearchLoading message="Loading data..." />)
        expect(getByText('Loading data...')).toBeTruthy();
    });
});
