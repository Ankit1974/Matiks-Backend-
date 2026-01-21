import React from 'react';
import {
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';
import SingleUpdateCard from '../../components/SingleUpdateCard';
import AdminHeader from '../../components/AdminHeader';
import BulkUpdateCard from '../../components/BulkUpdateCard';
import { adminStyles as styles } from './styles';

const AdminScreen: React.FC = () => {
    return (
        <LinearGradient
            colors={[colors.background, colors.background]}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <AdminHeader />

                        {/* single user Update Section */}
                        <SingleUpdateCard />

                        {/* Bulk Update Section */}
                        <BulkUpdateCard />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default AdminScreen;
