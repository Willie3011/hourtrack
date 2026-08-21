import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../utils/theme"

interface RatePreviewBoxProps {
    label: string;
    lines: string[];
}

export default function RatePreviewBox({
    label,
    lines
}: RatePreviewBoxProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {lines.map((line, index) => (
                <Text key={index} style={styles.line}>{line}</Text>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
        padding: spacing.md,
        marginBottom: spacing.md
    },
    label: {
        fontSize: fontSize.caption,
        color: colors.textHint,
        marginBottom: spacing.xs
    },
    line: {
        fontSize: fontSize.body,
        fontWeight: fontWeight.medium,
        color: colors.emeraldDark,
        marginBottom: spacing.xs
    }
})