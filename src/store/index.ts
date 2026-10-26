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
import {
    LoggedShift,
    getAllLoggedShifts,
    getLoggedShiftsByMonth,
    getLoggedShiftsByWeek,
    getRecentLoggedShifts,
    createLoggedShift,
    updateLoggedShift,
    deleteLoggedShift
} from "../database/loggedShifts";
import { recalculateMonthSummary } from "../database/months";


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
    loggedShifts: LoggedShift[];
    recentShifts: LoggedShift[];
    weeksLoading: boolean;
    shiftsLoading: boolean;
    loggedShiftsLoading: boolean;
    loadWeeks: () => Promise<void>;
    loadWeeksById: (id: number) => Promise<void>;
    addWeek: (week: Week) => Promise<number>;
    setWeekImage: (id: number, uri: string) => Promise<void>;
    removeWeek: (id: number) => Promise<void>;
    loadShiftsByWeek: (weekId: number) => Promise<void>;
    addScheduledShift: (shift: ScheduledShift) => Promise<void>;
    editScheduledShift: (shift: ScheduledShift) => Promise<void>;
    removeScheduledShift: (id: number) => Promise<void>;
    loadLoggedShifts: () => Promise<void>;
    loadRecentShifts: () => Promise<void>;
    addLoggedShift: (shift: LoggedShift) => Promise<void>;
    editLoggedShift: (shift: LoggedShift) => Promise<void>;
    removeLoggedShift: (id: number) => Promise<void>;
    editingShift: LoggedShift | null;
    setEditingShift: (shift: LoggedShift | null) => void;
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

    // Logged shifts slice
    loggedShifts: [],
    recentShifts: [],
    loggedShiftsLoading: false,
    editingShift: null,
    setEditingShift: (shift) => set({ editingShift: shift }),

    loadLoggedShifts: async () => {
        set({loggedShiftsLoading: true});
        const shifts = await getAllLoggedShifts();
        set({loggedShifts: shifts, loggedShiftsLoading: false});
    },

    loadRecentShifts: async () => {
        const shifts = await getRecentLoggedShifts(3);
        set({recentShifts: shifts});
    },

    addLoggedShift: async (shift: LoggedShift) => {
        await createLoggedShift(shift);
        const date = new Date(shift.date);
        await recalculateMonthSummary(
            date.getMonth() + 1,
            date.getFullYear()
        );
        await get().loadLoggedShifts();
        await get().loadRecentShifts();
    },

    editLoggedShift: async (shift: LoggedShift) => {
        const previous = get().loggedShifts.find((s) => s.id === shift.id);
        await updateLoggedShift(shift);

        const newDate = new Date(shift.date);
        await recalculateMonthSummary(newDate.getMonth() + 1, newDate.getFullYear());

        //IF the date moved to a different month, the old month's totals must be recalculated too, or they keep counting this shift
        if(previous && previous.date.slice(0, 7) !== shift.date.slice(0,7)) {
            const oldDate = new Date(previous.date);
            await recalculateMonthSummary(oldDate.getMonth() + 1, oldDate.getFullYear());
        }
        await get().loadLoggedShifts();
        await get().loadRecentShifts();
    },

    removeLoggedShift: async (id: number) => {
        const shift = get().loggedShifts.find((s) => s.id === id);
        await deleteLoggedShift(id);
        if(shift) {
            const date = new Date(shift.date);
            await recalculateMonthSummary(
                date.getMonth() + 1,
                date.getFullYear()
            );
        }
        await get().loadLoggedShifts();
        await get().loadRecentShifts();
    },

    monthlySummary: null,
    weekSummary: null,
    summaryLoading: false
    
}))

