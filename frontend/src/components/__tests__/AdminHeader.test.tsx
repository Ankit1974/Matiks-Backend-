import React from 'react';
import { render } from '@testing-library/react-native';
import AdminHeader from '../AdminHeader';

describe('AdminHeader', () => {
    it('renders correctly with default props', () => {
        const { getByText } = render(<AdminHeader />);
        expect(getByText('Admin Panel')).toBeTruthy();
        expect(getByText('Test Real-time Rankings')).toBeTruthy();
    });

    it('renders correctly with custom props', () => {
        const { getByText } = render(
            <AdminHeader title="Custom Title" subtitle="Custom Subtitle" />
        );
        expect(getByText('Custom Title')).toBeTruthy();
        expect(getByText('Custom Subtitle')).toBeTruthy();
    });
});
