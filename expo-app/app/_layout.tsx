import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

export default function RootLayout() {
    const loadUserData = useUserStore(state => state.loadUserData);

    useEffect(() => {
        // Load user data on app start
        loadUserData();
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="sadhana"
                options={{
                    presentation: 'fullScreenModal',
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
