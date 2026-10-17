import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useState, useEffect, use } from 'react';
import { router } from 'expo-router';
import { useHourTrackStore } from '../src/store';
import TimePicker from '../src/components/shared/TimePicker';
import SectionHeader from '../src/components/shared/SectionHeader';
import AppButton from '../src/components/shared/AppButton';
import ShiftTypeSelector from '../src/components/logHours/ShiftTypeSelector';
import ShiftTypeContextNote from '../src/components/logHours/ShiftTypeContextNote';
import OvertimeSection from '../src/components/logHours/OvertimeSection';
import LostTimeSection from '../src/components/logHours/LostTimeSection';
import ShiftBreakdownSummary from '../src/components/logHours/ShiftBreakdownSummary';
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '../src/utils/theme';
import { calculateShiftEarnings } from '@/src/utils/calaculations';

type ShiftType = 'Regular' | 'Holiday' | 'Nightshift';

export default function LogHoursScreen() {
  const settings = useHourTrackStore((state) => state.settings);
  const addLoggedShift = useHourTrackStore((state) => state.addLoggedShift);

  const [date, setDate] = useState('');
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [shiftType, setShiftType] = useState<ShiftType>('Regular');
  const [overtimeBeforeEnabled, setOvertimeBeforeEnabled] = useState(false);
  const [overtimeBeforeStart, setOvertimeBeforeStart] = useState('');
  const [overtimeBeforeEnd, setOvertimeBeforeEnd] = useState('');
  const [overtimeAfterEnabled, setOvertimeAfterEnabled] = useState(false);
  const [overtimeAfterStart, setOvertimeAfterStart] = useState('');
  const [overtimeAfterEnd, setOvertimeAfterEnd] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [lunchOut, setLunchOut] = useState('');
  const [lunchIn, setLunchIn] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set today's date on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleOvertimeChange = (field: string, value: any) => {
    switch (field) {
      case 'overtimeBeforeEnabled': setOvertimeBeforeEnabled(value); break;
      case 'overtimeBeforeStart': setOvertimeBeforeStart(value); break;
      case 'overtimeBeforeEnd': setOvertimeBeforeEnd(value); break;
      case 'overtimeAfterEnabled': setOvertimeAfterEnabled(value); break;
      case 'overtimeAfterStart': setOvertimeAfterStart(value); break;
      case 'overtimeAfterEnd': setOvertimeAfterEnd(value); break;
    }
  };

  const handleLostTimeChange = (field: string, value: string) => {
    switch (field) {
      case 'arrivalTime': setArrivalTime(value); break;
      case 'lunchOut': setLunchOut(value); break;
      case 'lunchIn': setLunchIn(value); break;
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shiftStart) newErrors.shiftStart = 'Please select a shift start time';
    if (!shiftEnd) newErrors.shiftEnd = 'Please select a shift end time';
    if (overtimeBeforeEnabled && !overtimeBeforeStart) {
      newErrors.overtimeBeforeStart = 'Please select OT start time';
    }
    if (overtimeBeforeEnabled && !overtimeBeforeEnd) {
      newErrors.overtimeBeforeEnd = 'Please select OT end time';
    }
    if (overtimeAfterEnabled && !overtimeAfterStart) {
      newErrors.overtimeAfterStart = 'Please select OT start time';
    }
    if (overtimeAfterEnabled && !overtimeAfterEnd) {
      newErrors.overtimeAfterEnd = 'Please select OT end time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate() || !settings) return;
    setLoading(true);

    const breakdown = calculateShiftEarnings({
      shiftStart,
      shiftEnd,
      shiftType,
      hourlyRate: settings.hourly_rate,
      overtimeMultiplier: settings.overtime_multiplier,
      holidayMultiplier: settings.holiday_multiplier,
      overtimeBeforeStart: overtimeBeforeEnabled ? overtimeBeforeStart : null,
      overtimeBeforeEnd: overtimeBeforeEnabled ? overtimeBeforeEnd : null,
      overtimeAfterStart: overtimeAfterEnabled ? overtimeAfterStart : null,
      overtimeAfterEnd: overtimeAfterEnabled ? overtimeAfterEnd : null,
      lunchOut: lunchOut || null,
      lunchIn: lunchIn || null,
      arrivalTime: arrivalTime || null,
    });

    await addLoggedShift({
      date,
      shift_start: shiftStart,
      shift_end: shiftEnd,
      shift_type: shiftType,
      overtime_before_enabled: overtimeBeforeEnabled ? 1 : 0,
      overtime_before_start: overtimeBeforeEnabled ? overtimeBeforeStart : null,
      overtime_before_end: overtimeBeforeEnabled ? overtimeBeforeEnd : null,
      overtime_after_enabled: overtimeAfterEnabled ? 1 : 0,
      overtime_after_start: overtimeAfterEnabled ? overtimeAfterStart : null,
      overtime_after_end: overtimeAfterEnabled ? overtimeAfterEnd : null,
      arrival_time: arrivalTime || null,
      lunch_out: lunchOut || null,
      lunch_in: lunchIn || null,
      lost_time_minutes: breakdown.lostTimeMinutes,
      hourly_rate_at_time: settings.hourly_rate,
      regular_hours: breakdown.regularHours,
      overtime_hours: breakdown.overtimeHours,
      nightshift_allowance: breakdown.nightshiftAllowance,
      expected_earnings: breakdown.expectedEarnings,
    });

    // Reset form
    setShiftStart('');
    setShiftEnd('');
    setShiftType('Regular');
    setOvertimeBeforeEnabled(false);
    setOvertimeBeforeStart('');
    setOvertimeBeforeEnd('');
    setOvertimeAfterEnabled(false);
    setOvertimeAfterStart('');
    setOvertimeAfterEnd('');
    setArrivalTime('');
    setLunchOut('');
    setLunchIn('');
    setErrors({});
    setLoading(false);
  };

  if (!settings) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const today = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const canSave = shiftStart && shiftEnd;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.headerRow}>
        <Text style={styles.dateLabel}>{today}</Text>
        <Text
          style={styles.viewLogsLink}
          onPress={() => router.push('/log-hours/logged-shifts')}
        >
          View logged shifts →
        </Text>
      </View>

      <SectionHeader title="Shift times" />
      <TimePicker
        label="Shift start"
        value={shiftStart}
        onChange={setShiftStart}
        error={errors.shiftStart}
      />
      <TimePicker
        label="Shift end"
        value={shiftEnd}
        onChange={setShiftEnd}
        error={errors.shiftEnd}
      />

      <SectionHeader title="Shift type" />
      <ShiftTypeSelector
        selected={shiftType}
        onChange={setShiftType}
      />
      <ShiftTypeContextNote
        shiftType={shiftType}
        settings={settings}
      />

      <SectionHeader title="Overtime" />
      <OvertimeSection
        overtimeBeforeEnabled={overtimeBeforeEnabled}
        overtimeBeforeStart={overtimeBeforeStart}
        overtimeBeforeEnd={overtimeBeforeEnd}
        overtimeAfterEnabled={overtimeAfterEnabled}
        overtimeAfterStart={overtimeAfterStart}
        overtimeAfterEnd={overtimeAfterEnd}
        errors={{
          overtimeBeforeStart: errors.overtimeBeforeStart,
          overtimeBeforeEnd: errors.overtimeBeforeEnd,
          overtimeAfterStart: errors.overtimeAfterStart,
          overtimeAfterEnd: errors.overtimeAfterEnd,
        }}
        onChange={handleOvertimeChange}
      />

      <SectionHeader title="Lost time" />
      <LostTimeSection
        shiftStart={shiftStart}
        arrivalTime={arrivalTime}
        lunchOut={lunchOut}
        lunchIn={lunchIn}
        onChange={handleLostTimeChange}
      />

      {canSave && (
        <ShiftBreakdownSummary
          shiftStart={shiftStart}
          shiftEnd={shiftEnd}
          shiftType={shiftType}
          settings={settings}
          overtimeBeforeEnabled={overtimeBeforeEnabled}
          overtimeBeforeStart={overtimeBeforeStart}
          overtimeBeforeEnd={overtimeBeforeEnd}
          overtimeAfterEnabled={overtimeAfterEnabled}
          overtimeAfterStart={overtimeAfterStart}
          overtimeAfterEnd={overtimeAfterEnd}
          lunchOut={lunchOut}
          lunchIn={lunchIn}
          arrivalTime={arrivalTime}
        />
      )}

      <AppButton
        label="Save shift"
        onPress={handleSave}
        loading={loading}
        variant={canSave ? 'primary' : 'disabled'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dateLabel: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
    flex: 1,
  },
  viewLogsLink: {
    fontSize: fontSize.caption,
    color: colors.emerald,
    fontWeight: fontWeight.semibold,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
});