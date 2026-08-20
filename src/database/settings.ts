import { getDatabase } from './index';

export interface Settings { 
    id?: number;
    hourly_rate: number;
    contracted_weekly_hours: number;
    overtime_multiplier: number;
    holiday_pay_enabled: number;
    holiday_multiplier: number;
    nightshift_enabled: number;
    onboarding_complete: number;
}

export const createSettingsTable = async (): Promise<void> => {
    const db = await getDatabase();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY NOT NULL DEFAULT 1,
            hourly_rate REAL NOT NULL DEFAULT 0,
            contracted_weekly_hours REAL NOT NULL DEFAULT 0,
            overtime_multiplier REAL NOT NULL DEFAULT 1.5,
            holiday_pay_enabled INTEGER NOT NULL DEFAULT 0,
            holiday_multiplier REAL NOT NULL DEFAULT 2,
            nightshift_enabled INTEGER NOT NULL DEFAULT 0,
            onboarding_complete INTEGER NOT NULL DEFAULT 0 
    );   
    `);
};

export const getSettings = async (): Promise<Settings | null> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Settings>("SELECT * FROM settings WHERE id = 1");
    return result;
};

export const saveSettings = async (settings: Settings): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync(`
        INSERT OR REPLACE INTO settings (
            id,
            hourly_rate,
            contracted_weekly_hours,
            overtime_multiplier,
            holiday_pay_enabled,
            holiday_multiplier,
            nightshift_enabled,
            onboarding_complete
        ) VALUES (1, ?, ?, ?, ?, ?, ?, ?)`, [
        settings.hourly_rate,
        settings.contracted_weekly_hours,
        settings.overtime_multiplier,
        settings.holiday_pay_enabled,
        settings.holiday_multiplier,
        settings.nightshift_enabled,
        settings.onboarding_complete,
    ]);
};

export const updateSettings = async (settings: Partial<Settings>): Promise<void> => {
    const db = await getDatabase();
    const fields = Object.keys(settings).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(settings);
    await db.runAsync(`
      UPDATE settings SET ${fields} WHERE id = 1;  
    `, values);
}