import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../styles/colors';

interface LeaderboardHeaderProps { }

const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Leaderboard</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textSecondary,
    },
});

export default LeaderboardHeader;
