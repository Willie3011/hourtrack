import { borderRadius, colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppInput from "../shared/AppInput";
import AppButton from "../shared/AppButton";

const DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

interface AddShiftFormProps {
    weekId: number;
    onSave: (day: string, start: string, end: string) => Promise<void>;
    onCancel: () => void;
    initialData?: {
        day: string;
        start: string;
        end: string;
    };
}

export default function AddShiftForm({
    weekId,
    onSave,
    onCancel,
    initialData,
}: AddShiftFormProps) {
    const [selectedDay, setSelectedDay] = useState(initialData?.day ?? '');
    const [startTime, setStartTime] = useState(initialData?.start ?? '');
    const [endTime, setEndTime] = useState(initialData?.end ?? '');
    const [errors, setErrors] = useState({
        day: '',
        start: '',
        end: '',
    });
    const [loading, setLoading] = useState(false);

    const validateTime = (time: string): boolean => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(time);
    };

    const validate = ():boolean => {
        const newErrors = {day: '', start: '', end: ''};
        let valid = true;

        if(!selectedDay) {
            newErrors.day = 'Please select a day';
            valid = false;
        }
        if(!validateTime(startTime)) {
            newErrors.start = 'Enter a valid time e.g 08:00';
            valid = false;
        }
        if(!validateTime(endTime)) {
            newErrors.end = 'Enter a valid time e.g 17:00';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    }

    const handleSave = async () => {
        if (validate()) return;
        setLoading(true);
        await onSave(selectedDay, startTime, endTime);
        setLoading(false);

    }

    return (
        <View>
            <Text style={styles.dayLabel}>Day</Text>
            {errors.day ? (
                <Text style={styles.errorText}>{errors.day}</Text>
            ) : null}
            <View style={styles.daysGrid}>
                {DAYS.map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[
                            styles.dayBtn,
                            selectedDay === day && styles.dayBtnActive
                        ]}
                        onPress={() => setSelectedDay(day)}
                        activeOpacity={0.7}
                    >
                        <Text 
                            style={[
                                styles.dayBtnText,
                                selectedDay === day && styles.dayBtnTextActive
                            ]}
                        >
                            {day.slice(0, 3)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.timeRow}>
                <View style={styles.timeCol}>
                    <AppInput
                        label="Start Time"
                        value={startTime}
                        onChangeText={setStartTime}
                        placeholder="08:00"
                        keyboardType="numeric"
                        error={errors.start}
                    />
                </View>
                <View style={styles.timeCol}>
                    <AppInput
                        label="End Time"
                        value={endTime}
                        onChangeText={setEndTime}
                        placeholder="17:00"
                        keyboardType="numeric"
                        error={errors.end}
                    />
                </View>
            </View>

            <View style={styles.btnRow}>
                <AppButton
                    label='Cancel'
                    onPress={onCancel}
                    variant="secondary"
                    fullWidth={false}
                />
                <AppButton
                    label={initialData ? 'Save Changes' : 'Save shift'}
                    onPress={handleSave}
                    loading={loading}
                    fullWidth={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    dayLabel: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
        marginBottom: spacing.sm
    },
    errorText: {
        fontSize: fontSize.caption,
        color: colors.error,
        marginBottom: spacing.sm
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.md
    },
    dayBtn: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    dayBtnActive: {
        backgroundColor: colors.emerald,
        borderColor: colors.emerald
    },
    dayBtnText: {
        fontSize: fontSize.caption,
        color: colors.textMuted,
        fontWeight: fontWeight.medium
    },
    dayBtnTextActive: {
        color: colors.background,
        fontWeight: fontWeight.bold
    },
    timeRow: {
        flexDirection: 'row',
        gap: spacing.md
    },
    timeCol: {
        flex: 1,
    },
    btnRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.sm
    }
})