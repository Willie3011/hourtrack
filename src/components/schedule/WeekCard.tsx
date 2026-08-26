import { borderRadius, colors, fontSize, fontWeight, shadow, spacing } from "@/src/utils/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScheduleThumbnail from './ScheduleThumbnail';
interface WeekCardProps {
    weekStartDate: string;
    weekEndDate: string;
    tag: string;
    imageUri?: string | null;
    shiftCount: number;
    totalHours: number;
    onViewDetails: () => void;
    onViewImage: () => void;
}

export default function WeekCard({
    weekStartDate,
    weekEndDate,
    tag,
    imageUri,
    shiftCount,
    totalHours,
    onViewDetails,
    onViewImage
}: WeekCardProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.dateRange}>
                    {formatDate(weekStartDate)} - {formatDate(weekEndDate)}
                </Text>
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                </View>
            </View>

            <View style={styles.body}>
                {
                    imageUri ? (
                        <ScheduleThumbnail imageUri={imageUri} onPress={onViewImage} />
                    ) : (
                            <Text style={styles.noImage}>No schedule image saved</Text>
                    )
                }
                <Text style={styles.shiftInfo}>
                    {shiftCount} {shiftCount === 1 ? 'shift' : 'shifts'} · {totalHours} hrs
                </Text>
                <TouchableOpacity onPress={onViewDetails} activeOpacity={0.7}>
                    <Text style={styles.viewDetails}>View week details</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: spacing.md,
        ...shadow.sm
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    dateRange: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary
    },
    tag: {
        backgroundColor: colors.border,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.xs
    },
    tagText: {
        fontSize: fontSize.caption,
        color: colors.textMuted
    },
    body: {
        padding: spacing.md,
        backgroundColor: colors.background
    },
    noImage: {
        fontSize: fontSize.caption,
        color: colors.textMuted,
        fontStyle: 'italic',
        marginBottom: spacing.sm
    },
    shiftInfo: {
        fontSize: fontSize.caption,
        color: colors.textMuted,
        marginTop: spacing.sm,
        marginBottom: spacing.xs
    },
    viewDetails: {
        fontSize: fontSize.caption,
        color: colors.emerald,
        fontWeight: fontWeight.semibold,
        marginTop: spacing.xs
    }
})