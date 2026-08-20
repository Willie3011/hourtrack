import { getDatabase } from "./index";

export interface LoggedShift {
    id?: number;
    date: string;
    shift_start: string;
    shift_end: string;
    shift_type: 'Regular' | 'Holiday' | 'Nightshift';
    overtime_before_enabled: number;
    overtime_before_start?: string | null;
    overtime_before_end?: string | null;
    overtime_after_enabled: number;
    overtime_after_start?: string | null;
    overtime_after_end?: string | null;
    arrival_time?: string | null;
    lunch_out?: string | null;
    lunch_in?: string | null;
    lost_time_minutes: number;
    hourly_rate_at_time: number;
    regular_hours: number;
    overtime_hours: number;
    nightshift_allowance: number;
    expected_earnings: number;
    created_at?: string;
}

export const createLoggedShiftsTable = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS logged_shifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      date TEXT NOT NULL,
      shift_start TEXT NOT NULL,
      shift_end TEXT NOT NULL,
      shift_type TEXT NOT NULL,
      overtime_before_enabled INTEGER NOT NULL DEFAULT 0,
      overtime_before_start TEXT,
      overtime_before_end TEXT,
      overtime_after_enabled INTEGER NOT NULL DEFAULT 0,
      overtime_after_start TEXT,
      overtime_after_end TEXT,
      arrival_time TEXT,
      lunch_out TEXT,
      lunch_in TEXT,
      lost_time_minutes INTEGER NOT NULL DEFAULT 0,
      hourly_rate_at_time REAL NOT NULL,
      regular_hours REAL NOT NULL DEFAULT 0,
      overtime_hours REAL NOT NULL DEFAULT 0,
      nightshift_allowance REAL NOT NULL DEFAULT 0,
      expected_earnings REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
};

export const getAllLoggedShifts = async (): Promise<LoggedShift[]> => { 
    const db = await getDatabase();
    const result = await db.getAllAsync<LoggedShift>(
        `SELECT * FROM logged_shifts ORDER BY date DESC`
    );
    return result;
}

// Get logged shifts by month and year
export const getLoggedShiftsByMonth = async(
    month: number,
    year: number
): Promise<LoggedShift[]> => {
    const db = await getDatabase();
    const result = await db.getAllAsync<LoggedShift>(
        `SELECT * FROM logged_shifts 
        WHERE strftime('%m', date) = ?
        AND strftime('%Y', date) = ?
        ORDER BY date DESC`,
        [month.toString().padStart(2, '0'), year.toString()]
    );
    return result;

}

// Get logged shifts by week (weekStartDate and weekEndDate are in 'YYYY-MM-DD' format)
export const getLoggedShiftsByWeek = async (
  weekStartDate: string,
  weekEndDate: string
): Promise<LoggedShift[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<LoggedShift>(
    `SELECT * FROM logged_shifts 
     WHERE date >= ? AND date <= ?
     ORDER BY date DESC;`,
    [weekStartDate, weekEndDate]
  );
  return result;
};

// Get recent logged shifts, limited by the specified number (default is 3)
export const getRecentLoggedShifts = async (
  limit: number = 3
): Promise<LoggedShift[]> => {
  const db = await getDatabase();
  const result = await db.getAllAsync<LoggedShift>(
    'SELECT * FROM logged_shifts ORDER BY date DESC LIMIT ?;',
    [limit]
  );
  return result;
};

// create a new logged shift and return the inserted row ID
export const createLoggedShift = async (
  shift: LoggedShift
): Promise<number> => {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO logged_shifts (
      date,
      shift_start,
      shift_end,
      shift_type,
      overtime_before_enabled,
      overtime_before_start,
      overtime_before_end,
      overtime_after_enabled,
      overtime_after_start,
      overtime_after_end,
      arrival_time,
      lunch_out,
      lunch_in,
      lost_time_minutes,
      hourly_rate_at_time,
      regular_hours,
      overtime_hours,
      nightshift_allowance,
      expected_earnings,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'));`,
    [
      shift.date,
      shift.shift_start,
      shift.shift_end,
      shift.shift_type,
      shift.overtime_before_enabled,
      shift.overtime_before_start ?? null,
      shift.overtime_before_end ?? null,
      shift.overtime_after_enabled,
      shift.overtime_after_start ?? null,
      shift.overtime_after_end ?? null,
      shift.arrival_time ?? null,
      shift.lunch_out ?? null,
      shift.lunch_in ?? null,
      shift.lost_time_minutes,
      shift.hourly_rate_at_time,
      shift.regular_hours,
      shift.overtime_hours,
      shift.nightshift_allowance,
      shift.expected_earnings,
    ]
  );
  return result.lastInsertRowId;
};

// update an existing logged shift by its ID
export const updateLoggedShift = async (
  shift: LoggedShift
): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE logged_shifts SET
      date = ?,
      shift_start = ?,
      shift_end = ?,
      shift_type = ?,
      overtime_before_enabled = ?,
      overtime_before_start = ?,
      overtime_before_end = ?,
      overtime_after_enabled = ?,
      overtime_after_start = ?,
      overtime_after_end = ?,
      arrival_time = ?,
      lunch_out = ?,
      lunch_in = ?,
      lost_time_minutes = ?,
      hourly_rate_at_time = ?,
      regular_hours = ?,
      overtime_hours = ?,
      nightshift_allowance = ?,
      expected_earnings = ?
     WHERE id = ?;`,
    [
      shift.date,
      shift.shift_start,
      shift.shift_end,
      shift.shift_type,
      shift.overtime_before_enabled,
      shift.overtime_before_start ?? null,
      shift.overtime_before_end ?? null,
      shift.overtime_after_enabled,
      shift.overtime_after_start ?? null,
      shift.overtime_after_end ?? null,
      shift.arrival_time ?? null,
      shift.lunch_out ?? null,
      shift.lunch_in ?? null,
      shift.lost_time_minutes,
      shift.hourly_rate_at_time,
      shift.regular_hours,
      shift.overtime_hours,
      shift.nightshift_allowance,
      shift.expected_earnings,
      shift.id!,
    ]
  );
};

// delete a logged shift by its ID
export const deleteLoggedShift = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync(
    'DELETE FROM logged_shifts WHERE id = ?;',
    [id]
  );
};