import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

export const adminStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    footerNote: {
        textAlign: 'center',
        color: colors.textMuted,
        fontSize: 13,
        fontStyle: 'italic',
        marginTop: 16,
        lineHeight: 18,
    },
});
