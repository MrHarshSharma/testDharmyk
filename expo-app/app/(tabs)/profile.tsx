import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useUserStore } from '../../store/useUserStore';
import { Award, Calendar, TrendingUp } from 'lucide-react-native';

const COLORS = {
    saffron: '#FF9933',
    deepRed: '#8B0000',
    warmWhite: '#FDFBF7',
    charcoal: '#333333',
    lightGray: '#F5F5F5',
};

// Badge definitions
const ALL_BADGES = [
    {
        id: 'the_seeker',
        name: 'The Seeker',
        description: 'Complete your first Sadhana',
        icon: '🔍',
        requirement: 1,
    },
    {
        id: 'tri_murti',
        name: 'Tri-Murti',
        description: 'Maintain a 3-day streak',
        icon: '🔱',
        requirement: 3,
    },
    {
        id: 'saptarishi',
        name: 'Saptarishi',
        description: 'Maintain a 7-day streak',
        icon: '⭐',
        requirement: 7,
    },
    {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Maintain a 30-day streak',
        icon: '🏆',
        requirement: 30,
    },
    {
        id: 'enlightened',
        name: 'Enlightened',
        description: 'Maintain a 108-day streak',
        icon: '✨',
        requirement: 108,
    },
];

export default function ProfileScreen() {
    const { currentStreak, longestStreak, badges, completedDates } = useUserStore();

    const isBadgeUnlocked = (badgeId: string) => {
        return badges.some(b => b.id === badgeId);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Stats Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Journey</Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <TrendingUp size={24} color={COLORS.saffron} />
                        <Text style={styles.statValue}>{currentStreak}</Text>
                        <Text style={styles.statLabel}>Current Streak</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Award size={24} color={COLORS.saffron} />
                        <Text style={styles.statValue}>{longestStreak}</Text>
                        <Text style={styles.statLabel}>Longest Streak</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Calendar size={24} color={COLORS.saffron} />
                        <Text style={styles.statValue}>{completedDates.length}</Text>
                        <Text style={styles.statLabel}>Total Days</Text>
                    </View>
                </View>
            </View>

            {/* Badges Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Badges</Text>
                <Text style={styles.sectionSubtitle}>
                    {badges.length} of {ALL_BADGES.length} unlocked
                </Text>

                <View style={styles.badgesGrid}>
                    {ALL_BADGES.map(badge => {
                        const unlocked = isBadgeUnlocked(badge.id);
                        return (
                            <View
                                key={badge.id}
                                style={[
                                    styles.badgeCard,
                                    !unlocked && styles.badgeCardLocked
                                ]}
                            >
                                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                                <Text style={[
                                    styles.badgeName,
                                    !unlocked && styles.badgeTextLocked
                                ]}>
                                    {badge.name}
                                </Text>
                                <Text style={[
                                    styles.badgeDescription,
                                    !unlocked && styles.badgeTextLocked
                                ]}>
                                    {badge.description}
                                </Text>
                                {!unlocked && (
                                    <Text style={styles.badgeRequirement}>
                                        {badge.requirement} day streak required
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.warmWhite,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.deepRed,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: COLORS.charcoal,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.deepRed,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.charcoal,
        marginTop: 4,
        textAlign: 'center',
    },
    badgesGrid: {
        gap: 12,
    },
    badgeCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    badgeCardLocked: {
        backgroundColor: COLORS.lightGray,
        opacity: 0.6,
    },
    badgeIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    badgeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.deepRed,
        marginBottom: 4,
    },
    badgeDescription: {
        fontSize: 14,
        color: COLORS.charcoal,
        marginBottom: 4,
    },
    badgeTextLocked: {
        color: '#999',
    },
    badgeRequirement: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        marginTop: 4,
    },
});
