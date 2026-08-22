import { useHourTrackStore } from "../../src/store";
import { colors, fontSize, fontWeight, spacing } from "../../src/utils/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import StepIndicator from "../../src/components/shared/StepIndicator";
import AppToggle from "../../src/components/shared/AppToggle";
import RuleBox from "../../src/components/shared/RuleBox";
import RatePreviewBox from "../../src/components/shared/RatePreviewBox";
import AppButton from "../../src/components/shared/AppButton";


export default function OnboardingStep4() {
    const params = useLocalSearchParams<{
        hourlyRate: string;
        contractedHours: string;
        overtimeMultiplier: string;
        holidayPayEnabled: string;
        holidayMultiplier: string
    }>();

    const [nightshiftEnabled, setNightshiftEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const saveSettingsToStore = useHourTrackStore((state) => state.saveSettings);

    const hourlyRate = Number(params.hourlyRate);
    const overtimeMultiplier = Number(params.overtimeMultiplier);
    const overtimeRate = Number(hourlyRate * overtimeMultiplier).toFixed(2);
    const nightshiftRate = (hourlyRate * 0.1).toFixed(2);

    const handleBack = () => {
        router.back()
    }

    const handleFinish = async () => {
        setLoading(true);
        try {
            await saveSettingsToStore({
                hourly_rate: hourlyRate,
                contracted_weekly_hours: Number(params.contractedHours),
                overtime_multiplier: overtimeMultiplier,
                holiday_pay_enabled: Number(params.holidayPayEnabled),
                holiday_multiplier: Number(params.holidayMultiplier),
                nightshift_enabled: nightshiftEnabled ? 1 : 0,
                onboarding_complete: 1
            });
            router.replace('/settings');
        } catch (error) {
            console.error('Failed to save settings: ', error);
            setLoading(false);
        }
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <StepIndicator totalSteps={4} currentStep={3} />
            
            <Text style={styles.title}>Nightshift</Text>
            <Text style={styles.subtitle}>
                Let the app know if yo sometimes work nightshift.
            </Text>

            <AppToggle
                label="Enable nightshift tracking"
                value={nightshiftEnabled}
                onValueChange={setNightshiftEnabled}
                hint="Turn on if you occasionally work nightshift hours"
            />

            <View style={styles.divider} />

            {!nightshiftEnabled && (
                <View style={styles.disabledNote}>
                    <Text style={styles.disabledNoteText}>
                        Toggle on to see nightshift rules
                    </Text>
                </View>
            )}

            {nightshiftEnabled && (
                <>
                    <RuleBox
                        title="How nightshift is calculated"
                        rules={[
                            '1 hour per shift is automatically converted to overtime',
                            'Remaining hours are paid at your regular rate',
                            'A 10% nightshift allowance is added on top of the remaining hours',
                        ]}
                    />
                    <RatePreviewBox
                        label="Nightshift rate preview"
                        lines={[
                            `Overtime (1 hr): R${overtimeRate} (R${hourlyRate.toFixed(2)} x ${overtimeMultiplier})`,
                            `Regular rate (remaining hrs): R${hourlyRate.toFixed(2)} / hr`,
                            `Nightshift allowance: R${nightshiftRate} / hr (10% of R${hourlyRate.toFixed(2)})`
                        ]}
                    />
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
                    label="Finish setup"
                    onPress={handleFinish}
                    loading={loading}
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