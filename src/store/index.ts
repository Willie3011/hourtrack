import { create } from "zustand";

interface HourTrackStore {
    isReady: boolean;
    setReady: (value: boolean) => void;
}

export const useHourTrackStore = create<HourTrackStore>((set) => ({
    isReady: false,
    setReady: (value) => set({isReady: value})
}))