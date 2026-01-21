import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../styles/colors';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onSearch: () => void;
    loading?: boolean;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onSearch,
    loading = false,
    placeholder = "Enter username (e.g., user_1)"
}) => {
    return (
        <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    onSubmitEditing={onSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>

            <TouchableOpacity
                style={[styles.searchButton, loading && styles.searchButtonDisabled]}
                onPress={onSearch}
                disabled={loading}
            >
                <Text style={styles.searchButtonText}>
                    {loading ? 'Searching...' : 'Search'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        marginBottom: spacing.lg,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
        ...shadows.small,
    },
    inputIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        paddingVertical: spacing.md,
    },
    searchButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    searchButtonDisabled: {
        opacity: 0.6,
    },
    searchButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text,
    },
});

export default SearchBar;
