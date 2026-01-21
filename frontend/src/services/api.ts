import axios from 'axios';
import { Platform } from 'react-native';

export interface User {
    id: string;
    username: string;
    rating: number;
}

export interface UserWithRank {
    rank: number;
    username: string;
    rating: number;
}

export interface LeaderboardResponse {
    users: UserWithRank[];
}

export interface UpdateScoreResponse {
    message: string;
    updated_users: number;
    total_users: number;
}

export interface UpdateUserScoreResponse {
    message: string;
    user: UserWithRank;
}

// Backend API base URL
const getBaseURL = (): string => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8080';
    }
    return 'http://localhost:8080';
};

const API_BASE_URL = getBaseURL();

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        const status = error.response?.status;

        // error handling based on status or message
        if (status === 404) {
            return Promise.reject(new Error(message || 'Resource not found'));
        }

        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Request timed out. Please try again.'));
        }

        if (!error.response) {
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        return Promise.reject(new Error(message));
    }
);

/**
 * Get users from the leaderboard with pagination support
 */
export const getLeaderboard = async (limit: number = 80, offset: number = 0): Promise<UserWithRank[]> => {
    const response = await apiClient.get<LeaderboardResponse>(`/leaderboard?limit=${limit}&offset=${offset}`);
    return response.data.users || [];
};

/**
 * Get a specific user's rank and details
 */
export const getUserByUsername = async (username: string): Promise<UserWithRank> => {
    if (!username || username.trim() === '') {
        throw new Error('Username cannot be empty');
    }

    const response = await apiClient.get<UserWithRank>(`/user/${username.trim()}`);
    return response.data;
};

/**
 * Trigger random score updates on the backend
 */
export const updateScores = async (): Promise<UpdateScoreResponse> => {
    const response = await apiClient.post<UpdateScoreResponse>('/update-score');
    return response.data;
};

/**
 * Update a specific user's rating
 */
export const updateUserScore = async (username: string, rating: number): Promise<UpdateUserScoreResponse> => {
    const response = await apiClient.post<UpdateUserScoreResponse>('/update-user-score', {
        username,
        rating
    });
    return response.data;
};

export default apiClient;
