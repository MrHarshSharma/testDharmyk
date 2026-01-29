import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame, Award } from 'lucide-react-native';

const COLORS = {
    saffron: '#FF9933',
    deepRed: '#8B0000',
    warmWhite: '#FDFBF7',
    charcoal: '#333333',
};

interface CompletionModalProps {
    visible: boolean;
    streak: number;
    onClose: () => void;
}

export default function CompletionModal({ visible, streak, onClose }: CompletionModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    {/* Success Icon */}
                    <View style={styles.iconContainer}>
                        <Award size={64} color={COLORS.saffron} />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Sadhana Complete! 🎉</Text>

                    {/* Streak Display */}
                    <View style={styles.streakContainer}>
                        <Flame size={32} color={COLORS.saffron} />
                        <Text style={styles.streakNumber}>{streak}</Text>
                        <Text style={styles.streakLabel}>Day Streak</Text>
                    </View>

                    {/* Message */}
                    <Text style={styles.message}>
                        You've completed today's spiritual practice. Keep up the great work!
                    </Text>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        maxWidth: 400,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.deepRed,
        marginBottom: 24,
        textAlign: 'center',
    },
    streakContainer: {
        alignItems: 'center',
        marginBottom: 24,
        padding: 20,
        backgroundColor: COLORS.warmWhite,
        borderRadius: 16,
        width: '100%',
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
    message: {
        fontSize: 16,
        color: COLORS.charcoal,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    button: {
        backgroundColor: COLORS.saffron,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 50,
        width: '100%',
        alignItems: 'center',
        shadowColor: COLORS.saffron,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});
