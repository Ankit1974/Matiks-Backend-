import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserByUsername, UserWithRank } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import SearchResult from '../../components/SearchResult';
import SearchHeader from '../../components/SearchHeader';
import SearchEmptyState from '../../components/SearchEmptyState';
import SearchLoading from '../../components/SearchLoading';
import SearchError from '../../components/SearchError';
import { colors } from '../../styles/colors';
import styles from './styles';

const SearchScreen: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [user, setUser] = useState<UserWithRank | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Search 
    const handleSearch = async () => {
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setUser(null);

            const userData = await getUserByUsername(username);
            setUser(userData);
        } catch (err: any) {
            setError(err.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[colors.background, colors.backgroundLight]}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <SearchHeader />

                    <SearchBar
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setError(null);
                        }}
                        onSearch={handleSearch}
                        loading={loading}
                    />

                    {loading &&
                        <SearchLoading />
                    }

                    {error && !loading &&
                        <SearchError message={error} />
                    }

                    {/* Result */}
                    {user && !loading && (
                        <SearchResult user={user} />
                    )}

                    {!user && !loading && !error && (
                        <SearchEmptyState />
                    )}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default SearchScreen;
