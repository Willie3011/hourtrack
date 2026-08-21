import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, fontSize, fontWeight, borderRadius, spacing } from "../../utils/theme";

interface AppButtonProps {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'disabled';
    loading?: boolean;
    fullWidth?: boolean
}

export default function AppButton({ 
    label,
    onPress,
    variant = 'primary',
    loading = false,
    fullWidth = true
}: AppButtonProps) {
    const isDisabled = variant === 'disabled' || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'primary' && styles.primary,
                variant === 'secondary' && styles.secondary,
                variant === 'disabled' && styles.disabled,
                fullWidth && styles.fullWidth
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? colors.background : colors.forest}
                    size="small"
                />
            ) : (<Text
                    style={[
                        styles.label,
                        variant === 'primary' && styles.labelPrimary,
                        variant === 'secondary' && styles.labelSecondary,
                        variant === 'disabled' && styles.labelDisabled,
                    ]}
                >{label}</Text>)}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    fullWidth: {
        width: '100%'
    },
    primary: {
        backgroundColor: colors.emerald
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.forest
    },
    disabled: {
        backgroundColor: colors.border
    },
    label: {
        fontSize: fontSize.button,
        fontWeight: fontWeight.bold,
        fontFamily: 'DMSans',
    },
    labelPrimary: {
        color: colors.background
    },
    labelSecondary: {
        color: colors.forest
    },
    labelDisabled: {
        color: colors.textHint
    }
})