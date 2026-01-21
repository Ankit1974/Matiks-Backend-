export const colors = {
    // Primary colors
    primary: '#9333EA',
    primaryDark: '#6B46C1',
    primaryLight: '#A855F7',

    // Accent colors
    secondary: '#F97316',
    accent: '#3B82F6',

    // Rank colors
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',

    // Background colors
    background: '#000000',
    backgroundLight: '#1E293B',
    card: '#1E293B',
    cardLight: '#334155',

    // Text colors
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',

    // Status colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',

    // Gradient colors
    gradientStart: '#6B46C1',
    gradientEnd: '#9333EA',
    gradientAccent: '#EC4899',
} as const;

// Spacing system
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

// Border radius
export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
} as const;

// Shadows
export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 12,
    },
} as const;
