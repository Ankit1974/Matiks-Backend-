import React, { useState, useEffect, useCallback } from 'react';
import {
    Text,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { getLeaderboard, UserWithRank } from '../../services/api';
import UserCard from '../../components/UserCard';
import LeaderboardHeader from '../../components/LeaderboardHeader';
import LeaderboardPodium from '../../components/LeaderboardPodium';
import { colors } from '../../styles/colors';
import styles from './styles';

const PAGE_SIZE = 50;

const LeaderboardScreen: React.FC = () => {
    const [users, setUsers] = useState<UserWithRank[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch leaderboard data
    const fetchLeaderboard = async (isInitial = true) => {
        try {
            if (isInitial) {
                if (users.length === 0) setLoading(true);
                setHasMore(true);
            } else {
                setLoadingMore(true);
            }

            setError(null);

            const currentOffset = isInitial ? 0 : users.length;
            const data = await getLeaderboard(PAGE_SIZE, currentOffset);

            if (data.length < PAGE_SIZE) {
                setHasMore(false);
            }

            if (isInitial) {
                setUsers(data);
            } else {
                setUsers(prev => [...prev, ...data]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
            setLoadingMore(false);
        }
    };

    /* Handle refresh */
    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaderboard(true);
    };

    /* Handle load more */
    const handleLoadMore = () => {
        if (!loadingMore && hasMore && !loading && !refreshing) {
            fetchLeaderboard(false);
        }
    };


    /* Handle auto refresh on focus and polling */
    useFocusEffect(
        useCallback(() => {
            fetchLeaderboard(true);

            // polling on every 5 seconds
            const interval = setInterval(() => {
                fetchLeaderboard(true);
            }, 5000);

            return () => clearInterval(interval);
        }, [])
    );

    const topThree = users.filter(u => u.rank <= 3);
    const remainingUsers = users.filter(u => u.rank > 3);

    if (loading && users.length === 0) {
        return (
            <LinearGradient
                colors={[colors.background, colors.backgroundLight]}
                style={styles.container}
            >
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading leaderboard...</Text>
            </LinearGradient>
        );
    }


    if (error && users.length === 0) {
        return (
            <LinearGradient
                colors={[colors.background, colors.backgroundLight]}
                style={styles.container}
            >
                <Text style={styles.errorText}>⚠️ {error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => fetchLeaderboard(true)}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <ActivityIndicator
                style={{ marginVertical: 30 }}
                color={colors.secondary}
            />
        );
    };

    return (
        <LinearGradient
            colors={[colors.background, colors.background]}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <LeaderboardHeader />

                <FlashList
                    data={remainingUsers}
                    ListHeaderComponent={<LeaderboardPodium topThree={topThree} />}
                    keyExtractor={(item) => `${item.username}-${item.rank}`}
                    renderItem={({ item }) => (
                        <UserCard
                            rank={item.rank}
                            username={item.username}
                            rating={item.rating}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.secondary}
                            colors={[colors.secondary]}
                        />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default LeaderboardScreen;
