import React from 'react';
import { render } from '@testing-library/react-native';
import SearchError from '../SearchError';

describe('SearchError', () => {
    it('renders with error message', () => {
        const { getByText } = render(<SearchError message="User not found" />);
        expect(getByText('⚠️ User not found')).toBeTruthy();
    });
});
