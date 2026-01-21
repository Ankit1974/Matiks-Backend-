import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../styles/colors';
import { updateScores } from '../services/api';

const BulkUpdateCard: React.FC = () => {
    const [bulkLoading, setBulkLoading] = useState(false);

    const handleBulkUpdate = async () => {
        try {
            setBulkLoading(true);
            const response = await updateScores();
            Alert.alert(
                'Bulk Update Success',
                `Updated ${response.updated_users} random users.\nTotal users in system: ${response.total_users}`
            );
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setBulkLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Bulk Random Update</Text>
            <Text style={styles.cardInfo}>
                Updates 5000-7000 random users to simulate a heavy live production load.
            </Text>

            <TouchableOpacity
                style={[styles.bulkButton, bulkLoading && styles.buttonDisabled]}
                onPress={handleBulkUpdate}
                disabled={bulkLoading}
            >
                {bulkLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <LinearGradient
                        colors={[colors.secondary, colors.primary]}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Simulate Live Activity</Text>
                    </LinearGradient>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    cardInfo: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: 24,
        lineHeight: 20,
    },
    bulkButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
    },
    gradientButton: {
        padding: 18,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BulkUpdateCard;
