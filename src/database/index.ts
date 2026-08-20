import * as SQLite from 'expo-sqlite';
import { createSettingsTable } from './settings';
import { createWeeksTable } from './weeks';
import { createScheduledShiftsTable } from './schedulesShifts';
import { createLoggedShiftsTable } from './loggedShifts';
import { createMonthsTable } from './months';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if(db) return db;
    db = await SQLite.openDatabaseAsync('hourtrack.db');
    return db;
}

export const initDatabase = async (): Promise<void> => { 
    const database = await getDatabase();
    
    await database.execAsync(`PRAGMA journal_mode = WAL;`);
    await database.execAsync(`PRAGMA foreign_keys = ON;`);

    await createSettingsTable();
    await createWeeksTable();
    await createScheduledShiftsTable();
    await createLoggedShiftsTable();
    await createMonthsTable();

    console.log('Hourtrack database initialized successfully.');
}