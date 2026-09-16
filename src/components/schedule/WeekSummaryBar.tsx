import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/src/utils/theme";
import { StyleSheet, Text, View } from "react-native";

interface WeekSummaryBarProps {
  shiftCount: number;
  totalHours: number;
  contractedHours: number;
}

export default function WeekSummaryBar({
  shiftCount,
  totalHours,
  contractedHours,
}: WeekSummaryBarProps) {
  const difference = totalHours - contractedHours;
  const isShort = difference < 0;
  const isMatch = difference === 0;

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.value}>{shiftCount}</Text>
        <Text style={styles.label}>Shifts</Text>
      </View>
      <View style={styles.item}>
        <Text style={styles.value}>{totalHours} hrs</Text>
        <Text style={styles.label}>Total</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.value}>{contractedHours} hrs</Text>
        <Text style={styles.label}>Contracted</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text
          style={[
            styles.value,
            isShort && styles.valueShort,
            isMatch && styles.valueMatch,
          ]}>
          {difference === 0
            ? "0"
            : `${difference > 0 ? "+" : ""}${difference} hrs`}
        </Text>
        <Text style={styles.label}>Difference</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    justifyContent: "space-between",
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
  value: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  valueShort: {
    color: colors.error,
  },
  valueMatch: {
    color: colors.success,
  },
  label: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
});
