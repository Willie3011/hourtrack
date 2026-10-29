import { LoggedShift } from '../database/loggedShifts';
import { Settings } from '../database/settings';
import { ScheduledShiftWithWeek } from '../database/schedulesShifts';
import { calculateNetShiftMinutes, formatDuration } from './calaculations';
import {
  DAY_NAMES,
  MONTH_NAMES,
  addDays,
  getMondayOf,
  parseDateString,
  toDateString,
} from './dates';

export interface Period {
  start: string;
  end: string;
  label: string;
  subLabel: string;
}

export interface ShiftTotals {
  shiftCount: number;
  regularMinutes: number;
  regularEarnings: number;
  overtimeMinutes: number;
  overtimeEarnings: number;
  holidayMinutes: number;
  holidayEarnings: number;
  nightshiftMinutes: number;
  nightshiftEarnings: number;
  lostTimeMinutes: number;
  totalMinutes: number;
  totalEarnings: number;
}

export const formatMoney = (n: number): string => `R ${n.toFixed(2)}`;

const shortDate = (d: Date): string =>
  d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });

export const getWeekPeriod = (offset: number): Period => {
  const monday = addDays(getMondayOf(new Date()), offset * 7);
  const sunday = addDays(monday, 6);
  return {
    start: toDateString(monday),
    end: toDateString(sunday),
    label: `${shortDate(monday)} — ${shortDate(sunday)}`,
    subLabel:
      offset === 0 ? 'Current week'
      : offset === -1 ? 'Last week'
      : `${-offset} weeks ago`,
  };
};

export const getMonthPeriod = (offset: number): Period => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  return {
    start: toDateString(first),
    end: toDateString(last),
    label: `${MONTH_NAMES[first.getMonth()]} ${first.getFullYear()}`,
    subLabel:
      offset === 0 ? 'Current month'
      : offset === -1 ? 'Last month'
      : `${-offset} months ago`,
  };
};

export const summariseShifts = (
  shifts: LoggedShift[],
  settings: Settings
): ShiftTotals => {
  const t: ShiftTotals = {
    shiftCount: shifts.length,
    regularMinutes: 0, regularEarnings: 0,
    overtimeMinutes: 0, overtimeEarnings: 0,
    holidayMinutes: 0, holidayEarnings: 0,
    nightshiftMinutes: 0, nightshiftEarnings: 0,
    lostTimeMinutes: 0, totalMinutes: 0, totalEarnings: 0,
  };

  for (const s of shifts) {
    const rate = s.hourly_rate_at_time;

    if (s.shift_type === 'Regular') {
      t.regularMinutes += s.regular_hours * 60;
      t.regularEarnings += s.regular_hours * rate;
    } else if (s.shift_type === 'Holiday') {
      t.holidayMinutes += s.regular_hours * 60;
      t.holidayEarnings += s.regular_hours * rate * settings.holiday_multiplier;
    } else {
      t.nightshiftMinutes += s.regular_hours * 60;
      t.nightshiftEarnings += s.regular_hours * rate + s.nightshift_allowance;
    }

    // Includes the built-in nightshift overtime hour
    t.overtimeMinutes += s.overtime_hours * 60;
    t.overtimeEarnings += s.overtime_hours * rate * settings.overtime_multiplier;

    t.lostTimeMinutes += s.lost_time_minutes;
    t.totalEarnings += s.expected_earnings;
  }

  t.regularMinutes = Math.round(t.regularMinutes);
  t.overtimeMinutes = Math.round(t.overtimeMinutes);
  t.holidayMinutes = Math.round(t.holidayMinutes);
  t.nightshiftMinutes = Math.round(t.nightshiftMinutes);
  t.totalMinutes =
    t.regularMinutes + t.overtimeMinutes + t.holidayMinutes + t.nightshiftMinutes;

  return t;
};

// Works out which calendar date each scheduled shift falls on,
// then counts only the shifts inside the period
export const calculateScheduledMinutes = (
  rows: ScheduledShiftWithWeek[],
  start: string,
  end: string
): number => {
  let total = 0;
  for (const r of rows) {
    const weekStart = parseDateString(r.week_start_date);
    for (let i = 0; i < 14; i++) {
      const d = addDays(weekStart, i);
      if (toDateString(d) > r.week_end_date) break;
      if (DAY_NAMES[d.getDay()] === r.day_of_week) {
        const ds = toDateString(d);
        if (ds >= start && ds <= end) {
          total += calculateNetShiftMinutes(r.shift_start, r.shift_end);
        }
        break;
      }
    }
  }
  return total;
};

export const buildReportText = (params: {
  periodTitle: string;
  shifts: LoggedShift[];
  totals: ShiftTotals;
  scheduledMinutes: number;
}): string => {
  const { periodTitle, shifts, totals, scheduledMinutes } = params;
  const lines: string[] = [];

  lines.push(`HourTrack report — ${periodTitle}`);
  lines.push('');
  lines.push(`Shifts logged: ${totals.shiftCount}`);

  if (scheduledMinutes > 0) {
    const diff = totals.totalMinutes - scheduledMinutes;
    lines.push(`Scheduled hours: ${formatDuration(scheduledMinutes)}`);
    lines.push(`Logged hours: ${formatDuration(totals.totalMinutes)}`);
    lines.push(
      diff === 0
        ? 'Difference: none'
        : `Difference: ${diff < 0 ? '-' : '+'}${formatDuration(Math.abs(diff))}`
    );
  } else {
    lines.push(`Logged hours: ${formatDuration(totals.totalMinutes)}`);
  }

  lines.push('');
  lines.push('Breakdown');
  lines.push(`Regular: ${formatDuration(totals.regularMinutes)} · ${formatMoney(totals.regularEarnings)}`);
  lines.push(`Overtime: ${formatDuration(totals.overtimeMinutes)} · ${formatMoney(totals.overtimeEarnings)}`);
  lines.push(`Public holiday: ${formatDuration(totals.holidayMinutes)} · ${formatMoney(totals.holidayEarnings)}`);
  lines.push(`Nightshift: ${formatDuration(totals.nightshiftMinutes)} · ${formatMoney(totals.nightshiftEarnings)}`);
  lines.push(`Lost time: ${formatDuration(totals.lostTimeMinutes)}`);
  lines.push('');
  lines.push(`Expected gross (before deductions): ${formatMoney(totals.totalEarnings)}`);
  lines.push('');
  lines.push('Shift details');

  const sorted = [...shifts].sort((a, b) => a.date.localeCompare(b.date));
  for (const s of sorted) {
    const d = parseDateString(s.date).toLocaleDateString('en-ZA', {
      weekday: 'short', day: 'numeric', month: 'short',
    });
    const hours = formatDuration(Math.round((s.regular_hours + s.overtime_hours) * 60));
    const lost = s.lost_time_minutes > 0 ? ` · lost ${formatDuration(s.lost_time_minutes)}` : '';
    lines.push(
      `${d} · ${s.shift_start}–${s.shift_end} · ${s.shift_type} · ${hours} · ${formatMoney(s.expected_earnings)}${lost}`
    );
  }

  return lines.join('\n');
};