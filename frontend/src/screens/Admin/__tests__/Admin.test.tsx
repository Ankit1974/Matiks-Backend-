import React from 'react';
import { render } from '@testing-library/react-native';
import AdminScreen from '../Admin';

// Mock child components to isolate screen testing
jest.mock('../../../components/AdminHeader', () => {
    const { Text } = require('react-native');
    return () => <Text>AdminHeader</Text>;
});
jest.mock('../../../components/SingleUpdateCard', () => {
    const { Text } = require('react-native');
    return () => <Text>SingleUpdateCard</Text>;
});
jest.mock('../../../components/BulkUpdateCard', () => {
    const { Text } = require('react-native');
    return () => <Text>BulkUpdateCard</Text>;
});

describe('AdminScreen', () => {
    it('renders all sections correctly', () => {
        const { getByText } = render(<AdminScreen />);

        expect(getByText('AdminHeader')).toBeTruthy();
        expect(getByText('SingleUpdateCard')).toBeTruthy();
        expect(getByText('BulkUpdateCard')).toBeTruthy();
    });
});
