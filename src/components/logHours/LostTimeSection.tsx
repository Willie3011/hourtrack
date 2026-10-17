import {
  calculateLostTimeMinutes,
  formatDuration,
  timeToMinutes,
} from "@/src/utils/calaculations";
import { StyleSheet, Text, View } from "react-native";
import TimePicker from "../shared/TimePicker";
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/src/utils/theme";

interface LostTimeSectionProps {
  shiftStart: string;
  arrivalTime: string;
  lunchOut: string;
  lunchIn: string;
  onChange: (field: string, value: string) => void;
}

export default function LostTimeSection({
  shiftStart,
  arrivalTime,
  lunchOut,
  lunchIn,
  onChange,
}: LostTimeSectionProps) {
  const lateMinutes =
    arrivalTime && shiftStart
      ? Math.max(timeToMinutes(arrivalTime) - timeToMinutes(shiftStart), 0)
      : 0;

  const totalLostMinutes = calculateLostTimeMinutes(
    shiftStart,
    arrivalTime,
    lunchOut,
    lunchIn,
  );

  return (
    <View>
      <TimePicker
        label="Arrival time"
        value={arrivalTime}
        onChange={(time) => onChange("arrivalTime", time)}
      />
      {lateMinutes > 0 && (
        <Text style={styles.lateHint}>
          You arrived {formatDuration(lateMinutes)} late
        </Text>
      )}

      <View style={styles.lunchRow}>
        <View style={styles.lunchCol}>
          <TimePicker
            label="Lunch out"
            value={lunchOut}
            onChange={(time) => onChange("lunchOut", time)}
          />
        </View>
        <View style={styles.lunchCol}>
          <TimePicker
            label="Lunch in"
            value={lunchIn}
            onChange={(time) => onChange("lunchIn", time)}
          />
        </View>
      </View>

      {totalLostMinutes > 0 && (
        <View style={styles.lostTimeResult}>
          <Text style={styles.lostTimeLabel}>Total lost time</Text>
          <Text style={styles.lostTimeValue}>
            {formatDuration(totalLostMinutes)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  lateHint: {
    fontSize: fontSize.hint,
    color: colors.warning,
    fontStyle: "italic",
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  lunchRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  lunchCol: {
    flex: 1,
  },
  lostTimeResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  lostTimeLabel: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
  lostTimeValue: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    color: colors.error,
  },
});
