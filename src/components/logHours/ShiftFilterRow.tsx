import {ScrollView, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colors, fontSize, fontWeight, borderRadius, spacing} from '@/src/utils/theme';

type FilterType = 'All' | 'Regular' | 'Holiday' | 'Nightshift';

interface ShiftFilterRowProps {
    activeFilter: FilterType;
    onChange: (filter: FilterType) => void;
}

const FILTERS: FilterType[] = ['All', 'Regular', 'Holiday', 'Nightshift'];

export default function ShiftFilterRow({
    activeFilter,
    onChange
}: ShiftFilterRowProps) {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {FILTERS.map((filter) => (
                <TouchableOpacity
                    key={filter}
                    style={[styles.btn, activeFilter === filter && styles.btnActive]}
                    onPress={() => onChange(filter)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.label, activeFilter === filter && styles.labelActive]}>
                        {filter}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.sm,
        paddingBottom: spacing.md
    },
    btn: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface
    },
    btnActive: {
        backgroundColor: colors.emerald,
        borderColor: colors.emerald
    },
    label: {
        fontSize: fontSize.caption,
        color: colors.textMuted,
        fontWeight: fontWeight.medium
    },
    labelActive: {
        color: colors.background,
        fontWeight: fontWeight.bold
    }
})