import { Settings } from "@/src/database/settings";
import { calculateShiftEarnings, formatDuration } from "@/src/utils/calaculations";
import { borderRadius, colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { StyleSheet, Text, View } from "react-native";

interface ShiftBreakdownSummaryProps{
    shiftStart: string;
    shiftEnd: string;
    shiftType: 'Regular' | 'Holiday' | 'Nightshift';
    settings: Settings;
    overtimeBeforeEnabled: boolean;
    overtimeBeforeStart: string;
    overtimeBeforeEnd: string;
    overtimeAfterEnabled: boolean;
    overtimeAfterStart: string;
    overtimeAfterEnd: string;
    lunchOut: string;
    lunchIn: string;
    arrivalTime: string;
}

export default function ShiftBreakdownSummary({
    shiftStart,
    shiftEnd,
    shiftType,
    settings,
    overtimeBeforeEnabled,
    overtimeBeforeStart,
    overtimeBeforeEnd,
    overtimeAfterEnabled,
    overtimeAfterStart,
    overtimeAfterEnd,
    lunchOut,
    lunchIn,
    arrivalTime
}: ShiftBreakdownSummaryProps) {
    if(!shiftStart || !shiftEnd) return null;

    const breakdown = calculateShiftEarnings({
        shiftStart, 
        shiftEnd,
        shiftType,
        hourlyRate: settings.hourly_rate,
        overtimeMultiplier: settings.overtime_multiplier,
        holidayMultiplier: settings.holiday_multiplier,
        overtimeBeforeStart: overtimeBeforeEnabled ? overtimeBeforeStart : null,
        overtimeBeforeEnd: overtimeBeforeEnabled ? overtimeBeforeEnd : null,
        overtimeAfterStart: overtimeAfterEnabled ? overtimeAfterStart : null,
        overtimeAfterEnd: overtimeAfterEnabled ? overtimeAfterEnd : null,
        lunchOut: lunchOut || null,
        lunchIn: lunchIn || null,
        arrivalTime: arrivalTime || null

    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shift breakdown</Text>

            <View style={styles.row}>
                <Text style={styles.label}>
                    {shiftType === 'Holiday' ? 'Holiday' : shiftType === 'Nightshift' ? 'Nightshift regular' : 'Regular'} ({formatDuration(breakdown.regularHours * 60)})
                </Text>
                <Text style={styles.value}>
                    R{(breakdown.regularHours * settings.hourly_rate * (shiftType === 'Holiday' ? settings.holiday_multiplier : 1)).toFixed(2)}
                </Text>
            </View>

            {breakdown.overtimeHours > 0 && (
                <View style={styles.row}>
                    <Text style={styles.label}>
                        Overtime ({formatDuration(breakdown.overtimeHours * 60)})
                    </Text>
                    <Text style={styles.value}>
                        R{(breakdown.overtimeHours * settings.hourly_rate * settings.overtime_multiplier).toFixed(2)}
                    </Text>
                </View>
            )}

            {shiftType === 'Nightshift' && breakdown.nightshiftAllowance > 0 && (
                <View style={styles.row}>
                    <Text style={styles.label}>Nightshift allowance (10%)</Text>
                    <Text style={styles.value}>
                        R{breakdown.nightshiftAllowance.toFixed(2)}
                    </Text>
                </View>
            )}

            <View style={styles.divider}/>

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total expected</Text>
                <Text style={styles.totalValue}>
                    R{breakdown.expectedEarnings.toFixed(2)}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md
    },
    title: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm
    },
    label: {
        fontSize: fontSize.caption,
        color: colors.textMuted,
        flex: 1,
    },
    value: {
        fontSize: fontSize.caption,
        fontWeight: fontWeight.semibold,
        color: colors.textSecondary
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.sm
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    totalLabel: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary
    },
    totalValue: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.emeraldDark
    }
})