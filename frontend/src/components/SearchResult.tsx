import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RankBadge from './RankBadge';
import { UserWithRank } from '../services/api';
import { colors, spacing, borderRadius, shadows } from '../styles/colors';

interface SearchResultProps {
    user: UserWithRank;
}

const SearchResult: React.FC<SearchResultProps> = ({ user }) => {
    const getStatusMessage = () => {
        if (user.rank === 1) return "🎉 Champion! You're #1!";
        if (user.rank <= 10) return "🔥 Top 10 Player!";
        if (user.rank <= 100) return "💪 Top 100 Player!";
        return "🎮 Keep climbing!";
    };

    return (
        <View style={styles.resultContainer}>
            <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.resultCard}
            >
                <View style={styles.resultHeader}>
                    <RankBadge rank={user.rank} size="large" />
                    <View style={styles.resultInfo}>
                        <Text style={styles.resultLabel}>Global Rank</Text>
                        <Text style={styles.resultRank}>#{user.rank}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Username</Text>
                    <Text style={styles.detailValue}>{user.username}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Rating</Text>
                    <Text style={styles.detailValue}>
                        ⭐ {user.rating.toLocaleString()} pts
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>{getStatusMessage()}</Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    resultContainer: {
        marginTop: spacing.md,
    },
    resultCard: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        ...shadows.large,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    resultInfo: {
        marginLeft: spacing.md,
        flex: 1,
    },
    resultLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        opacity: 0.8,
        marginBottom: spacing.xs,
    },
    resultRank: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: colors.text,
        opacity: 0.2,
        marginVertical: spacing.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        opacity: 0.8,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
    statsContainer: {
        marginTop: spacing.md,
        padding: spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    statsText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text,
    },
});

export default SearchResult;
