/**
 * User State Store
 * 
 * Manages user data including streaks, badges, and completed dates
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@dharmyk_user_data';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
}

export interface UserState {
    currentStreak: number;
    longestStreak: number;
    badges: Badge[];
    completedDates: string[]; // Array of YYYY-MM-DD strings
    isLoading: boolean;
}

interface UserActions {
    loadUserData: () => Promise<void>;
    saveUserData: () => Promise<void>;
    completeDay: (date: string) => Promise<void>;
    addBadge: (badge: Badge) => void;
    reset: () => Promise<void>;
}

type UserStore = UserState & UserActions;

const initialState: UserState = {
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    completedDates: [],
    isLoading: false,
};

export const useUserStore = create<UserStore>((set, get) => ({
    ...initialState,

    /**
     * Load user data from AsyncStorage
     */
    loadUserData: async () => {
        try {
            set({ isLoading: true });
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);

            if (jsonValue) {
                const userData = JSON.parse(jsonValue);
                set({
                    currentStreak: userData.currentStreak || 0,
                    longestStreak: userData.longestStreak || 0,
                    badges: userData.badges || [],
                    completedDates: userData.completedDates || [],
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            set({ isLoading: false });
        }
    },

    /**
     * Save user data to AsyncStorage
     */
    saveUserData: async () => {
        try {
            const { currentStreak, longestStreak, badges, completedDates } = get();
            const userData = {
                currentStreak,
                longestStreak,
                badges,
                completedDates,
            };
            const jsonValue = JSON.stringify(userData);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    },

    /**
     * Mark a day as complete and update streak
     */
    completeDay: async (date: string) => {
        const { completedDates, currentStreak, longestStreak } = get();

        // Don't add if already completed
        if (completedDates.includes(date)) {
            return;
        }

        // Add to completed dates
        const newCompletedDates = [...completedDates, date].sort();

        // Calculate new streak
        const newStreak = calculateStreak(newCompletedDates);
        const newLongestStreak = Math.max(longestStreak, newStreak);

        set({
            completedDates: newCompletedDates,
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
        });

        await get().saveUserData();
    },

    /**
     * Add a new badge
     */
    addBadge: (badge: Badge) => {
        const { badges } = get();

        // Don't add if already exists
        if (badges.some(b => b.id === badge.id)) {
            return;
        }

        set({
            badges: [...badges, { ...badge, unlockedAt: new Date().toISOString() }],
        });

        get().saveUserData();
    },

    /**
     * Reset all user data
     */
    reset: async () => {
        set(initialState);
        await AsyncStorage.removeItem(STORAGE_KEY);
    },
}));

/**
 * Calculate current streak from completed dates
 */
function calculateStreak(completedDates: string[]): number {
    if (completedDates.length === 0) return 0;

    const sortedDates = [...completedDates].sort().reverse();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (const dateStr of sortedDates) {
        const completedDate = new Date(dateStr);
        completedDate.setHours(0, 0, 0, 0);

        const diffTime = currentDate.getTime() - completedDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0 || diffDays === 1) {
            streak++;
            currentDate = new Date(completedDate);
        } else {
            break;
        }
    }

    return streak;
}
