import { ScrollView, StyleSheet, Text } from "react-native";
import { colors, fontSize, fontWeight, spacing } from "../../src/utils/theme";
import { useState } from "react";
import { router } from "expo-router";
import StepIndicator from "../../src/components/shared/StepIndicator";
import AppInput from "../../src/components/shared/AppInput";
import AppButton from "../../src/components/shared/AppButton";


export default function OnboardingStep1() {
    const [hourlyRate, setHourlyRate] = useState('');
    const [contractedHours, setContractedHours] = useState('');
    const [errors, setErrors] = useState({
        hourlyRate: '',
        contractedHours: ''
    });

    const validate = (): boolean => {
        const newErrors = { hourlyRate: '', contractedHours: '' };
        let valid = true;

        if (!hourlyRate || isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0) {
            newErrors.hourlyRate = 'Please enter a valid hourly rate';
            valid = false
        }

        if (!contractedHours || isNaN(Number(contractedHours)) || Number(contractedHours) <= 0) {
            newErrors.contractedHours = 'Please enter valid contracted hours';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    }

    const handleNext = () => {
        if (!validate()) return;

        router.push({
            pathname: '/onboarding/step2',
            params: {
                hourlyRate,
                contractedHours
            }
        })
    };

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <StepIndicator totalSteps={4} currentStep={0} />
            
            <Text style={styles.title}>Basic rate</Text>
            <Text style={styles.subtitle}>
                Enter your hourly rate so the app can calculate your expected salary.
            </Text>

            <AppInput
                label="Hourly rate (R)"
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="e.g. 28.00"
                keyboardType="decimal-pad"
                error={errors.hourlyRate}
            />

            <AppInput
                label="Contracted weekly hours"
                value={contractedHours}
                onChangeText={setContractedHours}
                placeholder="e.g. 45"
                keyboardType="decimal-pad"
                hint="The total hours you are contracted to work per week"
                error={errors.contractedHours}
            />

            <AppButton label="Next" onPress={handleNext}/>
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
    }
})