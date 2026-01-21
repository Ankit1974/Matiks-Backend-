import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LeaderboardScreen from '../screens/Leaderboard/Leaderboard';
import SearchScreen from '../screens/Search/Search';
import AdminScreen from '../screens/Admin/Admin';
import { colors } from '../styles/colors';

export type RootTabParamList = {
    Leaderboard: undefined;
    Search: undefined;
    Admin: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator: React.FC = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            id="BottomTabs"
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopWidth: 0,
                    elevation: 10,
                    paddingTop: 8,
                    paddingBottom: insets.bottom > 0 ? insets.bottom - 4 : 8,
                    height: 60 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Text style={{ fontSize: 24 }}>{focused ? '🏆' : '🏅'}</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Text style={{ fontSize: 24 }}>{focused ? '🔍' : '🔎'}</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Admin"
                component={AdminScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Text style={{ fontSize: 24 }}>{focused ? '🕹️' : '⚙️'}</Text>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
