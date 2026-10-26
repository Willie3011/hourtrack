import LostTimeSection from "@/src/components/logHours/LostTimeSection";
import OvertimeSection from "@/src/components/logHours/OvertimeSection";
import ShiftBreakdownSummary from "@/src/components/logHours/ShiftBreakdownSummary";
import ShiftTypeContextNote from "@/src/components/logHours/ShiftTypeContextNote";
import ShiftTypeSelector from "@/src/components/logHours/ShiftTypeSelector";
import AppButton from "@/src/components/shared/AppButton";
import DatePicker from "@/src/components/shared/Datepicker";
import SectionHeader from "@/src/components/shared/SectionHeader";
import TimePicker from "@/src/components/shared/TimePicker";
import { LoggedShift } from "@/src/database/loggedShifts";
import { useHourTrackStore } from "@/src/store";
import { calculateShiftEarnings } from "@/src/utils/calaculations";
import { borderRadius, colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type ShiftType = "Regular" | "Holiday" | "Nightshift";

const getTodayString = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatBannerDate = (dateStr: string): string => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function LogHoursScreen() {
  const settings = useHourTrackStore((state) => state.settings);
  const addLoggedShift = useHourTrackStore((state) => state.addLoggedShift);
  const editLoggedShift = useHourTrackStore((state) => state.editLoggedShift);
  const editingShift = useHourTrackStore((state) => state.editingShift);
  const setEditingShift = useHourTrackStore((state) => state.setEditingShift);

  const [date, setDate] = useState<string>(getTodayString());
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [shiftType, setShiftType] = useState<ShiftType>("Regular");
  const [overtimeBeforeEnabled, setOvertimeBeforeEnabled] = useState(false);
  const [overtimeBeforeStart, setOvertimeBeforeStart] = useState("");
  const [overtimeBeforeEnd, setOvertimeBeforeEnd] = useState("");
  const [overtimeAfterEnabled, setOvertimeAfterEnabled] = useState(false);
  const [overtimeAfterStart, setOvertimeAfterStart] = useState("");
  const [overtimeAfterEnd, setOvertimeAfterEnd] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [lunchOut, setLunchOut] = useState("");
  const [lunchIn, setLunchIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill the form when a shift is being edited
  useEffect(() => {
    if (!editingShift) return;
    setDate(editingShift.date);
    setShiftStart(editingShift.shift_start);
    setShiftEnd(editingShift.shift_end);
    setShiftType(editingShift.shift_type);
    setOvertimeBeforeEnabled(editingShift.overtime_before_enabled === 1);
    setOvertimeBeforeStart(editingShift.overtime_before_start ?? "");
    setOvertimeBeforeEnd(editingShift.overtime_before_end ?? "");
    setOvertimeAfterEnabled(editingShift.overtime_after_enabled === 1);
    setOvertimeAfterStart(editingShift.overtime_after_start ?? "");
    setOvertimeAfterEnd(editingShift.overtime_after_end ?? "");
    setArrivalTime(editingShift.arrival_time ?? "");
    setLunchOut(editingShift.lunch_out ?? "");
    setLunchIn(editingShift.lunch_in ?? "");
    setErrors({});
  }, [editingShift]);

  const resetForm = () => {
    setDate(getTodayString());
    setShiftStart("");
    setShiftEnd("");
    setShiftType("Regular");
    setOvertimeBeforeEnabled(false);
    setOvertimeBeforeStart("");
    setOvertimeBeforeEnd("");
    setOvertimeAfterEnabled(false);
    setOvertimeAfterStart("");
    setOvertimeAfterEnd("");
    setArrivalTime("");
    setLunchOut("");
    setLunchIn("");
    setErrors({});
  };

  const handleOvertimeChange = (field: string, value: any) => {
    switch (field) {
      case "overtimeBeforeEnabled":
        setOvertimeBeforeEnabled(value);
        break;
      case "overtimeBeforeStart":
        setOvertimeBeforeStart(value);
        break;
      case "overtimeBeforeEnd":
        setOvertimeBeforeEnd(value);
        break;
      case "overtimeAfterEnabled":
        setOvertimeAfterEnabled(value);
        break;
      case "overtimeAfterStart":
        setOvertimeAfterStart(value);
        break;
      case "overtimeAfterEnd":
        setOvertimeAfterEnd(value);
        break;
    }
  };

  const handleLostTimeChange = (field: string, value: string) => {
    switch (field) {
      case "arrivalTime":
        setArrivalTime(value);
        break;
      case "lunchOut":
        setLunchOut(value);
        break;
      case "lunchIn":
        setLunchIn(value);
        break;
    }
  };

    const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!date) newErrors.date = 'Please select a date';
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

    try {
      // When editing, keep the rate the shift was originally logged at
      const rate = editingShift
        ? editingShift.hourly_rate_at_time
        : settings.hourly_rate;

      const breakdown = calculateShiftEarnings({
        shiftStart,
        shiftEnd,
        shiftType,
        hourlyRate: rate,
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

      const shiftData: LoggedShift = {
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
        hourly_rate_at_time: rate,
        regular_hours: breakdown.regularHours,
        overtime_hours: breakdown.overtimeHours,
        nightshift_allowance: breakdown.nightshiftAllowance,
        expected_earnings: breakdown.expectedEarnings,
      };

      if (editingShift) {
        await editLoggedShift({ ...shiftData, id: editingShift.id });
        setEditingShift(null);
        resetForm();
        router.push('/log-hours/logged-shifts');
      } else {
        await addLoggedShift(shiftData);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save shift:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingShift(null);
    resetForm();
    router.push('/log-hours/logged-shifts');
  };

  if (!settings) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Previews and breakdown should use the shift's original rate when editing
  const effectiveSettings = editingShift
    ? { ...settings, hourly_rate: editingShift.hourly_rate_at_time }
    : settings;
  
  const canSave = !!(date && shiftStart && shiftEnd);
  
    return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {editingShift && (
        <View style={styles.editBanner}>
          <Text style={styles.editBannerText}>
            Editing shift from {formatBannerDate(editingShift.date)}
          </Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <Text
          style={styles.viewLogsLink}
          onPress={() => router.push('/log-hours/logged-shifts')}
        >
          View logged shifts →
        </Text>
      </View>

      <DatePicker
        label="Date"
        value={date}
        onChange={setDate}
        error={errors.date}
      />

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
      <ShiftTypeSelector selected={shiftType} onChange={setShiftType} />
      <ShiftTypeContextNote shiftType={shiftType} settings={effectiveSettings} />

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

      {shiftStart && shiftEnd && (
        <ShiftBreakdownSummary
          shiftStart={shiftStart}
          shiftEnd={shiftEnd}
          shiftType={shiftType}
          settings={effectiveSettings}
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
        label={editingShift ? 'Save changes' : 'Save shift'}
        onPress={handleSave}
        loading={loading}
        variant={canSave ? 'primary' : 'disabled'}
      />

      {editingShift && (
        <View style={styles.cancelWrap}>
          <AppButton
            label="Cancel editing"
            onPress={handleCancelEdit}
            variant="secondary"
          />
        </View>
      )}
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
    paddingBottom: spacing.xxxxxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.lg,
  },
  viewLogsLink: {
    fontSize: fontSize.caption,
    color: colors.emerald,
    fontWeight: fontWeight.semibold,
  },
  editBanner: {
    backgroundColor: colors.emeraldLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  editBannerText: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.forest,
  },
  cancelWrap: {
    marginTop: spacing.sm,
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
})