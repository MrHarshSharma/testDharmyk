import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../store/useUserStore';
import { getTodayDate } from '../../services/api';
import { Flame } from 'lucide-react-native';

const COLORS = {
    saffron: '#FF9933',
    deepRed: '#8B0000',
    warmWhite: '#FDFBF7',
    charcoal: '#333333',
};

export default function HomeScreen() {
    const router = useRouter();
    const { currentStreak, completedDates, reset } = useUserStore();
    const today = getTodayDate();
    const isCompletedToday = completedDates.includes(today);

    const handleStartSadhana = () => {
        router.push('/sadhana');
    };

    const handleResetForTesting = () => {
        Alert.alert(
            'Reset Data',
            'This will clear all completion data for testing. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        reset();
                        Alert.alert('Success', 'All data has been reset!');
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Streak Display */}
            <View style={styles.streakContainer}>
                <Flame size={32} color={COLORS.saffron} />
                <Text style={styles.streakNumber}>{currentStreak}</Text>
                <Text style={styles.streakLabel}>Day Streak</Text>
            </View>

            {/* Main Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>
                    {isCompletedToday ? "Today's Sadhana Complete! 🎉" : "Today's Sadhana"}
                </Text>
                <Text style={styles.cardSubtitle}>
                    {isCompletedToday
                        ? 'Come back tomorrow for your next practice'
                        : 'A 2-3 minute spiritual journey awaits you'}
                </Text>

                {!isCompletedToday && (
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={handleStartSadhana}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.startButtonText}>Begin Practice</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{completedDates.length}</Text>
                    <Text style={styles.statLabel}>Days Completed</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{currentStreak}</Text>
                    <Text style={styles.statLabel}>Current Streak</Text>
                </View>
            </View>

            {/* Development Reset Button */}
            <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetForTesting}
                activeOpacity={0.7}
            >
                <Text style={styles.resetButtonText}>🔄 Reset for Testing</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.warmWhite,
        padding: 20,
    },
    streakContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    streakNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.deepRed,
        marginTop: 8,
    },
    streakLabel: {
        fontSize: 16,
        color: COLORS.charcoal,
        marginTop: 4,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.deepRed,
        marginBottom: 12,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 16,
        color: COLORS.charcoal,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    startButton: {
        backgroundColor: COLORS.saffron,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 50,
        alignItems: 'center',
        shadowColor: COLORS.saffron,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        flex: 1,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.saffron,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.charcoal,
        textAlign: 'center',
    },
    resetButton: {
        marginTop: 24,
        padding: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    resetButtonText: {
        fontSize: 14,
        color: COLORS.charcoal,
        fontWeight: '500',
    },
});
