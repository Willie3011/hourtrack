import { ScrollView, StyleSheet, Text } from "react-native";
import { colors, fontSize, fontWeight, spacing } from "../../src/utils/theme";
import { useState } from "react";
import { router } from "expo-router";
import StepIndicator from "../../src/components/shared/StepIndicator";
import AppInput from "../../src/components/shared/AppInput";
import AppButton from "../../src/components/shared/AppButton";


export default function OnboardingStep1() {
    const [name, setName] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [contractedHours, setContractedHours] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        hourlyRate: '',
        contractedHours: ''
    });

    const validate = (): boolean => {
        const newErrors = { name: '', hourlyRate: '', contractedHours: '' };
        let valid = true;

        const trimmed = name.trim();
        if(!trimmed) {
            newErrors.name = 'Please enter your name';
            valid = false;
        } else if(trimmed.length > 30) {
            newErrors.name = 'Keep it under 30 characters';
            valid = false;
        }

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
                name: name.trim(),
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
            
            <Text style={styles.title}>Welcome to HourTrack</Text>
            <Text style={styles.subtitle}>
                Tell us your name and hourly rate so the app can calculate your expected earnings.
            </Text>

            <AppInput
                label="Your name"
                value={name}
                onChangeText={setName}
                placeholder="e.g. John"
                autoCapitalize="words"
                hint="Shown on your home screen and on reports you share"
                error={errors.name}
            />
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