import { create } from "zustand";
import { Settings, getSettings, saveSettings, updateSettings } from "../database/settings";

interface SettingsSlice {
    settings: Settings | null;
    settingsLoading: boolean;
    loadSettings: () => Promise<void>;
    saveSettings: (settings: Settings) => Promise<void>;
    updateSettings: (settings: Partial<Settings>) => Promise<void>;
}

interface ShiftsSlice {
    loggedShifts: any[];
    recentShifts: any[];
    scheduledShifts: any[];
    shiftsLoading: boolean;
}

interface SummarySlice {
    monthlySummary: any | null;
    weekSummary: any | null;
    summaryLoading: boolean
}

type HourTrackStore = SettingsSlice & ShiftsSlice & SummarySlice;

export const useHourTrackStore = create<HourTrackStore>((set, get) => ({
    // Settings slice
    settings: null,
    settingsLoading: false,

    loadSettings: async () => {
        set({ settingsLoading: true });
        const settings = await getSettings();
        set({ settings, settingsLoading: false });
    },

    saveSettings: async (settings: Settings) => {
        await saveSettings(settings)
        set({settings})
    }, 

    updateSettings: async (updated: Partial<Settings>) => {
        await updateSettings(updated);
        const current = get().settings;
        if (current) {
            set({ settings: {...current, ...updated} })
        }
    },
    
    loggedShifts: [],
    recentShifts: [],
    scheduledShifts: [],
    shiftsLoading: false,

    monthlySummary: null,
    weekSummary: null,
    summaryLoading: false
    
}))

