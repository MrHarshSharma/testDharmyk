import { Tabs } from 'expo-router';
import { Home, User } from 'lucide-react-native';

const COLORS = {
    saffron: '#FF9933',
    deepRed: '#8B0000',
    warmWhite: '#FDFBF7',
    charcoal: '#333333',
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.saffron,
                tabBarInactiveTintColor: COLORS.charcoal,
                tabBarStyle: {
                    backgroundColor: COLORS.warmWhite,
                    borderTopColor: '#E5E5E5',
                },
                headerStyle: {
                    backgroundColor: COLORS.warmWhite,
                },
                headerTintColor: COLORS.deepRed,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                    headerTitle: "Today's Sadhana",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                    headerTitle: 'My Journey',
                }}
            />
        </Tabs>
    );
}
