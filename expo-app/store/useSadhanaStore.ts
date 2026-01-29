/**
 * Sadhana Session Store
 * 
 * Manages current Sadhana session state
 */

import { create } from 'zustand';
import { getSadhanaByDate, SadhanaResponse, SadhanaCard } from '../services/api';

export interface SadhanaState {
    currentSadhana: SadhanaResponse | null;
    cards: string[]; // Array of card URLs
    currentCardIndex: number;
    reflectionText: string;
    isLoading: boolean;
    error: string | null;
}

interface SadhanaActions {
    loadSadhana: (date: string) => Promise<void>;
    nextCard: () => void;
    previousCard: () => void;
    setReflection: (text: string) => void;
    completeSadhana: () => void;
    reset: () => void;
}

type SadhanaStore = SadhanaState & SadhanaActions;

const initialState: SadhanaState = {
    currentSadhana: null,
    cards: [],
    currentCardIndex: 0,
    reflectionText: '',
    isLoading: false,
    error: null,
};

export const useSadhanaStore = create<SadhanaStore>((set, get) => ({
    ...initialState,

    /**
     * Load Sadhana for a specific date
     */
    loadSadhana: async (date: string) => {
        try {
            set({ isLoading: true, error: null });

            const sadhana = await getSadhanaByDate(date);
            const cardUrls = sadhana.cards.map(card => card.url);

            set({
                currentSadhana: sadhana,
                cards: cardUrls,
                currentCardIndex: 0,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to load Sadhana',
            });
        }
    },

    /**
     * Advance to next card
     */
    nextCard: () => {
        const { currentCardIndex, cards } = get();

        if (currentCardIndex < cards.length - 1) {
            set({ currentCardIndex: currentCardIndex + 1 });
        }
    },

    /**
     * Go to previous card
     */
    previousCard: () => {
        const { currentCardIndex } = get();

        if (currentCardIndex > 0) {
            set({ currentCardIndex: currentCardIndex - 1 });
        }
    },

    /**
     * Set reflection text
     */
    setReflection: (text: string) => {
        set({ reflectionText: text });
    },

    /**
     * Complete the Sadhana session
     */
    completeSadhana: () => {
        // This will be called when user finishes all cards
        // The actual completion logic (updating streak, showing modal) 
        // will be handled in the component
    },

    /**
     * Reset the session
     */
    reset: () => {
        set(initialState);
    },
}));
