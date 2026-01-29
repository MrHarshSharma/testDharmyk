import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useUserStore } from '../../store/useUserStore';
import { Award, Calendar, TrendingUp, Search, Lock, Star } from 'lucide-react-native';

// Pastel Hindu Palette
const THEME = {
    background: '#FAFAFA',
    textPrimary: '#2D3436', // Dark gray/black
    textSecondary: '#636E72', // Medium gray
    primary: '#E65100', // Deep Orange
    cardBg: '#FFFFFF',
    // Badge colors
    seekerBg: '#E3F2FD', // Light Blue
    seekerIcon: '#2196F3',
    trimurtiBg: '#FFF3E0', // Light Orange
    trimurtiIcon: '#FF9800',
    saptaBg: '#F3E5F5', // Light Purple
    saptaIcon: '#9C27B0',
    lockedBg: '#F5F5F5',
    lockedIcon: '#BDBDBD',
};

// Badge definitions matching reference
const ALL_BADGES = [
    {
        id: 'the_seeker',
        name: 'The Seeker',
        description: 'Complete your first Sadhana',
        iconName: 'Search',
        requirement: 1,
        colorBg: THEME.seekerBg,
        colorIcon: THEME.seekerIcon,
    },
    {
        id: 'tri_murti',
        name: 'Tri-Murti',
        description: 'Maintain a 3-day streak',
        iconName: 'Award', // Trident replacement
        requirement: 3,
        colorBg: THEME.trimurtiBg,
        colorIcon: THEME.trimurtiIcon,
    },
    {
        id: 'saptarishi',
        name: 'Saptarishi',
        description: 'Maintain a 7-day streak',
        iconName: 'Star',
        requirement: 7,
        colorBg: THEME.saptaBg,
        colorIcon: THEME.saptaIcon,
    },
];

export default function ProfileScreen() {
    const { currentStreak, longestStreak, badges, completedDates } = useUserStore();

    const isBadgeUnlocked = (badgeId: string) => {
        return badges.some(b => b.id === badgeId);
    };

    const getBadgeIcon = (name: string, color: string, size = 24) => {
        switch (name) {
            case 'Search': return <Search size={size} color={color} />;
            case 'Award': return <Award size={size} color={color} />; // Placeholder for Trident
            case 'Star': return <Star size={size} color={color} fill={color} />;
            default: return <Award size={size} color={color} />;
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.pageTitle}>Your Journey</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <TrendingUp size={24} color={THEME.primary} style={{ marginBottom: 8 }} />
                    <Text style={styles.statValue}>{currentStreak}</Text>
                    <Text style={styles.statLabel}>Current Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Award size={24} color={THEME.primary} style={{ marginBottom: 8 }} />
                    <Text style={styles.statValue}>{longestStreak}</Text>
                    <Text style={styles.statLabel}>Longest Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Calendar size={24} color={THEME.primary} style={{ marginBottom: 8 }} />
                    <Text style={styles.statValue}>{completedDates.length}</Text>
                    <Text style={styles.statLabel}>Total Days</Text>
                </View>
            </View>

            {/* Badges Section */}
            <View style={styles.badgesSection}>
                <Text style={styles.sectionTitle}>Badges</Text>
                <Text style={styles.sectionSubtitle}>
                    {badges.length} of {ALL_BADGES.length} unlocked
                </Text>

                <View style={styles.badgesList}>
                    {ALL_BADGES.map(badge => {
                        const unlocked = isBadgeUnlocked(badge.id);
                        return (
                            <View key={badge.id} style={styles.badgeItem}>
                                <View style={[
                                    styles.badgeIconCircle,
                                    { backgroundColor: unlocked ? badge.colorBg : THEME.lockedBg }
                                ]}>
                                    {unlocked ? (
                                        getBadgeIcon(badge.iconName, badge.colorIcon, 28)
                                    ) : (
                                        <Lock size={24} color={THEME.lockedIcon} />
                                    )}
                                </View>
                                <View style={styles.badgeInfo}>
                                    <Text style={[styles.badgeName, !unlocked && styles.textLocked]}>
                                        {badge.name}
                                    </Text>
                                    {unlocked ? (
                                        <Text style={styles.badgeDesc}>{badge.description}</Text>
                                    ) : (
                                        <View>
                                            <Text style={styles.badgeDescLocked}>{badge.description}</Text>
                                            <Text style={styles.badgeRequirement}>
                                                {badge.requirement} day streak required
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
        padding: 20,
    },
    header: {
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        marginBottom: 24,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8B0000', // Deep Maroon like reference
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: THEME.cardBg,
        paddingVertical: 20,
        paddingHorizontal: 8,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: THEME.textPrimary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: THEME.textSecondary,
        fontWeight: '500',
        textAlign: 'center',
    },
    badgesSection: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#8B0000',
        marginBottom: 4,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: THEME.textSecondary,
        marginBottom: 16,
    },
    badgesList: {
        gap: 16,
    },
    badgeItem: {
        backgroundColor: THEME.cardBg,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    badgeIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    badgeInfo: {
        flex: 1,
    },
    badgeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3436', // Dark gray
        marginBottom: 4,
    },
    textLocked: {
        color: '#BDBDBD',
    },
    badgeDesc: {
        fontSize: 14,
        color: '#636E72',
    },
    badgeDescLocked: {
        fontSize: 14,
        color: '#BDBDBD',
        marginBottom: 2,
    },
    badgeRequirement: {
        fontSize: 12,
        color: '#9E9E9E',
        fontStyle: 'italic',
    },
});
