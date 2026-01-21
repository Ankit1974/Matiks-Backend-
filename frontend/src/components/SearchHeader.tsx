import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/colors';

interface SearchHeaderProps {
    title?: string;
    subtitle?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
    title = '🔍 Search Player',
    subtitle = "Find any player's rank"
}) => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingTop: spacing.xxl,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.lg,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textSecondary,
    },
});

export default SearchHeader;
