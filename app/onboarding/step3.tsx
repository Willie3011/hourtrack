import { router, useLocalSearchParams } from "expo-router";
import { colors, fontSize, fontWeight, spacing } from "../../src/utils/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import StepIndicator from "../../src/components/shared/StepIndicator";
import AppToggle from "../../src/components/shared/AppToggle";
import AppInput from "../../src/components/shared/AppInput";
import RatePreviewBox from "../../src/components/shared/RatePreviewBox";
import AppButton from "../../src/components/shared/AppButton";

export default function OnboardingStep3() {
    const params = useLocalSearchParams<{
        hourlyRate: string;
        contractedHours: string;
        overtimeMultiplier: string
    }>();

    const [holidayPayEnabled, setHolidayPayEnabled] = useState(false);
    const [holidayMultiplier, setHolidayMultiplier] = useState('2');
    const [error, setError] = useState('');

    const hourlyRate = Number(params.hourlyRate);

    const holidayRate = holidayPayEnabled && !isNaN(Number(holidayMultiplier)) && Number(holidayMultiplier) > 0 ? (hourlyRate * Number(holidayMultiplier)).toFixed(2) : null;

    const validate = (): boolean => {
        if (holidayPayEnabled) {
            if (!holidayMultiplier || isNaN(Number(holidayMultiplier)) || Number(holidayMultiplier) <= 0) {
                setError('Please enter a valid holiday rate multiplier')
                return false;
            }
        }

        setError('');
        return true;
    }

    const handleNext = () => {
        if (!validate()) return;

        router.push({
            pathname: '/onboarding/step4',
            params: {
                ...params,
                holidayPayEnabled: holidayPayEnabled ? '1' : '0',
                holidayMultiplier,
            },
        });
    };

    const handleBack = () => {
        router.back();
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <StepIndicator totalSteps={4} currentStep={2} />
            
            <Text style={styles.title}>Holiday pay</Text>
            <Text style={styles.subtitle}>
                Let the app know if you earn a different rate on public holidays.
            </Text>

            <AppToggle
                label="Enable holiday pay"
                value={holidayPayEnabled}
                onValueChange={(value) => {
                    setHolidayPayEnabled(value);
                    setError('')
                }}
                hint="Turn on if you earn a different rate on public holidays"
            />

            <View style={styles.divider} />

            {!holidayPayEnabled && (
                <View style={styles.disabledNote}>
                    <Text style={styles.disabledNoteText}>
                        Toggle on to set your holiday rate
                    </Text>
                </View>
            )}

            {holidayPayEnabled && (
                <>
                    <AppInput
                        label="Holiday rate multiplier"
                        value={holidayMultiplier}
                        onChangeText={setHolidayMultiplier}
                        placeholder="e.g. 2"
                        keyboardType="decimal-pad"
                        hint="2 means you earn double your hourly rate on public holidays"
                        error={error}
                    />
                    {holidayRate && (
                        <RatePreviewBox
                            label="Holiday rate preview"
                            lines={[
                                `R${hourlyRate.toFixed(2)} x ${holidayMultiplier} = R${holidayRate}`
                            ]}
                        />
                    )}
                </>
            )}

            <View style={styles.btnRow}>
                <AppButton
                    label="Back"
                    onPress={handleBack}
                    variant="secondary"
                    fullWidth={false}
                />
                <AppButton
                    label="Next"
                    onPress={handleNext}
                    fullWidth={false}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        paddingTop: spacing.xxxxxl
    },
    title: {
        fontSize: fontSize.h1,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm
    },
    subtitle: {
        fontSize: fontSize.body,
        color: colors.textSecondary,
        marginBottom: spacing.xxl,
        lineHeight: 20
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginBottom: spacing.lg
    },
    disabledNote: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    disabledNoteText: {
        fontSize: fontSize.caption,
        color: colors.textHint,
        fontStyle: 'italic'
    },
    btnRow: {
        flexDirection: 'row',
        gap: spacing.md
    }
})