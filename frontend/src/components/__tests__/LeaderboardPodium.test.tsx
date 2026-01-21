import React from 'react';
import { render } from '@testing-library/react-native';
import LeaderboardPodium from '../LeaderboardPodium';

describe('LeaderboardPodium', () => {
    const mockTopThree = [
        { rank: 1, username: 'gold_user', rating: 5000 },
        { rank: 2, username: 'silver_user', rating: 4000 },
        { rank: 3, username: 'bronze_user', rating: 3000 },
    ];

    it('renders top 3 users correctly', () => {
        const { getByText } = render(<LeaderboardPodium topThree={mockTopThree} />);

        expect(getByText('gold_user')).toBeTruthy();
        expect(getByText('5000')).toBeTruthy();
        expect(getByText('1')).toBeTruthy(); // Rank 1

        expect(getByText('silver_user')).toBeTruthy();
        expect(getByText('4000')).toBeTruthy();
        expect(getByText('2')).toBeTruthy(); // Rank 2

        expect(getByText('bronze_user')).toBeTruthy();
        expect(getByText('3000')).toBeTruthy();
        expect(getByText('3')).toBeTruthy(); // Rank 3
    });

    it('renders gracefully with fewer than 3 users', () => {
        const partialUsers = [
            { rank: 1, username: 'gold_user', rating: 5000 },
        ];
        const { getByText, queryByText } = render(<LeaderboardPodium topThree={partialUsers} />);

        expect(getByText('gold_user')).toBeTruthy();
        expect(queryByText('silver_user')).toBeNull();
    });
});
