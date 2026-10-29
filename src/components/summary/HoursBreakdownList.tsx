import { View } from 'react-native';
import SectionHeader from '../shared/SectionHeader';
import HoursBreakdownRow from './HoursBreakdownRow';
import { ShiftTotals, formatMoney } from '../../utils/summary';
import { formatDuration } from '../../utils/calaculations';

export default function HoursBreakdownList({ totals }: { totals: ShiftTotals }) {
  return (
    <View>
      <SectionHeader title="Hours breakdown" />
      <HoursBreakdownRow
        label="Regular"
        value={`${formatDuration(totals.regularMinutes)} · ${formatMoney(totals.regularEarnings)}`}
      />
      <HoursBreakdownRow
        label="Overtime"
        value={`${formatDuration(totals.overtimeMinutes)} · ${formatMoney(totals.overtimeEarnings)}`}
      />
      <HoursBreakdownRow
        label="Public holiday"
        value={`${formatDuration(totals.holidayMinutes)} · ${formatMoney(totals.holidayEarnings)}`}
      />
      <HoursBreakdownRow
        label="Nightshift"
        value={`${formatDuration(totals.nightshiftMinutes)} · ${formatMoney(totals.nightshiftEarnings)}`}
      />
      <HoursBreakdownRow
        label="Lost time"
        value={totals.lostTimeMinutes > 0 ? formatDuration(totals.lostTimeMinutes) : 'None'}
      />
    </View>
  );
}