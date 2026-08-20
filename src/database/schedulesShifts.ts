import { getDatabase } from './index';

export interface ScheduledShift {
    id?: number;
    week_id: number;
    day_of_week: string;
    shift_start: string;
    shift_end: string;
    created_at?: string;
}

export const createScheduledShiftsTable = async (): Promise<void> => {
    const db = await getDatabase();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS scheduled_shifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            week_id INTEGER NOT NULL,
            day_of_week TEXT NOT NULL,
            shift_start TEXT NOT NULL,
            shift_end TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (week_id) REFERENCES weeks (id) ON DELETE CASCADE      
        );
    `);
};

export const getShiftsByWeekId = async (week_id: number): Promise<ScheduledShift[]> => {
    const db = await getDatabase();
    const result = await db.getAllAsync<ScheduledShift>(
        `SELECT * FROM scheduled_shifts
         WHERE week_id = ?
         ORDER BY CASE day_of_week
            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            WHEN 'Saturday' THEN 6
            WHEN 'Sunday' THEN 7   
        END;`,
        [week_id]
    );
    return result;
}

export const createScheduledShift = async (shift: ScheduledShift): Promise<number> => {
    const db = await getDatabase();
    const result = await db.runAsync(
        `INSERT INTO scheduled_shifts (
            week_id,
            day_of_week,
            shift_start,
            shift_end,
            created_at
        ) VALUES (?, ?, ?, ?, datetime('now'));`,
        [
            shift.week_id,
            shift.day_of_week,
            shift.shift_start,
            shift.shift_end
        ]
    );
    return result.lastInsertRowId;
}

export const updateScheduledShift = async (shift: ScheduledShift): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync(
        `UPDATE scheduled_shifts SET
            day_of_week = ?,
            shift_start = ?,
            shift_end = ?
         WHERE id = ?;`,
        [
            shift.day_of_week,
            shift.shift_start,
            shift.shift_end,
            shift.id!
        ]
    );
}

export const deleteScheduledShift = async (id: number): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM scheduled_shifts WHERE id = ?;', [id]);
}