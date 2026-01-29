import { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSadhanaStore } from '../store/useSadhanaStore';

const COLORS = {
    saffron: '#FF9933',
    warmWhite: '#FDFBF7',
    charcoal: '#333333',
};

interface AmpCardViewProps {
    url: string;
    onNext: () => void;
    isActive: boolean;
}

export default function AmpCardView({ url, onNext, isActive }: AmpCardViewProps) {
    const webViewRef = useRef<WebView>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setReflection } = useSadhanaStore();

    const handleNavigationStateChange = (navState: any) => {
        const { url: navUrl } = navState;

        // Intercept dharmyk:// URLs
        if (navUrl.startsWith('dharmyk://')) {
            handleBridgeUrl(navUrl);
            return false;
        }

        return true;
    };

    const handleShouldStartLoadWithRequest = (request: any) => {
        const { url: requestUrl } = request;

        // Intercept dharmyk:// URLs
        if (requestUrl.startsWith('dharmyk://')) {
            handleBridgeUrl(requestUrl);
            return false;
        }

        return true;
    };

    const handleBridgeUrl = (bridgeUrl: string) => {
        try {
            const url = new URL(bridgeUrl);
            const action = url.hostname;
            const params = Object.fromEntries(url.searchParams);

            console.log('Bridge action:', action, params);

            switch (action) {
                case 'next':
                    onNext();
                    break;

                case 'quiz_correct':
                    console.log('Quiz answered correctly!');
                    // Could add haptic feedback here
                    break;

                case 'quiz_wrong':
                    console.log('Quiz answered incorrectly');
                    // Could add haptic feedback here
                    break;

                case 'save_reflection':
                    if (params.reflection) {
                        setReflection(params.reflection);
                        console.log('Reflection saved:', params.reflection);
                    }
                    onNext();
                    break;

                case 'card_ready':
                    console.log('Card loaded and ready');
                    break;

                default:
                    console.log('Unknown bridge action:', action);
            }
        } catch (error) {
            console.error('Error parsing bridge URL:', error);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.saffron} />
                    <Text style={styles.loadingText}>Loading card...</Text>
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {isActive && (
                <WebView
                    ref={webViewRef}
                    source={{ uri: url }}
                    style={styles.webview}
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        setError(`Failed to load: ${nativeEvent.description}`);
                        setIsLoading(false);
                    }}
                    onNavigationStateChange={handleNavigationStateChange}
                    onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.warmWhite,
    },
    webview: {
        flex: 1,
        backgroundColor: COLORS.warmWhite,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.warmWhite,
        zIndex: 1,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.charcoal,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});
