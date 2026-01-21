import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/colors';

interface SearchLoadingProps {
    message?: string;
}

const SearchLoading: React.FC<SearchLoadingProps> = ({
    message = 'Searching...'
}) => {
    return (
        <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    centerContent: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: spacing.md,
    },
});

export default SearchLoading;
