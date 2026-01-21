import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import BulkUpdateCard from '../BulkUpdateCard';
import { updateScores } from '../../services/api';
import { Alert } from 'react-native';

// Mock the API module
jest.mock('../../services/api', () => ({
    updateScores: jest.fn(),
}));

// Spy on Alert
jest.spyOn(Alert, 'alert');

describe('BulkUpdateCard', () => {
    it('renders correctly', () => {
        const { getByText } = render(<BulkUpdateCard />);
        expect(getByText('Bulk Random Update')).toBeTruthy();
        expect(getByText('Simulate Live Activity')).toBeTruthy();
    });

    it('calls updateScores and shows success alert on button press', async () => {
        (updateScores as jest.Mock).mockResolvedValue({
            updated_users: 5000,
            total_users: 10000,
        });

        const { getByText } = render(<BulkUpdateCard />);
        const button = getByText('Simulate Live Activity');

        await act(async () => {
            fireEvent.press(button);
        });

        expect(updateScores).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith(
            'Bulk Update Success',
            expect.stringContaining('Updated 5000 random users')
        );
    });
});
