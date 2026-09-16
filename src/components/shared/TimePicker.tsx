import { useState } from "react";
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { borderRadius, colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";

interface TimePickerProps {
    label: string;
    value: string;
    onChange: (time: string) => void;
    error?: string;
}

const timeStringToDate = (timeStr: string): Date => {
    const [hours, minutes] = timeStr ? timeStr.split(':').map(Number) : [8, 0];
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

const dateToTimeString = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`
};

export default function TimePicker({
    label,
    value,
    onChange,
    error,
}: TimePickerProps) {
    const [show, setShow] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(timeStringToDate(value));

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
            if(event.type === 'set' && selectedDate) {
                onChange(dateToTimeString(selectedDate));
            }
        }
        else {
            if (selectedDate) {
                setTempDate(selectedDate);
            }
        }
    };

    const handleConfirm = () => {
        onChange(dateToTimeString(tempDate));
        setShow(false);
    };

    const handleCancel = () => {
        setTempDate(timeStringToDate(value));
        setShow(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.field, error && styles.fieldError]}
                onPress={() => setShow(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.value, !value && styles.placeholder]}>
                    {value || 'Tap to set'}
                </Text>
                <Ionicons name="time-outline" size={18} color={value ? colors.emerald : colors.textHint}/>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}

            {show && Platform.OS === 'ios' && (
                <View style={styles.iosPickerContainer}>
                    <View style={styles.iosPickerHeader}>
                        <TouchableOpacity onPress={handleCancel}>
                            <Text style={styles.iosCancel}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.iosTitle}>{label}</Text>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={styles.iosConfirm}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePicker
                        value={tempDate}
                        mode="time"
                        display="spinner"
                        is24Hour={true}
                    />
                </View>
            )}

            {show && Platform.OS === 'android' && (
                <DateTimePicker
                    value={timeStringToDate(value || '08:00')}
                    mode="time"
                    display="clock"
                    onChange={handleChange}
                    is24Hour={true}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md
    },
    label: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
        marginBottom: spacing.xs
    },
    field: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
        padding: spacing.md,
        fontSize: fontSize.body,
        backgroundColor: colors.surface,
        minHeight: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    fieldError: {
        borderColor: colors.error
    },
    value: {
        fontSize: fontSize.body,
        color: colors.textPrimary,
        fontWeight: fontWeight.medium
    },
    placeholder: {
        color: colors.textHint,
        fontWeight: fontWeight.regular
    },
    error: {
        fontSize: fontSize.hint,
        color: colors.error,
        marginTop: spacing.xs
    },
    iosPickerContainer: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginTop: spacing.sm,
        overflow: 'hidden'
    },
    iosPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    iosTitle: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary
    },
    iosCancel: {
        fontSize: fontSize.body,
        color: colors.forest,
        fontWeight: fontWeight.semibold
    },
    iosConfirm: {
        fontSize: fontSize.body,
        color: colors.emerald,
        fontWeight: fontWeight.bold
    }
})