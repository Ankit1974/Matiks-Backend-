import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/colors';
import { UserWithRank } from '../services/api';

interface LeaderboardPodiumProps {
    topThree: UserWithRank[];
}

const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ topThree }) => {
    // Top 3 order: [2nd, 1st, 3rd]
    const podiumArr = [
        topThree.find(u => u.rank === 2),
        topThree.find(u => u.rank === 1),
        topThree.find(u => u.rank === 3),
    ];

    return (
        <View style={styles.container}>
            <View style={styles.podiumWrapper}>
                {podiumArr.map((user, index) => {
                    const isFirst = user?.rank === 1;
                    const isSecond = user?.rank === 2;
                    const isThird = user?.rank === 3;

                    return (
                        <View key={index} style={[styles.column, isFirst && styles.firstColumn]}>
                            {user && (
                                <View style={styles.userWrapper}>
                                    <View style={[
                                        styles.avatarContainer,
                                        isFirst && styles.firstAvatar,
                                        isSecond && styles.secondAvatar,
                                        isThird && styles.thirdAvatar,
                                    ]}>
                                        <View style={styles.avatarPlaceholder}>
                                            <Text style={styles.avatarInitial}>
                                                {user.username.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={styles.username} numberOfLines={1}>
                                        {user.username}
                                    </Text>
                                    <Text style={styles.score}>
                                        {user.rating}
                                    </Text>
                                </View>
                            )}

                            <View style={[
                                styles.step,
                                isFirst && styles.firstStep,
                                isSecond && styles.secondStep,
                                isThird && styles.thirdStep,
                                !user && styles.emptyStep
                            ]}>
                                <Text style={[
                                    styles.rankText,
                                    isFirst && styles.firstRankText,
                                    isSecond && styles.secondRankText,
                                    isThird && styles.thirdRankText,
                                ]}>
                                    {isFirst ? '1' : isSecond ? '2' : '3'}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 300,
        marginVertical: spacing.xl,
        justifyContent: 'flex-end',
    },
    podiumWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
    },
    column: {
        alignItems: 'center',
        width: '30%',
    },
    firstColumn: {
        width: '35%',
        zIndex: 1,
    },
    userWrapper: {
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: 'transparent',
        padding: 2,
        marginBottom: spacing.xs,
        overflow: 'hidden',
    },
    firstAvatar: { width: 80, height: 80, borderRadius: 40, borderColor: colors.gold },
    secondAvatar: { borderColor: colors.silver },
    thirdAvatar: { borderColor: colors.bronze },
    avatarPlaceholder: {
        flex: 1,
        borderRadius: 40,
        backgroundColor: colors.cardLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    username: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
    },
    score: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    step: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: borderRadius.sm,
        borderTopRightRadius: borderRadius.sm,
        ...shadows.medium,
    },
    firstStep: {
        height: 150,
        backgroundColor: colors.gold,
        opacity: 0.8,
    },
    secondStep: {
        height: 100,
        backgroundColor: colors.silver,
        opacity: 0.6,
    },
    thirdStep: {
        height: 80,
        backgroundColor: colors.bronze,
        opacity: 0.6,
    },
    emptyStep: {
        opacity: 0.1,
    },
    rankText: {
        fontSize: 60,
        fontWeight: '800',
    },
    firstRankText: { color: colors.background, opacity: 0.9 },
    secondRankText: { color: colors.background, opacity: 0.9 },
    thirdRankText: { color: colors.background, opacity: 0.9 },
});

export default LeaderboardPodium;
