import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import LeaderboardScreen from '../Leaderboard';
import { getLeaderboard } from '../../../services/api';

jest.mock('../../../services/api', () => ({
    getLeaderboard: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
    useFocusEffect: jest.fn((effect) => {
        require('react').useEffect(effect, []);
    }),
    useNavigation: jest.fn(),
}));

// Mock child components to simplify testing
jest.mock('../../../components/UserCard', () => {
    const { Text } = require('react-native');
    return ({ username, rank, rating }: any) => <Text>{`${username} - #${rank} - ${rating}`}</Text>;
});

describe('LeaderboardScreen', () => {
    const mockUsers = [
        { rank: 1, username: 'user1', rating: 5000 },
        { rank: 2, username: 'user2', rating: 4000 },
        { rank: 3, username: 'user3', rating: 3000 },
        { rank: 4, username: 'user4', rating: 2000 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        (getLeaderboard as jest.Mock).mockImplementation(() => new Promise(() => { })); // Never resolves
        const { getByText } = render(<LeaderboardScreen />);
        expect(getByText('Loading leaderboard...')).toBeTruthy();
    });

    it('renders leaderboard data correctly', async () => {
        (getLeaderboard as jest.Mock).mockResolvedValue(mockUsers);

        const { getByText } = render(<LeaderboardScreen />);

        await waitFor(() => {
            expect(getByText('user4 - #4 - 2000')).toBeTruthy();
        });
    });

    it('handles error and retry', async () => {
        (getLeaderboard as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const { getByText } = render(<LeaderboardScreen />);

        await waitFor(() => {
            expect(getByText('⚠️ Network error')).toBeTruthy();
        });

        // Retry
        (getLeaderboard as jest.Mock).mockResolvedValue(mockUsers);
        fireEvent.press(getByText('Retry'));

        await waitFor(() => {
            expect(getByText('user4 - #4 - 2000')).toBeTruthy();
        });
    });
});
