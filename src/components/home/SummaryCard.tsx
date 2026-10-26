import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/src/utils/theme";
import { StyleSheet, Text, View } from "react-native";

interface SummaryCardProps {
  label: string;
  hours: number;
  earnings: number;
  subLabel: string;
  isEmpty?: boolean;
}

export default function SummaryCard({
  label,
  hours,
  earnings,
  subLabel,
  isEmpty = false,
}: SummaryCardProps) {
  return (
    <View style={[styles.card, isEmpty && styles.cardEmpty]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.hours, isEmpty && styles.emptyText]}>
        {hours} hrs
      </Text>
      <Text style={[styles.earnings, isEmpty && styles.emptyText]}>
        R{earnings.toFixed(2)}
      </Text>
      <Text style={styles.subLabel}>{subLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    backgroundColor: colors.emerald,
  },
  cardEmpty: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    backgroundColor: colors.surface,
  },
  label: {
    fontSize: fontSize.caption,
    color: "rgba(255,255,255,0.7)",
    marginBottom: spacing.xs,
  },
  hours: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    color: colors.background,
    marginBottom: spacing.xs,
  },
  earnings: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: "rgba(255,255,255,0.9)",
    marginBottom: spacing.xs,
  },
  subLabel: {
    fontSize: fontSize.caption,
    color: "rgba(255,255,255,0.6)",
  },
  emptyText: {
    color: colors.border,
  },
});
