import { getDatabase } from './db';
import { createSettingsTable } from './settings';
import { createWeeksTable } from './weeks';
import { createScheduledShiftsTable } from './schedulesShifts';
import { createLoggedShiftsTable } from './loggedShifts';
import { createMonthsTable } from './months';

export { getDatabase };

export const initDatabase = async (): Promise<void> => {
  await getDatabase();
  await createSettingsTable();
  await createWeeksTable();
  await createScheduledShiftsTable();
  await createLoggedShiftsTable();
  await createMonthsTable();
  console.log('HourTrack database initialised successfully');
};