import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
    colors, 
    fontSize,
    fontWeight,
    spacing } from '../../utils/theme';

interface ShiftEntryRowProps {
    day: string;
    shiftStart: string;
    shiftEnd: string;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ShiftEntryRow({
    day,
    shiftStart,
    shiftEnd,
    onEdit,
    onDelete
}: ShiftEntryRowProps) {
    const calculateHours = (start: string, end: string): string => {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hrs`;
    }

    return (
        <View style={styles.row}>
            <View style={styles.left}>
                <Text style={styles.day}>{day}</Text>
                <Text style={styles.time}>{shiftStart} - {shiftEnd}</Text>
            </View>
            <View style={styles.right}>
                <Text style={styles.hours}>
                    {calculateHours(shiftStart, shiftEnd)}
                </Text>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    left: {
        gap: spacing.xs
    },
    day: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.textMuted
    },
    time: {
        fontSize: fontSize.caption,
        color: colors.textMuted
    },
    right: {
        alignItems: 'flex-end',
        gap: spacing.xs
    },
    hours: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.semibold,
        color: colors.textSecondary
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
    delete: {
        fontSize: fontSize.caption,
        color: colors.error,
        fontWeight: fontWeight.semibold
    }
})