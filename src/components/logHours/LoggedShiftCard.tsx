import { formatDuration } from "@/src/utils/calaculations";
import { borderRadius, colors, fontSize, fontWeight, shadow, spacing } from "@/src/utils/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LoggedShiftCardProps {
    date: string;
    shiftType: 'Regular' | 'Holiday' | 'Nightshift',
    shiftStart: string;
    shiftEnd: string;
    regularHours: number;
    overtimeHours: number;
    expectedEarnings: number;
    lostTimeMinutes: number;
    onEdit: () => void;
    onDelete: () => void;
}

const BADGE_COLORS = {
    Regular: {bg: colors.regularBadgeBg, text: colors.regularBadgeText},
    Holiday: {bg: colors.holidayBadgeBg, text: colors.holidayBadgeText},
    Nightshift: {bg:colors.nightshiftBadgeBg, text: colors.nightshiftBadgeText}
}

export default function LoggedShiftCard({
    date,
    shiftType,
    shiftStart,
    shiftEnd,
    regularHours,
    overtimeHours,
    expectedEarnings,
    lostTimeMinutes,
    onEdit,
    onDelete
}:LoggedShiftCardProps) {
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-ZA', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
    };

    const badgeColors = BADGE_COLORS[shiftType]
    const totalHours = regularHours + overtimeHours;
  return (
    <View style={styles.card}>
        <View style={styles.top}>
            <Text style={styles.date}>{formatDate(date)}</Text>
            <View style={[styles.badge, {backgroundColor: badgeColors.bg}]}>
                <Text style={[styles.badgeText, {color: badgeColors.text}]}>{shiftType}</Text>
            </View>
        </View>

        <View style={styles.middle}>
            <Text style={styles.time}>{shiftStart} - {shiftEnd}</Text>
            <Text style={styles.hours}>{formatDuration(totalHours * 60)}</Text>
        </View>

        <View style={styles.bottom}>
            <View>
                <Text style={styles.earnings}>R{expectedEarnings.toFixed(2)}</Text>
                {lostTimeMinutes > 0 && (
                    <Text style={styles.lostTime}>
                        Lost time: {formatDuration(lostTimeMinutes)}
                    </Text>
                )}
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
                    <Text style={styles.edit}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} activeOpacity={0.7}>
                    <Text style={styles.delete}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadow.sm
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm
    },
    date: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary
    },
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full
    },
    badgeText: {
        fontSize: fontSize.caption,
        fontWeight: fontWeight.semibold
    },
    middle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm
    },
    time: {
        fontSize: fontSize.caption,
        color: colors.textMuted
    },
    hours: {
        fontSize: fontSize.caption,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    earnings: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.emeraldDark
    },
    lostTime: {
        fontSize: fontSize.caption,
        color: colors.textMuted,
        marginTop: spacing.xs
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md
    },
    edit: {
        fontSize: fontSize.caption,
        color: colors.emerald,
        fontWeight: fontWeight.semibold
    },
    delete:{
        fontSize: fontSize.caption,
        color: colors.error,
        fontWeight: fontWeight.semibold
    }
});