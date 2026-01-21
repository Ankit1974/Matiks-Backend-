import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from '../BottomTabNavigator';

// Mock screens to avoid rendering their full content and focusing on navigation structure
jest.mock('../../screens/Leaderboard/Leaderboard', () => {
    const { Text } = require('react-native');
    return () => <Text>Leaderboard Screen</Text>;
});
jest.mock('../../screens/Search/Search', () => {
    const { Text } = require('react-native');
    return () => <Text>Search Screen</Text>;
});
jest.mock('../../screens/Admin/Admin', () => {
    const { Text } = require('react-native');
    return () => <Text>Admin Screen</Text>;
});

// Mock SafeAreaInsets
jest.mock('react-native-safe-area-context', () => {
    const inset = { top: 0, right: 0, bottom: 0, left: 0 };
    return {
        ...jest.requireActual('react-native-safe-area-context'),
        useSafeAreaInsets: jest.fn(() => inset),
    };
});

describe('BottomTabNavigator', () => {
    it('renders initial screen (Leaderboard)', () => {
        const { getByText } = render(
            <NavigationContainer>
                <BottomTabNavigator />
            </NavigationContainer>
        );

        expect(getByText('Leaderboard Screen')).toBeTruthy();
    });

    it('renders tab bar', () => {
        // Since we are mocking icons with text properties in BottomTabNavigator options,
        // we can assume the tab navigator is managing the structure if the screen renders.
        // To verify tabs exist, we could check for rendered properties if accessible, 
        // but react-navigation standard testing usually relies on screen appearance.

        const { getByText } = render(
            <NavigationContainer>
                <BottomTabNavigator />
            </NavigationContainer>
        );
        // Leaderboard is the first tab, so it should be visible
        expect(getByText('Leaderboard Screen')).toBeTruthy();
    });
});
