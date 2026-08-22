import { router, useLocalSearchParams } from "expo-router";
import { colors, fontSize, fontWeight, spacing } from "../../src/utils/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import StepIndicator from "@/src/components/shared/StepIndicator";
import AppInput from "@/src/components/shared/AppInput";
import RatePreviewBox from "@/src/components/shared/RatePreviewBox";
import AppButton from "@/src/components/shared/AppButton";

export default function OnboardingStep2() {
    const params = useLocalSearchParams <{
        hourlyRate: string;
        contractedHours: string;
    }>();

    const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
    const [error, setError] = useState('');

    const hourlyRate = Number(params.hourlyRate);

    const overtimeRate = !isNaN(Number(overtimeMultiplier)) && Number(overtimeMultiplier) > 0 ? (hourlyRate * Number(overtimeMultiplier)).toFixed(2) : null;

    const validate = (): boolean => {
        if (!overtimeMultiplier || isNaN(Number(overtimeMultiplier)) || Number(overtimeMultiplier) <= 0) {
            setError('Please enter a valid overtime multiplier');
            return false
        }

        setError('')
        return true
    }

    const handleNext = () => {
        if (!validate()) return;

        router.push({
            pathname: '/onboarding/step3',
            params: {
                ...params,
                overtimeMultiplier
            },
        });
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >

            <StepIndicator totalSteps={4} currentStep={1} />
            
            <Text style={styles.title}>Overtime</Text>
            <Text style={styles.subtitle}>
                Set your overtime rate so the app can correctly calculate ovetime earnings.
            </Text>

            <AppInput
                label="Overtime multiplier"
                value={overtimeMultiplier}
                onChangeText={setOvertimeMultiplier}
                placeholder="e.g. 1.5"
                keyboardType="decimal-pad"
                hint="1.5 means you earn 1.5x your hourly rate for every overtime hour"
                error={error}
            />

            {overtimeRate && (
                <RatePreviewBox
                    label="Overtime rate preview"
                    lines={[`R ${hourlyRate.toFixed(2)} x ${overtimeMultiplier} = R${overtimeRate}/hr`]}
                />
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
        backgroundColor: colors.background
    },
    content: {
        padding: spacing.lg,
        paddingTop: spacing.xxxxxl,
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
    btnRow: {
        flexDirection: 'row',
        gap: spacing.md
    }
})