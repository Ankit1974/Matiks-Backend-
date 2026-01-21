import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/colors';

interface UserCardProps {
    rank: number;
    username: string;
    rating: number;
}

const UserCard: React.FC<UserCardProps> = ({ rank, username, rating }) => {
    return (
        <View style={styles.card}>
            <View style={styles.leftSection}>
                <Text style={styles.rank}>{rank}</Text>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.username}>{username}</Text>
            </View>
            <Text style={styles.score}>{rating}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardLight + '20',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rank: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textSecondary,
        minWidth: 40,
        marginRight: spacing.sm,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.cardLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textSecondary,
    },
    username: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    score: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textSecondary,
    },
});

export default UserCard;
