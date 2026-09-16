import WeekCard from "@/src/components/schedule/WeekCard";
import AppButton from "@/src/components/shared/AppButton";
import AppInput from "@/src/components/shared/AppInput";
import BottomSheet from "@/src/components/shared/BottomSheet";
import EmptyState from "@/src/components/shared/EmptyState";
import { getDatabase } from "@/src/database";
import { useHourTrackStore } from "@/src/store";
import { calculateNetShiftMinutes } from "@/src/utils/calaculations";
import { colors, fontSize, spacing } from "@/src/utils/theme";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

export default function ScheduleScreen() {
  const weeks = useHourTrackStore((state) => state.weeks);
  const scheduledShifts = useHourTrackStore((state) => state.scheduledShifts);
  const loadWeeks = useHourTrackStore((state) => state.loadWeeks);
  const addWeek = useHourTrackStore((state) => state.addWeek);
  const weeksLoading = useHourTrackStore((state) => state.weeksLoading);
  const settings = useHourTrackStore((state) => state.settings);

  const [showAddWeek, setShowAddWeek] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [addingWeek, setAddingWeek] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    loadWeeks();
  }, []);

  const getWeekTag = (weekStartDate: string): string => {
    const now = new Date();
    const start = new Date(weekStartDate);
    const diffDays = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays < 7) return "Current week";
    if (diffDays < 14) return "Last week";
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(now.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: monday.toISOString().split("T")[0],
      end: sunday.toISOString().split("T")[0],
    };
  };

  const weekAlreadyExists = (start: string): boolean => {
    return weeks.some((week) => week.week_start_date === start);
  };

  const handleAddCurrentWeek = async () => {
    const { start, end } = getWeekDates();

    if (weekAlreadyExists(start)) {
      setDateError("Current week already exists");
      return;
    }
    setAddingWeek(true);
    const id = await addWeek({
      week_start_date: start,
      week_end_date: end,
    });
    setAddingWeek(false);
    setShowAddWeek(false);
    router.push(`/schedule/${id}`);
  };

  const handleAddCustomWeek = async () => {
    if (!customStartDate || !customEndDate) {
      setDateError("Please enter both start and end dates");
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(customStartDate) || !dateRegex.test(customEndDate)) {
      setDateError("Use format YYYY-MM-DD e.g. 2025-07-14");
      return;
    }

    if (weekAlreadyExists(customStartDate)) {
      setDateError("A week starting on this date already exists");
      return;
    }
    setAddingWeek(true);
    const id = await addWeek({
      week_start_date: customStartDate,
      week_end_date: customEndDate,
    });
    setAddingWeek(false);
    setShowAddWeek(false);
    setCustomStartDate("");
    setCustomEndDate("");
    setDateError("");
    router.push(`/schedule/${id}`);
  };

  const calculateTotalHours = (): number => {
    return scheduledShifts.reduce((total, shift) => {
      const netMinutes = calculateNetShiftMinutes(
        shift.shift_start,
        shift.shift_end,
      );
      return total + netMinutes / 60;
    }, 0);
  };

  const totalHours = calculateTotalHours();

  const resetWeeks = async () => {
    Alert.alert(
      "Reset weeks",
      "This will delete all saved weeks. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            const db = await getDatabase();
            await db.execAsync("DELETE FROM weeks;");
            await loadWeeks();
          },
        },
      ],
    );
  };

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        {weeks.length === 0 ? (
          <EmptyState
            title="No schedules saved yet"
            message="Upload your weekly schedule image or add your shifts manually to get started."
            actionLabel="+ Add first schedule"
            onActionPress={() => setShowAddWeek(true)}
          />
        ) : (
          <>
            {weeks.map((week) => (
              <WeekCard
                key={week.id}
                weekStartDate={week.week_start_date}
                weekEndDate={week.week_end_date}
                tag={getWeekTag(week.week_start_date)}
                imageUri={week.schedule_image_url}
                shiftCount={scheduledShifts.length}
                totalHours={totalHours}
                onViewDetails={() => router.push(`/schedule/${week.id}`)}
                onViewImage={() =>
                  week.schedule_image_url &&
                  setFullScreenImage(week.schedule_image_url)
                }
              />
            ))}
            <AppButton
              label="+ Add new week schedule"
              onPress={() => setShowAddWeek(true)}
            />
          </>
        )}
      </ScrollView>
      <TouchableOpacity onPress={resetWeeks} style={styles.resetBtn}>
        <Text style={styles.resetText}>Dev: Reset weeks</Text>
      </TouchableOpacity>

      <BottomSheet
        visible={showAddWeek}
        onDismiss={() => {
          setShowAddWeek(false);
          setDateError("");
          setCustomStartDate("");
          setCustomEndDate("");
        }}
        title="Add new week">
        <AppButton
          label="Add current week"
          onPress={handleAddCurrentWeek}
          loading={addingWeek}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or add a past week</Text>
          <View style={styles.dividerLine} />
        </View>

        <AppInput
          label="Week start date"
          value={customStartDate}
          onChangeText={(text) => {
            setCustomStartDate(text);
            setDateError("");
          }}
          placeholder="YYYY-MM-DD e.g. 2026-06-12"
          error={dateError}
        />
        <AppInput
          label="Week end date"
          value={customEndDate}
          onChangeText={(text) => {
            setCustomEndDate(text);
            setDateError("");
          }}
          placeholder="YYYY-MM-DD e.g. 2026-06-18"
          error={dateError}
        />

        <AppButton
          label="Add past week"
          onPress={handleAddCustomWeek}
          loading={addingWeek}
          variant="secondary"
        />

        <View style={{ height: spacing.sm }} />

        <AppButton
          label="Cancel"
          onPress={() => {
            setShowAddWeek(false);
            setDateError("");
            setCustomStartDate("");
            setCustomEndDate("");
          }}
          variant="secondary"
        />
      </BottomSheet>

      <Modal
        visible={!!fullScreenImage}
        transparent
        animationType="fade"
        onRequestClose={() => setFullScreenImage(null)}>
        <TouchableOpacity
          style={styles.fullscreenOverlay}
          activeOpacity={1}
          onPress={() => setFullScreenImage(null)}>
          {fullScreenImage && (
            <Image
              source={{ uri: fullScreenImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>
    </>
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
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
  resetBtn: {
    padding: spacing.md,
    alignItems: "center",
  },
  resetText: {
    fontSize: fontSize.caption,
    color: colors.error,
  },
});
