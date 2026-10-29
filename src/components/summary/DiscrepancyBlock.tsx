import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, borderRadius, spacing } from '../../utils/theme';
import { formatDuration } from '../../utils/calaculations';

interface Props {
  scheduledMinutes: number;
  loggedMinutes: number;
  hasData: boolean;
}

export default function DiscrepancyBlock({
  scheduledMinutes, loggedMinutes, hasData,
}: Props) {
  const hasSchedule = scheduledMinutes > 0;
  const diff = loggedMinutes - scheduledMinutes;

  let diffText = 'No data yet';
  let diffStyle = styles.diffEmpty;

  if (hasData && !hasSchedule) {
    diffText = 'No schedule saved for this period';
  } else if (hasData && hasSchedule) {
    if (diff < 0) {
      diffText = `- ${formatDuration(-diff)} (short)`;
      diffStyle = styles.diffShort;
    } else if (diff === 0) {
      diffText = 'Matches schedule';
      diffStyle = styles.diffMatch;
    } else {
      diffText = `+ ${formatDuration(diff)} (over)`;
      diffStyle = styles.diffMatch;
    }
  }

  return (
    <View style={styles.block}>
      <View style={styles.row}>
        <Text style={styles.label}>Scheduled hours</Text>
        <Text style={styles.value}>{hasSchedule ? formatDuration(scheduledMinutes) : '—'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Logged hours</Text>
        <Text style={styles.value}>{hasData ? formatDuration(loggedMinutes) : '—'}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Difference</Text>
        <Text style={[styles.diff, diffStyle]}>{diffText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  label: { fontSize: fontSize.caption, color: colors.textMuted },
  value: { fontSize: fontSize.label, fontWeight: fontWeight.semibold, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: spacing.sm },
  diff: { fontSize: fontSize.label, fontWeight: fontWeight.bold, flexShrink: 1, textAlign: 'right' },
  diffShort: { color: colors.error },
  diffMatch: { color: colors.success },
  diffEmpty: { color: colors.textHint, fontStyle: 'italic', fontWeight: fontWeight.regular },
});