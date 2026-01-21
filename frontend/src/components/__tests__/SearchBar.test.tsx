import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(
            <SearchBar value="" onChangeText={() => { }} onSearch={() => { }} />
        );
        expect(getByPlaceholderText('Enter username (e.g., user_1)')).toBeTruthy();
        expect(getByText('Search')).toBeTruthy();
    });

    it('calls onChangeText when text changes', () => {
        const onChangeTextMock = jest.fn();
        const { getByPlaceholderText } = render(
            <SearchBar value="" onChangeText={onChangeTextMock} onSearch={() => { }} />
        );
        fireEvent.changeText(getByPlaceholderText('Enter username (e.g., user_1)'), 'test_user');
        expect(onChangeTextMock).toHaveBeenCalledWith('test_user');
    });

    it('calls onSearch when button is pressed', () => {
        const onSearchMock = jest.fn();
        const { getByText } = render(
            <SearchBar value="test" onChangeText={() => { }} onSearch={onSearchMock} />
        );
        fireEvent.press(getByText('Search'));
        expect(onSearchMock).toHaveBeenCalled();
    });

    it('displays loading state', () => {
        const { getByText } = render(
            <SearchBar value="test" onChangeText={() => { }} onSearch={() => { }} loading={true} />
        );
        expect(getByText('Searching...')).toBeTruthy();
    });
});
