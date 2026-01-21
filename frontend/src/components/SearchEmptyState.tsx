import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/colors';

interface SearchEmptyStateProps {
    icon?: string;
    message?: string;
    hint?: string;
}

const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({
    icon = '🎯',
    message = 'Search for a player to see their rank',
    hint = 'Try searching for: user_1, user_100, etc.'
}) => {
    return (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>{icon}</Text>
            <Text style={styles.emptyStateText}>{message}</Text>
            <Text style={styles.emptyStateHint}>{hint}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    emptyStateHint: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textMuted,
        textAlign: 'center',
    },
});

export default SearchEmptyState;
