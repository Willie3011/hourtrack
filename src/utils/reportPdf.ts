import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {File, Paths} from 'expo-file-system';
import { LoggedShift } from '../database/loggedShifts';
import { ShiftTotals, formatMoney } from './summary';
import { formatDuration } from './calaculations';
import { parseDateString } from './dates';

interface ReportParams {
  periodTitle: string;
  shifts: LoggedShift[];
  totals: ShiftTotals;
  scheduledMinutes: number;
  workerName?: string;
}

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const buildReportHtml = ({
  periodTitle,
  shifts,
  totals,
  scheduledMinutes,
  workerName
}: ReportParams): string => {
  const generatedOn = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hasSchedule = scheduledMinutes > 0;
  const diff = totals.totalMinutes - scheduledMinutes;

  const discrepancy = hasSchedule
    ? `
      <h2>Scheduled vs logged</h2>
      <table class="kv">
        <tr><td>Scheduled hours</td><td>${formatDuration(scheduledMinutes)}</td></tr>
        <tr><td>Logged hours</td><td>${formatDuration(totals.totalMinutes)}</td></tr>
        <tr class="diff ${diff < 0 ? 'short' : 'ok'}">
          <td>Difference</td>
          <td>${
            diff === 0
              ? 'Matches schedule'
              : `${diff < 0 ? '-' : '+'} ${formatDuration(Math.abs(diff))}`
          }</td>
        </tr>
      </table>`
    : '';

  const sorted = [...shifts].sort((a, b) => a.date.localeCompare(b.date));
  const shiftRows = sorted
    .map((s) => {
      const d = parseDateString(s.date).toLocaleDateString('en-ZA', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      const hours = formatDuration(
        Math.round((s.regular_hours + s.overtime_hours) * 60)
      );
      const lost =
        s.lost_time_minutes > 0 ? formatDuration(s.lost_time_minutes) : '—';
      return `
        <tr>
          <td>${escapeHtml(d)}</td>
          <td>${escapeHtml(s.shift_start)} – ${escapeHtml(s.shift_end)}</td>
          <td>${escapeHtml(s.shift_type)}</td>
          <td>${hours}</td>
          <td>${lost}</td>
          <td class="num">${formatMoney(s.expected_earnings)}</td>
        </tr>`;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body { font-family: Helvetica, Arial, sans-serif; color: #111; padding: 32px; font-size: 12px; }
  .brand { color: #166534; font-size: 22px; font-weight: 700; margin: 0; }
  .period { font-size: 15px; margin: 4px 0 0; font-weight: 600; }
  .meta { color: #777; margin: 4px 0 24px; }
  h2 { font-size: 13px; color: #166534; margin: 24px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 10px; color: #777; text-transform: uppercase; padding: 6px 8px; border-bottom: 2px solid #166534; }
  td { padding: 7px 8px; border-bottom: 1px solid #e5e5e5; }
  .num { text-align: right; white-space: nowrap; }
  th.num { text-align: right; }
  .kv td:last-child { text-align: right; font-weight: 600; }
  .diff.short td:last-child { color: #e05252; }
  .diff.ok td:last-child { color: #10b981; }
  .total td { border-top: 2px solid #166534; border-bottom: none; font-size: 14px; font-weight: 700; }
  .total td:last-child { color: #059669; }
  .note { margin-top: 28px; color: #777; font-size: 10px; line-height: 1.5; }
</style>
</head>
<body>
  <p class="brand">HourTrack</p>
  <p class="period">${escapeHtml(periodTitle)}</p>
  <p class="meta">${workerName ? `${escapeHtml(workerName)} · ` : ''}Generated ${escapeHtml(generatedOn)} · ${totals.shiftCount} shift${totals.shiftCount === 1 ? '' : 's'} logged</p>

  ${discrepancy}

  <h2>Hours and earnings</h2>
  <table class="kv">
    <tr><td>Regular</td><td>${formatDuration(totals.regularMinutes)} · ${formatMoney(totals.regularEarnings)}</td></tr>
    <tr><td>Overtime</td><td>${formatDuration(totals.overtimeMinutes)} · ${formatMoney(totals.overtimeEarnings)}</td></tr>
    <tr><td>Public holiday</td><td>${formatDuration(totals.holidayMinutes)} · ${formatMoney(totals.holidayEarnings)}</td></tr>
    <tr><td>Nightshift</td><td>${formatDuration(totals.nightshiftMinutes)} · ${formatMoney(totals.nightshiftEarnings)}</td></tr>
    <tr><td>Lost time</td><td>${totals.lostTimeMinutes > 0 ? formatDuration(totals.lostTimeMinutes) : 'None'}</td></tr>
    <tr class="total"><td>Expected gross</td><td>${formatMoney(totals.totalEarnings)}</td></tr>
  </table>

  <h2>Shift details</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th><th>Times</th><th>Type</th><th>Hours</th><th>Lost</th><th class="num">Earnings</th>
      </tr>
    </thead>
    <tbody>${shiftRows}</tbody>
  </table>

  <p class="note">
    Expected gross is calculated from the worker's own logged hours, before deductions.
    Lunch is deducted at 1 hour per shift, with any extra lunch time counted as lost time.
  </p>
</body>
</html>`;
};

const safeFileName = (
  workerName: string | undefined,
  periodTitle: string
): string => {
  const clean = (s: string) =>
    s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const parts = [
    'HourTrack',
    workerName ? clean(workerName) : '',
    clean(periodTitle),
  ].filter(Boolean);
  return `${parts.join('-')}.pdf`;
};

export const exportReportPdf = async (params: ReportParams): Promise<void> => {
  const html = buildReportHtml(params);
  const { uri } = await Print.printToFileAsync({ html });

  // Rename so the recipient sees a meaningful file name.
  // If the rename fails for any reason, share with the default name instead.
  let shareUri = uri;
  try {
    const target = new File(
      Paths.cache,
      safeFileName(params.workerName, params.periodTitle)
    );
    if (target.exists) target.delete();
    const source = new File(uri);
    source.move(target);
    shareUri = source.uri;
  } catch (error) {
    console.error('PDF rename failed, sharing with default name:', error);
  }

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing is not available on this device');
  }

  await Sharing.shareAsync(shareUri, {
    mimeType: 'application/pdf',
    UTI: 'com.adobe.pdf',
    dialogTitle: `HourTrack — ${params.periodTitle}`,
  });
};