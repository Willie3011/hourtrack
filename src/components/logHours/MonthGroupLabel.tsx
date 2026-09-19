import { colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { StyleSheet, Text } from "react-native";

interface MonthGroupLabelProps {
    month: number;
    year: number;
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

export default function MonthGroupLabel({
    month,
    year
}: MonthGroupLabelProps) {
  return (
    <Text style={styles.label}>
        {MONTHS[month - 1]} {year}
    </Text>
  )
}

const styles = StyleSheet.create({
    label: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
        marginTop: spacing.lg,
        marginBottom: spacing.sm
    }
})
