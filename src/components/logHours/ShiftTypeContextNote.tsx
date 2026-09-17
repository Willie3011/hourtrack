import { Settings } from "@/src/database/settings";
import { borderRadius, colors, fontSize, spacing } from "@/src/utils/theme";
import { StyleSheet, Text, View } from "react-native";

interface ShiftTypeContextNoteProps {
    shiftType: 'Regular' | 'Holiday' | 'Nightshift';
    settings: Settings;
}

export default function ShiftTypeContextNote({
    shiftType,
    settings
}: ShiftTypeContextNoteProps) {
    if (shiftType === 'Regular') return null;

    const overtimeRate = (
        settings.hourly_rate * settings.overtime_multiplier
    ).toFixed(2);

    const holidayRate = (
        settings.hourly_rate * settings.holiday_multiplier
    ).toFixed(2);

    const nightshiftAllowance = (settings.hourly_rate * 0.1).toFixed(2);

    const getMessage = () => {
        if (shiftType === 'Holiday') {
            return `This shift will be calculated at your holiday rate of R${holidayRate} / hr`
        }
        if(shiftType === 'Nightshift') {
            return `1 hour will be converted to overtime at R${overtimeRate} / hr. Remaining hours at regular rate plus R${nightshiftAllowance} / hr nightshift allowance.`;
        }
        return null;
    };

    const message = getMessage();
    if (!message) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.emeraldLight,
        borderRadius: borderRadius.sm,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    text: {
        fontSize: fontSize.caption,
        color: colors.forest,
        lineHeight: 18
    }
})