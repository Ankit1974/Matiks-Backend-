import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import SingleUpdateCard from '../SingleUpdateCard';
import { updateUserScore } from '../../services/api';
import { Alert } from 'react-native';

jest.mock('../../services/api', () => ({
    updateUserScore: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('SingleUpdateCard', () => {
    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<SingleUpdateCard />);
        expect(getByText('Update User Rating')).toBeTruthy();
        expect(getByPlaceholderText('e.g. user_500')).toBeTruthy();
        expect(getByPlaceholderText('e.g. 4500')).toBeTruthy();
    });

    it('shows error if inputs are empty', async () => {
        const { getByText } = render(<SingleUpdateCard />);
        fireEvent.press(getByText('Update Specific User'));
        expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a username');
    });

    it('calls updateUserScore on valid input', async () => {
        (updateUserScore as jest.Mock).mockResolvedValue({
            user: { username: 'test_user', rank: 10 },
        });

        const { getByText, getByPlaceholderText } = render(<SingleUpdateCard />);

        fireEvent.changeText(getByPlaceholderText('e.g. user_500'), 'test_user');
        fireEvent.changeText(getByPlaceholderText('e.g. 4500'), '1500');

        await act(async () => {
            fireEvent.press(getByText('Update Specific User'));
        });

        expect(updateUserScore).toHaveBeenCalledWith('test_user', 1500);
        expect(Alert.alert).toHaveBeenCalledWith(
            'Success',
            expect.stringContaining('Updated test_user')
        );
    });
});
