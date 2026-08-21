import { View, StyleSheet } from 'react-native';
import {
    colors,
    borderRadius,
    spacing
} from '../../utils/theme';

interface StepIndicatorProps {
    totalSteps: number;
    currentStep: number;
}

export default function StepIndicator({
    totalSteps,
    currentStep
}: StepIndicatorProps) {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        index === currentStep ? styles.dotActive : styles.dotInactive
                    ]}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xxl
    },
    dot: {
        height: 8,
        borderRadius: borderRadius.full
    },
    dotActive: {
        width: 24,
        backgroundColor: colors.emerald
    },
    dotInactive: {
        width: 8,
        backgroundColor: colors.border
    }
})