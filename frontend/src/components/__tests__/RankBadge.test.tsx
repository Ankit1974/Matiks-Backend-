import React from 'react';
import { render } from '@testing-library/react-native';
import RankBadge from '../RankBadge';

describe('RankBadge', () => {
    it('renders top 3 rank with special styling', () => {
        const { getByText } = render(<RankBadge rank={1} />);
        expect(getByText('1')).toBeTruthy();
    });

    it('renders standard rank correctly', () => {
        const { getByText } = render(<RankBadge rank={4} />);
        expect(getByText('4')).toBeTruthy();
    });

    it('renders with different sizes', () => {
        const { getByText } = render(<RankBadge rank={10} size="small" />);
        expect(getByText('10')).toBeTruthy();
    });
});
