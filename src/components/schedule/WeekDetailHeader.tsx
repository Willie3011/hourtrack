import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    colors,
    fontSize,
    fontWeight,
    spacing
} from '../../utils/theme';

interface WeekDetailHeaderProps {
    weekStartDate: string;
    weekEndDate: string;
    tag: string;
    onBack: () => void
}

export default function WeekDetailHeader({
    weekStartDate,
    weekEndDate,
    tag,
    onBack
}: WeekDetailHeaderProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onBack}
                activeOpacity={0.7}
                style={styles.backBtn}
            >
                <Ionicons name="arrow-back" size={20} color={colors.textPrimary}/>
                <Text style={styles.backLabel}>Schedule</Text>
            </TouchableOpacity>
            <Text style={styles.dateRange}>
                {formatDate(weekStartDate)} - {formatDate(weekEndDate)}
            </Text>
            <Text style={styles.tag}>{tag}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginBottom: spacing.sm
    },
    backLabel: {
        fontSize: fontSize.caption,
        color: colors.textMuted
    },
    dateRange: {
        fontSize: fontSize.h2,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs
    },
    tag: {
        fontSize: fontSize.caption,
        color: colors.textMuted
    }
})