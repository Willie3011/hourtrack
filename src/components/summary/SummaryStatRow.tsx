import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, borderRadius, spacing } from '../../utils/theme';
import { formatDuration } from '../../utils/calaculations';
import { formatMoney } from '../../utils/summary';

interface Props {
  totalMinutes: number;
  totalEarnings: number;
  periodLabel: string;
  isEmpty: boolean;
}

export default function SummaryStatRow({
  totalMinutes, totalEarnings, periodLabel, isEmpty,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.card, styles.hoursCard, isEmpty && styles.empty]}>
        <Text style={[styles.label, isEmpty && styles.emptyText]}>Total hours</Text>
        <Text style={[styles.value, isEmpty && styles.emptyText]}>
          {formatDuration(totalMinutes)}
        </Text>
        <Text style={[styles.sub, isEmpty && styles.emptyText]}>{periodLabel}</Text>
      </View>
      <View style={[styles.card, styles.earningsCard, isEmpty && styles.empty]}>
        <Text style={[styles.label, isEmpty && styles.emptyText]}>Expected gross</Text>
        <Text style={[styles.value, isEmpty && styles.emptyText]}>
          {formatMoney(totalEarnings)}
        </Text>
        <Text style={[styles.sub, isEmpty && styles.emptyText]}>Before deductions</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  card: { flex: 1, borderRadius: borderRadius.xl, padding: spacing.md },
  hoursCard: { backgroundColor: colors.emerald },
  earningsCard: { backgroundColor: colors.forest },
  empty: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  label: { fontSize: fontSize.caption, color: 'rgba(255,255,255,0.7)', marginBottom: spacing.xs },
  value: { fontSize: fontSize.h2, fontWeight: fontWeight.bold, color: colors.background, marginBottom: spacing.xs },
  sub: { fontSize: fontSize.caption, color: 'rgba(255,255,255,0.6)' },
  emptyText: { color: colors.textHint },
});