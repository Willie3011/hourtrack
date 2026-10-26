import { borderRadius, colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { StyleSheet, Text, View } from "react-native";

interface RecentShiftItemProps {
  date: string;
  shiftType: "Regular" | "Holiday" | "Nightshift";
  hours: number;
  earnings: number;
}

const BADGE_COLORS = {
  Regular: { bg: colors.regularBadgeBg, text: colors.regularBadgeText },
  Holiday: { bg: colors.holidayBadgeBg, text: colors.holidayBadgeText },
  Nightshift: {
    bg: colors.nightshiftBadgeBg,
    text: colors.nightshiftBadgeText,
  },
};

export default function RecentShiftItem({
  date,
  shiftType,
  hours,
  earnings,
}: RecentShiftItemProps) {
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-ZA", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };
  const badgeColor = BADGE_COLORS[shiftType];

  return (
    <View style={styles.item}>
      <View style={styles.left}>
        <Text style={styles.date}>{formatDate(date)}</Text>
        <View style={[styles.badge, { backgroundColor: badgeColor.bg }]}>
          <Text style={[styles.badgeText, { color: badgeColor.text }]}>
            {shiftType}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.hours}>{hours.toFixed(2)} hrs</Text>
        <Text style={styles.earnings}>R {earnings.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  date: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
  },
  right: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  hours: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  earnings: {
    fontSize: fontSize.caption,
    color: colors.emeraldDark,
    fontWeight: fontWeight.semibold,
  },
});
