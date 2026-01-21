import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/colors';

interface SearchErrorProps {
    message: string;
}

const SearchError: React.FC<SearchErrorProps> = ({ message }) => {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    errorContainer: {
        marginHorizontal: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        borderLeftWidth: 4,
        borderLeftColor: colors.error,
    },
    errorText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.error,
    },
});

export default SearchError;
