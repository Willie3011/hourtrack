import { borderRadius, colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ShiftTypeButtonProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

export default function ShiftTypeButton({
    label,
    selected,
    onPress
}: ShiftTypeButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.btn, selected && styles.btnSelected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.label, selected && styles.labelSelected]}>
                {label}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center'
    },
    btnSelected: {
        backgroundColor: colors.emerald,
        borderColor: colors.emerald
    },
    label: {
        fontSize: fontSize.caption,
        fontWeight: fontWeight.medium,
        color: colors.textMuted
    },
    labelSelected: {
        color: colors.background,
        fontWeight: fontWeight.bold
    }
})