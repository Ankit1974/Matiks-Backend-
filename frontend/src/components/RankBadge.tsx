import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, spacing } from '../styles/colors';

interface RankBadgeProps {
    rank: number;
    size?: 'small' | 'medium' | 'large';
    variant?: 'default';
}

const sizes = {
    small: { container: 40, text: 16 },
    medium: { container: 56, text: 24 },
    large: { container: 80, text: 36 },
} as const;

/**
 * Displays a user's rank with special styling for top 3
 */
const RankBadge: React.FC<RankBadgeProps> = ({ rank, size = 'medium' }) => {
    const isTopThree = rank <= 3;

    const getGradientColors = () => {
        switch (rank) {
            case 1: return ['#FFD700', '#FFA500'] as const;
            case 2: return ['#E8E8E8', '#C0C0C0'] as const;
            case 3: return ['#CD7F32', '#8B4513'] as const;
            default: return [colors.gradientStart, colors.gradientEnd] as const;
        }
    };

    const { container, text } = sizes[size as keyof typeof sizes];

    if (isTopThree) {
        return (
            <LinearGradient
                colors={getGradientColors()}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.badge,
                    {
                        minWidth: container,
                        minHeight: container,
                        paddingHorizontal: spacing.xs
                    }
                ]}
            >
                <Text style={[styles.rankText, { fontSize: text }]} numberOfLines={1}>
                    {rank}
                </Text>
            </LinearGradient>
        );
    }

    return (
        <View
            style={[
                styles.badge,
                {
                    minWidth: container,
                    minHeight: container,
                    paddingHorizontal: spacing.xs,
                    backgroundColor: colors.cardLight,
                }
            ]}
        >
            <Text
                style={[styles.rankText, { fontSize: text, color: colors.primary }]}
                numberOfLines={1}
            >
                {rank}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rankText: {
        fontWeight: '800',
        color: colors.background,
    },
});

export default RankBadge;
