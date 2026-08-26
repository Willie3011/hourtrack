import { create } from "zustand";
import {
    Settings,
    getSettings,
    saveSettings,
    updateSettings
} from "../database/settings";
import {
    Week,
    getAllWeeks,
    getWeekById,
    createWeek,
    updateWeekImage,
    deleteWeek
} from "../database/weeks";
import {
    ScheduledShift,
    getShiftsByWeekId,
    createScheduledShift,
    updateScheduledShift,
    deleteScheduledShift
  } from "../database/schedulesShifts";

interface SettingsSlice {
    settings: Settings | null;
    settingsLoading: boolean;
    loadSettings: () => Promise<void>;
    saveSettings: (settings: Settings) => Promise<void>;
    updateSettings: (settings: Partial<Settings>) => Promise<void>;
}

interface ShiftsSlice {
    weeks: Week[];
    activeWeek: Week | null;
    scheduledShifts: ScheduledShift[];
    weeksLoading: boolean;
    shiftsLoading: boolean;
    loadWeeks: () => Promise<void>;
    loadWeeksById: (id: number) => Promise<void>;
    addWeek: (week: Week) => Promise<number>;
    setWeekImage: (id: number, uri: string) => Promise<void>;
    removeWeek: (id: number) => Promise<void>;
    loadShiftsByWeek: (weekId: number) => Promise<void>;
    addScheduledShift: (shift: ScheduledShift) => Promise<void>;
    editScheduledShift: (shift: ScheduledShift) => Promise<void>;
    removeScheduledShift: (id: number) => Promise<void>;
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
    
    // Shifts slice
    weeks: [],
    activeWeek: null,
    scheduledShifts: [],
    weeksLoading: false,
    shiftsLoading: false,

    loadWeeks: async () => {
        set({ weeksLoading: true });
        const weeks = await getAllWeeks();
        set({ weeks, weeksLoading: false });
    },

    loadWeeksById: async (id: number) => {
        const week = await getWeekById(id);
        set({activeWeek: week})
    },

    addWeek: async (week: Week) => {
        const id = await createWeek(week);
        await get().loadWeeks();
        return id;
    },

    setWeekImage: async (id: number, uri: string) => {
        await updateWeekImage(id, uri);
        await get().loadWeeks();
        const activeWeek = get().activeWeek;
        if (activeWeek && activeWeek.id === id) {
            set({ activeWeek: { ...activeWeek, schedule_image_url: uri } });
        }
    },

    removeWeek: async (id: number) => {
        await deleteWeek(id);
        await get().loadWeeks();
    },

    loadShiftsByWeek: async (weekId: number) => {
        set({ shiftsLoading: true });
        const shifts = await getShiftsByWeekId(weekId);
        set({ scheduledShifts: shifts, shiftsLoading: false });
    },

    addScheduledShift: async (shift: ScheduledShift) => {
        await createScheduledShift(shift);
        await get().loadShiftsByWeek(shift.week_id);
    },

    editScheduledShift: async (shift: ScheduledShift) => {
        await updateScheduledShift(shift);
        await get().loadShiftsByWeek(shift.week_id);
    },

    removeScheduledShift: async (id: number) => {
        const weekId = get().scheduledShifts.find((s) => s.id === id)?.week_id;
        await deleteScheduledShift(id);
        if (weekId) await get().loadShiftsByWeek(weekId);
    },

    monthlySummary: null,
    weekSummary: null,
    summaryLoading: false
    
}))

