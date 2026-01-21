import React from 'react';
import { render } from '@testing-library/react-native';
import AppNavigator from '../AppNavigator';

// Mock BottomTabNavigator to test AppNavigator in isolation
jest.mock('../BottomTabNavigator', () => {
    const { Text } = require('react-native');
    return () => <Text>BottomTabNavigator</Text>;
});

describe('AppNavigator', () => {
    it('renders correctly', () => {
        const { getByText } = render(<AppNavigator />);
        expect(getByText('BottomTabNavigator')).toBeTruthy();
    });
});
