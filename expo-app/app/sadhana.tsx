import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import { X } from 'lucide-react-native';
import { useSadhanaStore } from '../store/useSadhanaStore';
import { useUserStore } from '../store/useUserStore';
import { getTodayDate } from '../services/api';
import AmpCardView from '../components/AmpCardView';
import CompletionModal from '../components/CompletionModal';

const COLORS = {
    saffron: '#FF9933',
    deepRed: '#8B0000',
    warmWhite: '#FDFBF7',
    charcoal: '#333333',
};

export default function SadhanaScreen() {
    const router = useRouter();
    const pagerRef = useRef<PagerView>(null);
    const [showCompletion, setShowCompletion] = useState(false);

    const {
        cards,
        currentCardIndex,
        isLoading,
        error,
        loadSadhana,
        nextCard,
        previousCard,
        reset: resetSadhana
    } = useSadhanaStore();

    const { completeDay, currentStreak } = useUserStore();

    useEffect(() => {
        // Load today's Sadhana
        const today = getTodayDate();
        loadSadhana(today);

        return () => {
            resetSadhana();
        };
    }, []);

    const handleNext = () => {
        if (currentCardIndex < cards.length - 1) {
            nextCard();
            pagerRef.current?.setPage(currentCardIndex + 1);
        } else {
            // Last card - complete Sadhana
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentCardIndex > 0) {
            previousCard();
            pagerRef.current?.setPage(currentCardIndex - 1);
        } else {
            router.back();
        }
    };

    const handleComplete = async () => {
        const today = getTodayDate();
        await completeDay(today);
        setShowCompletion(true);
    };

    const handleClose = () => {
        if (currentCardIndex === 0) {
            router.back();
        } else {
            Alert.alert(
                'Exit Sadhana?',
                'Are you sure you want to exit? Your progress will not be saved.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Exit', style: 'destructive', onPress: () => router.back() },
                ]
            );
        }
    };

    const handleCompletionClose = () => {
        setShowCompletion(false);
        router.back();
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.saffron} />
                <Text style={styles.loadingText}>Loading your Sadhana...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (cards.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>No Sadhana available for today</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={COLORS.charcoal} />
                </TouchableOpacity>
                <Text style={styles.progressText}>
                    {currentCardIndex + 1} of {cards.length}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Card Pager */}
            <PagerView
                ref={pagerRef}
                style={styles.pager}
                initialPage={0}
                scrollEnabled={false}
                onPageSelected={(e) => {
                    // Update store index when page changes
                    // This allows bi-directional sync (swiping or programmatic)
                    // If useSadhanaStore has setCurrentIndex, call it.
                    // If not, we rely on nextCard actions roughly.
                }}
            >
                {cards.map((cardUrl, index) => (
                    <View key={index} style={styles.page}>
                        <AmpCardView
                            url={cardUrl}
                            onNext={handleNext}
                            onBack={handleBack}
                            isActive={Math.abs(index - currentCardIndex) <= 1}
                        />
                    </View>
                ))}
            </PagerView>

            {/* Completion Modal */}
            <CompletionModal
                visible={showCompletion}
                streak={currentStreak}
                onClose={handleCompletionClose}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.warmWhite,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.warmWhite,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: COLORS.warmWhite,
    },
    closeButton: {
        padding: 8,
    },
    progressText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.charcoal,
    },
    pager: {
        flex: 1,
    },
    page: {
        flex: 1,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.charcoal,
    },
    errorText: {
        fontSize: 18,
        color: COLORS.deepRed,
        textAlign: 'center',
        marginBottom: 24,
    },
    button: {
        backgroundColor: COLORS.saffron,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
