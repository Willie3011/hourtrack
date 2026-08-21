import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '../../utils/theme';

interface AppToggleProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    hint?: string;
}

export default function AppToggle({
    label,
    value,
    onValueChange,
    hint
}: AppToggleProps) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <TouchableOpacity
                    style={[styles.track, value && styles.trackOn]}
                    onPress={() => onValueChange(!value)}
                    activeOpacity={0.8}
                >
                    <View style={[styles.thumb, value && styles.thumbOn]} />
                </TouchableOpacity>
            </View>
            {hint && (
                <Text style={styles.hint}>{hint}</Text>
            )}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    label: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.medium,
        color: colors.textPrimary,
        flex: 1,
        marginRight: spacing.md
    },
    track: {
        width: 44,
        height: 24,
        borderRadius: borderRadius.full,
        backgroundColor: colors.border,
        justifyContent: 'center',
        padding: 2,
    },
    trackOn: {
        backgroundColor: colors.emerald
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: borderRadius.full,
        backgroundColor: colors.background,
        alignSelf: 'flex-start',
    },
    thumbOn: {
        alignSelf: "flex-end"
    },
    hint: {
        fontSize: fontSize.hint,
        color: colors.textHint,
        marginTop: spacing.xs,
        fontStyle: 'italic'
    },
})