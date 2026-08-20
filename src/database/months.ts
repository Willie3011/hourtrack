import { getDatabase } from './index';

export interface Month { 
    id?: number;
    month: number;
    year: number;
    total_regular_hours: number;
    total_overtime_hours: number;
    total_holiday_hours: number;
    total_nightshift_hours: number;
    total_nightshift_allowance: number;
    total_lost_time_minutes: number;
    total_expected_earnings: number;
    updated_at?: string;
}

export const createMonthsTable = async (): Promise<void> => {
    const db = await getDatabase();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS months (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            month INTEGER NOT NULL,
            year INTEGER NOT NULL,
            total_regular_hours REAL NOT NULL DEFAULT 0,
            total_overtime_hours REAL NOT NULL DEFAULT 0,
            total_holiday_hours REAL NOT NULL DEFAULT 0,
            total_nightshift_hours REAL NOT NULL DEFAULT 0,
            total_nightshift_allowance REAL NOT NULL DEFAULT 0,
            total_lost_time_minutes REAL NOT NULL DEFAULT 0,
            total_expected_earnings REAL NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL DEFAULT (datetime('now')),
            UNIQUE(month, year)
        );`);
}

export const getMonthSummary = async(
    month: number,
    year: number
): Promise<Month | null> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Month>(
        'SELECT * FROM months WHERE month = ? AND year = ?;', [month, year]
    );

    return result ?? null;
}

export const getAllMonths = async (): Promise<Month[]> => {
    const db = await getDatabase();
    const result = await db.getAllAsync<Month>(
        'SELECT * FROM months ORDER BY year DESC, month DESC;'
    );

    return result;
}

export const upsertMonthSummary = async(
    month: number,
    year: number,
    summary: Omit<Month, 'id' | 'month' | 'year' | 'updated_at'>
): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync(
        `INSERT INTO months (
            month,
            year,
            total_regular_hours,
            total_overtime_hours,
            total_holiday_hours,
            total_nightshift_hours,
            total_nightshift_allowance,
            total_lost_time_minutes,
            total_expected_earnings,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT (month, year) DO UPDATE SET
            total_regular_hours = excluded.total_regular_hours,
            total_overtime_hours = excluded.total_overtime_hours,
            total_holiday_hours = excluded.total_holiday_hours,
            total_nightshift_hours = excluded.total_nightshift_hours,
            total_nightshift_allowance = excluded.total_nightshift_allowance,
            total_lost_time_minutes = excluded.total_lost_time_minutes,
            total_expected_earnings = excluded.total_expected_earnings,
            updated_at = datetime('now')
        `,
        [month, year, summary.total_regular_hours, summary.total_overtime_hours, summary.total_holiday_hours, summary.total_nightshift_hours, summary.total_nightshift_allowance, summary.total_lost_time_minutes, summary.total_expected_earnings]
    );
}

export const recalculateMonthSummary = async(
    month: number,
    year: number
): Promise<void> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{
        total_regular_hours: number;
        total_overtime_hours: number;
        total_holiday_hours: number;
        total_nightshift_hours: number;
        total_nightshift_allowance: number;
        total_lost_time_minutes: number;
        total_expected_earnings: number;
    }>(
        `SELECT
            SUM(CASE WHEN shift_type = 'Regular' OR shift_type = 'Nightshift'
                THEN regular_hours ELSE 0 END) as total_regular_hours,
            SUM(CASE WHEN shift_type = 'Holiday'
                THEN regular_hours ELSE 0 END) as total_holiday_hours,
            SUM(CASE WHEN shift_type = 'Nightshift'
                THEN regular_hours ELSE 0 END) as total_nightshift_hours,
            SUM(nightshift_allowance) as total_nightshift_allowance,
            SUM(lost_time_minutes) as total_lost_time_minutes,
            SUM(expected_earnings) as total_expected_earnings
            FROM logged_shifts
            WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?;`,
        [month.toString().padStart(2, '0'), year.toString()]
    );

    if (result) {
        await upsertMonthSummary(month, year, {
            total_regular_hours: result.total_regular_hours ?? 0,
            total_overtime_hours: result.total_overtime_hours ?? 0,
            total_holiday_hours: result.total_holiday_hours ?? 0,
            total_nightshift_hours: result.total_nightshift_hours ?? 0,
            total_nightshift_allowance: result.total_nightshift_allowance ?? 0,
            total_lost_time_minutes: result.total_lost_time_minutes ?? 0,
            total_expected_earnings: result.total_expected_earnings ?? 0,
        });
    }
}