import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from 'react-native';
import { colors } from '../styles/colors';
import { updateUserScore } from '../services/api';

const SingleUpdateCard: React.FC = () => {
    const [username, setUsername] = useState('');
    const [rating, setRating] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateUser = async () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Please enter a username');
            return;
        }

        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 100 || ratingNum > 5000) {
            Alert.alert('Error', 'Rating must be between 100 and 5000');
            return;
        }

        try {
            setLoading(true);
            const response = await updateUserScore(username.trim(), ratingNum);
            Alert.alert(
                'Success',
                `Updated ${response.user.username}.\nNew Rank: #${response.user.rank}`
            );
            setUsername('');
            setRating('');
        } catch (err: any) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Update User Rating</Text>
            <Text style={styles.cardInfo}>
                Search for this user later to see how their rank changed instantly.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. user_500"
                    placeholderTextColor={colors.textMuted}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>New Rating (100 - 5000)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 4500"
                    placeholderTextColor={colors.textMuted}
                    value={rating}
                    onChangeText={setRating}
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleUpdateUser}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Update Specific User</Text>
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
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        color: colors.text,
        fontSize: 16,
    },
    button: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 8,
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

export default SingleUpdateCard;
