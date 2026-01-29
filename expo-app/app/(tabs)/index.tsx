import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../store/useUserStore';
import { getTodayDate } from '../../services/api';
import { Flame, BookOpen, Music, Wind, Sun, Heart, Bell, ChevronRight, Moon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Pastel Hindu Palette
const THEME = {
    background: '#FAFAFA', // Clean off-white
    headerBg: '#FFFFFF',
    textDark: '#2D3436',
    textGray: '#636E72',

    // Pastels
    saffronLight: '#FFE0B2', // Peach/Orange
    saffronDark: '#FB8C00', // Deep Orange accent
    greenLight: '#E8F5E9',  // Sage
    greenDark: '#43A047',
    blueLight: '#E3F2FD',
    blueDark: '#1E88E5',
    purpleLight: '#F3E5F5',
    purpleDark: '#8E24AA',
    redLight: '#FFEBEE',
    redDark: '#E53935',
    tealLight: '#E0F2F1',
    tealDark: '#00897B',
};

export default function HomeScreen() {
    const router = useRouter();
    const { currentStreak, completedDates, reset } = useUserStore();
    const today = getTodayDate();
    const isCompletedToday = completedDates.includes(today);
    const insets = useSafeAreaInsets();

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

    const QuickAction = ({ icon: Icon, label, colorBg, colorIcon, onPress }: any) => (
        <TouchableOpacity style={styles.gridItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.gridIconCircle, { backgroundColor: colorBg }]}>
                <Icon size={24} color={colorIcon} />
            </View>
            <Text style={styles.gridLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>S</Text>
                    </View>
                    <View>
                        <Text style={styles.greeting}>Namaste!</Text>
                        <Text style={styles.username}>Seeker</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.bellButton}>
                    <Bell size={20} color={THEME.textDark} />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Card */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={!isCompletedToday ? handleStartSadhana : undefined}
                >
                    <LinearGradient
                        colors={isCompletedToday ? [THEME.greenLight, '#C8E6C9'] : [THEME.saffronLight, '#FFCC80']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroCard}
                    >
                        <View style={styles.heroContent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.heroEyebrow}>Daily Practice</Text>
                                <Text style={styles.heroTitle}>
                                    {isCompletedToday ? "Sadhana\nCompleted" : "Start Your\nDaily Sadhana"}
                                </Text>
                                <View style={styles.ctaButton}>
                                    <Text style={styles.ctaText}>
                                        {isCompletedToday ? "View Progress" : "Get Started Now"}
                                    </Text>
                                </View>
                            </View>
                            {/* Illustration Placeholder */}
                            <View style={styles.heroIllustration}>
                                {isCompletedToday ? (
                                    <View style={[styles.illustrationCircle, { backgroundColor: 'rgba(255,255,255,0.4)' }]}>
                                        <Text style={{ fontSize: 32 }}>🕉️</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.illustrationCircle, { backgroundColor: 'rgba(255,255,255,0.4)' }]}>
                                        <Text style={{ fontSize: 32 }}>📿</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Grid Menu */}
                <View style={styles.gridContainer}>
                    <View style={styles.gridRow}>
                        <QuickAction
                            icon={Flame}
                            label="Pooja"
                            colorBg={THEME.saffronLight}
                            colorIcon={THEME.saffronDark}
                        />
                        <QuickAction
                            icon={BookOpen}
                            label="Wisdom"
                            colorBg={THEME.greenLight}
                            colorIcon={THEME.greenDark}
                        />
                        <QuickAction
                            icon={Music}
                            label="Mantra"
                            colorBg={THEME.purpleLight}
                            colorIcon={THEME.purpleDark}
                        />
                    </View>
                    <View style={styles.gridRow}>
                        <QuickAction
                            icon={Wind}
                            label="Meditation"
                            colorBg={THEME.tealLight}
                            colorIcon={THEME.tealDark}
                        />
                        <QuickAction
                            icon={Sun}
                            label="Panchang"
                            colorBg={THEME.blueLight}
                            colorIcon={THEME.blueDark}
                        />
                        <QuickAction
                            icon={Heart}
                            label="Seva"
                            colorBg={THEME.redLight}
                            colorIcon={THEME.redDark}
                        />
                    </View>
                </View>

                {/* Daily Panchang / Timings Widget */}
                <View style={styles.widgetCard}>
                    <View style={styles.widgetHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Sun size={18} color={THEME.saffronDark} fill={THEME.saffronDark} />
                            <Text style={styles.widgetTitle}>Daily Panchang</Text>
                        </View>
                        <Text style={styles.widgetDate}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>
                    </View>

                    <View style={styles.timingsRow}>
                        <View style={[styles.timingBox, { backgroundColor: '#333' }]}>
                            <Text style={[styles.timingLabel, { color: '#FFF' }]}>Sunrise</Text>
                            <Sun size={20} color="#FFD54F" style={{ marginVertical: 4 }} />
                            <Text style={[styles.timingTime, { color: '#FFF' }]}>06:42 AM</Text>
                        </View>

                        <View style={styles.timingBox}>
                            <Text style={styles.timingLabel}>Abhijit</Text>
                            <Sun size={20} color={THEME.saffronDark} style={{ marginVertical: 4 }} />
                            <Text style={styles.timingTime}>12:15 PM</Text>
                        </View>

                        <View style={styles.timingBox}>
                            <Text style={styles.timingLabel}>Sunset</Text>
                            <Moon size={20} color={THEME.purpleDark} style={{ marginVertical: 4 }} />
                            <Text style={styles.timingTime}>06:12 PM</Text>
                        </View>

                        <View style={styles.timingBox}>
                            <Text style={styles.timingLabel}>Rahukaal</Text>
                            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#555', marginVertical: 4 }} />
                            <Text style={styles.timingTime}>04:30 PM</Text>
                        </View>
                    </View>
                </View>

                {/* Reset Link */}
                <TouchableOpacity onPress={handleResetForTesting} style={styles.resetButton}>
                    <Text style={styles.resetText}>Reset Demo Data</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: THEME.textDark,
    },
    greeting: {
        fontSize: 14,
        color: THEME.textGray,
        fontWeight: '500',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: THEME.textDark,
    },
    bellButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: THEME.redDark,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    heroCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        minHeight: 160,
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    heroEyebrow: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(50,50,50,0.6)',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: THEME.textDark,
        marginBottom: 16,
        lineHeight: 30,
    },
    ctaButton: {
        backgroundColor: '#2D3436',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignSelf: 'flex-start',
    },
    ctaText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    heroIllustration: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    gridContainer: {
        marginBottom: 24,
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    gridItem: {
        backgroundColor: '#FFFFFF',
        width: '31%', // Fits 3 items with small gap
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    gridIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    gridLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: THEME.textDark,
    },
    widgetCard: {
        backgroundColor: '#2D3436', // Dark background like reference footer
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
    },
    widgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    widgetTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    widgetDate: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
    },
    timingsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timingBox: {
        width: '23%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    timingLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 2,
    },
    timingTime: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    resetButton: {
        alignItems: 'center',
    },
    resetText: {
        fontSize: 12,
        color: '#999',
    }
});
