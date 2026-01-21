import React from 'react';
import { render } from '@testing-library/react-native';
import UserCard from '../UserCard';

describe('UserCard', () => {
    it('renders user details correctly', () => {
        const { getByText } = render(
            <UserCard rank={5} username="test_user" rating={1500} />
        );
        expect(getByText('5')).toBeTruthy();
        expect(getByText('test_user')).toBeTruthy();
        expect(getByText('1500')).toBeTruthy();
        expect(getByText('T')).toBeTruthy(); // Avatar initial
    });
});
