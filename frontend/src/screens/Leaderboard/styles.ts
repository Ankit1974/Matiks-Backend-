import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../styles/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 100, // Room for current rank bar
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
    errorText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.error,
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },
    retryButton: {
        backgroundColor: colors.secondary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        marginTop: spacing.lg,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
});

export default styles;
