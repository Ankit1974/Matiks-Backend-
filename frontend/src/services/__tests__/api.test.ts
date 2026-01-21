
import axios from 'axios';
// We must mock axios BEFORE importing the service that uses it
jest.mock('axios', () => {
    const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        interceptors: {
            response: {
                use: jest.fn(),
            },
        },
    };
    return {
        create: jest.fn(() => mockAxiosInstance),
    };
});

import { getLeaderboard, getUserByUsername, updateScores, updateUserScore } from '../api';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
    let mockApiClient: any;

    beforeAll(() => {
        // Retrieve the mock instance returned by the first call to create()
        // api.ts calls axios.create() at the top level, so it should be the first call.
        mockApiClient = (mockedAxios.create as jest.Mock).mock.results[0].value;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getLeaderboard', () => {
        it('fetches leaderboard data successfully', async () => {
            const mockUsers = [{ rank: 1, username: 'test', rating: 1000 }];
            mockApiClient.get.mockResolvedValue({ data: { users: mockUsers } });

            const result = await getLeaderboard(50, 0);
            expect(result).toEqual(mockUsers);
            expect(mockApiClient.get).toHaveBeenCalledWith('/leaderboard?limit=50&offset=0');
        });

        it('returns empty array if no users', async () => {
            mockApiClient.get.mockResolvedValue({ data: {} });
            const result = await getLeaderboard();
            expect(result).toEqual([]);
        });
    });

    describe('getUserByUsername', () => {
        it('fetches user details successfully', async () => {
            const mockUser = { rank: 1, username: 'test', rating: 1000 };
            mockApiClient.get.mockResolvedValue({ data: mockUser });

            const result = await getUserByUsername('test');
            expect(result).toEqual(mockUser);
            expect(mockApiClient.get).toHaveBeenCalledWith('/user/test');
        });

        it('throws error for empty username', async () => {
            await expect(getUserByUsername('')).rejects.toThrow('Username cannot be empty');
        });
    });

    describe('updateScores', () => {
        it('calls update-score endpoint', async () => {
            const mockResponse = { message: 'Updated', updated_users: 10, total_users: 100 };
            mockApiClient.post.mockResolvedValue({ data: mockResponse });

            const result = await updateScores();
            expect(result).toEqual(mockResponse);
            expect(mockApiClient.post).toHaveBeenCalledWith('/update-score');
        });
    });

    describe('updateUserScore', () => {
        it('calls update-user-score endpoint', async () => {
            const mockResponse = { message: 'Updated', user: { rank: 1 } };
            mockApiClient.post.mockResolvedValue({ data: mockResponse });

            const result = await updateUserScore('test', 1500);
            expect(result).toEqual(mockResponse);
            expect(mockApiClient.post).toHaveBeenCalledWith('/update-user-score', {
                username: 'test',
                rating: 1500,
            });
        });
    });
});
