import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../../utils/theme';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  error?: string;
  maximumDate?: Date;
}

const dateStringToDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const dateToDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = dateStringToDate(dateStr);
  return date.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export default function DatePicker({
  label,
  value,
  onChange,
  error,
  maximumDate = new Date(),
}: DatePickerProps) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(dateStringToDate(value));

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (selectedDate && event.type !== 'dismissed') {
        onChange(dateToDateString(selectedDate));
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(dateToDateString(tempDate));
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(dateStringToDate(value));
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
          {value ? formatDisplayDate(value) : 'Tap to select date'}
        </Text>
        <Ionicons
          name="calendar-outline"
          size={18}
          color={value ? colors.emerald : colors.textHint}
        />
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
            mode="date"
            display="spinner"
            onChange={handleChange}
            maximumDate={maximumDate}
          />
        </View>
      )}

      {show && Platform.OS === 'android' && (
        <DateTimePicker
          value={dateStringToDate(value || dateToDateString(new Date()))}
          mode="date"
          display="calendar"
          onChange={handleChange}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
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
  field: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldError: {
    borderColor: colors.error,
  },
  value: {
    fontSize: fontSize.body,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
    flex: 1,
  },
  placeholder: {
    color: colors.textHint,
    fontWeight: fontWeight.regular,
  },
  error: {
    fontSize: fontSize.hint,
    color: colors.error,
    marginTop: spacing.xs,
  },
  iosPickerContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  iosPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iosTitle: {
    fontSize: fontSize.label,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  iosCancel: {
    fontSize: fontSize.body,
    color: colors.forest,
    fontWeight: fontWeight.semibold,
  },
  iosConfirm: {
    fontSize: fontSize.body,
    color: colors.emerald,
    fontWeight: fontWeight.bold,
  },
});