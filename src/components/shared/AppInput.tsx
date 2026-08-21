import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../utils/theme";

interface AppInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'decimal-pad';
    hint?: string;
    error?: string;
    secureTextEntry?: boolean;
    editable?: boolean;
}

export default function AppInput({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    hint,
    error,
    secureTextEntry = false,
    editable = true
}: AppInputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    error && styles.inputError,
                    !editable && styles.inputDisabled,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textHint}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                editable={editable}
                autoCapitalize='none'
                autoCorrect={false}
            />
            {hint && !error && (
                <Text style={styles.hint}>{hint}</Text>
            )}
            {error && (
                <Text style={styles.error}>{error}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
        padding: spacing.md,
        fontSize: fontSize.body,
        color: colors.textPrimary,
        backgroundColor: colors.surface,
        minHeight: 48,
    },
    inputError: {
        borderColor: colors.error,
    },
    inputDisabled: {
        backgroundColor: colors.border,
        color: colors.textMuted
    },
    hint: {
        fontSize: fontSize.hint,
        color: colors.textHint,
        marginTop: spacing.xs,
        fontStyle: 'italic'
    },
    error: {
        fontSize: fontSize.hint,
        color: colors.error,
        marginTop: spacing.xs
    }
})