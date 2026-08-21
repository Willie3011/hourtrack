import { View, Text, StyleSheet } from 'react-native';
import {
    colors,
    fontSize,
    fontWeight,
    borderRadius,
    spacing
} from '../../utils/theme';


interface RuleBoxProps {
    title: string;
    rules: string[];
}

export default function RuleBox({ title, rules }: RuleBoxProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {rules.map((rule, index) => (
                <View key={index} style={styles.ruleBox}>
                    <View style={styles.accent} />
                    <Text style={styles.rule}>{rule}</Text>
                </View>
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
    title: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm
    },
    ruleBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
        marginBottom: spacing.xs
    },
    accent: {
        width: 3,
        height: '100%',
        minHeight: 16,
        borderRadius: borderRadius.full,
        backgroundColor: colors.emerald,
        marginTop: 2
    },
    rule: {
        fontSize: fontSize.caption,
        color: colors.textSecondary,
        flex: 1,
        lineHeight: 18
    }
})