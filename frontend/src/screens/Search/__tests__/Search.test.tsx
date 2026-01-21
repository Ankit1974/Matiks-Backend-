import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SearchScreen from '../Search';
import { getUserByUsername } from '../../../services/api';

jest.mock('../../../services/api', () => ({
    getUserByUsername: jest.fn(),
}));

describe('SearchScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders search bar and empty state initially', () => {
        const { getByPlaceholderText, getByText } = render(<SearchScreen />);
        expect(getByPlaceholderText('Enter username (e.g., user_1)')).toBeTruthy(); // From SearchBar
        expect(getByText('Search for a player to see their rank')).toBeTruthy(); // From SearchEmptyState
    });

    it('shows error if search is empty', () => {
        const { getByText } = render(<SearchScreen />);
        fireEvent.press(getByText('Search'));
        expect(getByText('⚠️ Please enter a username')).toBeTruthy();
    });

    it('displays loading state during search', async () => {
        (getUserByUsername as jest.Mock).mockImplementation(() => new Promise(() => { }));
        const { getAllByText, getByPlaceholderText, getByText } = render(<SearchScreen />);

        fireEvent.changeText(getByPlaceholderText('Enter username (e.g., user_1)'), 'valid_user');
        fireEvent.press(getByText('Search'));

        expect(getAllByText('Searching...').length).toBeGreaterThan(0);
    });

    it('displays user result on success', async () => {
        const mockUser = { rank: 1, username: 'valid_user', rating: 5000 };
        (getUserByUsername as jest.Mock).mockResolvedValue(mockUser);

        const { getByText, getByPlaceholderText, findByText } = render(<SearchScreen />);

        fireEvent.changeText(getByPlaceholderText('Enter username (e.g., user_1)'), 'valid_user');
        fireEvent.press(getByText('Search'));

        const result = await findByText('valid_user');
        expect(result).toBeTruthy();
        expect(getByText("🎉 Champion! You're #1!")).toBeTruthy(); // From SearchResult
    });

    it('displays error on failure', async () => {
        (getUserByUsername as jest.Mock).mockRejectedValue(new Error('User not found'));

        const { getByText, getByPlaceholderText, findByText } = render(<SearchScreen />);

        fireEvent.changeText(getByPlaceholderText('Enter username (e.g., user_1)'), 'invalid_user');
        fireEvent.press(getByText('Search'));

        const errorMsg = await findByText('⚠️ User not found');
        expect(errorMsg).toBeTruthy();
    });
});
