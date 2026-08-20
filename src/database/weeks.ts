import { getDatabase } from "./index";

export interface Week { 
    id?: number;
    week_start_date: string;
    week_end_date: string;
    schedule_image_url?: string | null;
    created_at?: string;
}

export const createWeeksTable = async (): Promise<void> => {
    const db = await getDatabase();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS weeks (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            week_start_date TEXT NOT NULL,
            week_end_date TEXT NOT NULL,
            schedule_image_url TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );
    `);
};

export const getAllWeeks = async (): Promise<Week[]> => {
    const db = await getDatabase();
    const result = await db.getAllAsync<Week>(
        `SELECT * FROM weeks ORDER BY week_start_date DESC;`
    );
    return result;
}

export const getWeekById = async (id: number): Promise<Week | null> => {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Week>(
        `SELECT * FROM weeks WHERE id = ?;`,
        [id]
    );
    return result ?? null;
}

export const createWeek = async (week: Week): Promise<number> => {
    const db = await getDatabase();
    const result = await db.runAsync(
        `INSERT INTO weeks (
            week_start_date,
            week_end_date,
            schedule_image_url,
            created_at
        ) VALUES (?, ?, ?, datetime('now'));`,
        [
            week.week_start_date,
            week.week_end_date,
            week.schedule_image_url ?? null
        ]
    );

    return result.lastInsertRowId;
};

export const updateWeekImage = async (
    id: number,
    schedule_image_url: string
): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync(
        `UPDATE weeks SET schedule_image_url = ? WHERE id = ?;`,
        [schedule_image_url, id]
    );
};

export const deleteWeek = async (id: number): Promise<void> => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM weeks WHERE id = ?;', [id]);
};