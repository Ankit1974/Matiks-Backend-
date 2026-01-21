import React from 'react';
import { render } from '@testing-library/react-native';
import LeaderboardHeader from '../LeaderboardHeader';

describe('LeaderboardHeader', () => {
    it('renders correctly', () => {
        const { getByText } = render(<LeaderboardHeader />);
        expect(getByText('Leaderboard')).toBeTruthy();
    });
});
