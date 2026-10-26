import { ScrollView, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useHourTrackStore } from "../src/store";
import GreetingHeader from "../src/components/home/GreetingHeader";
import SummaryCardRow from "../src/components/home/SummaryCardRow";
import RecentShiftsList from "../src/components/home/RecentShiftsList";
import { colors, spacing } from "../src/utils/theme";
import {
  getLoggedShiftsByWeek,
  getLoggedShiftsByMonth,
} from "../src/database/loggedShifts";
import { useState } from "react";

export default function HomeScreen() {
  const settings = useHourTrackStore((state) => state.settings);
  const recentShifts = useHourTrackStore((state) => state.recentShifts);
  const loadRecentShifts = useHourTrackStore((state) => state.loadRecentShifts);

  const [weeklyHours, setWeeklyHours] = useState(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);
  const [monthlyHours, setMonthlyHours] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: monday.toISOString().split("T")[0],
      end: sunday.toISOString().split("T")[0],
    };
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadRecentShifts();
        await loadSummaryData();
      } catch (error) {
        console.error("Home screen load error:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (recentShifts.length >= 0) {
      loadSummaryData().catch((error) =>
        console.error("Summary refresh error:", error),
      );
    }
  }, [recentShifts]);

  const loadSummaryData = async () => {
    const now = new Date();
    const { start, end } = getWeekDates();

    const weekShifts = await getLoggedShiftsByWeek(start, end);
    const monthShifts = await getLoggedShiftsByMonth(
      now.getMonth() + 1,
      now.getFullYear(),
    );

    const wHours = weekShifts.reduce(
      (sum, s) => sum + s.regular_hours + s.overtime_hours,
      0,
    );
    const wEarnings = weekShifts.reduce(
      (sum, s) => sum + s.expected_earnings,
      0,
    );
    const mHours = monthShifts.reduce(
      (sum, s) => sum + s.regular_hours + s.overtime_hours,
      0,
    );
    const mEarnings = monthShifts.reduce(
      (sum, s) => sum + s.expected_earnings,
      0,
    );

    setWeeklyHours(Math.round(wHours * 10) / 10);
    setWeeklyEarnings(wEarnings);
    setMonthlyHours(Math.round(mHours * 10) / 10);
    setMonthlyEarnings(mEarnings);
  };

  const hasData = recentShifts.length > 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <GreetingHeader
        greeting={`${getGreeting()}, Willem`}
        subtitle={
          hasData ? "Here is your earnings overview" : "Let's get you set up"
        }
      />

      <SummaryCardRow
        weeklyHours={weeklyHours}
        weeklyEarnings={weeklyEarnings}
        monthlyHours={monthlyHours}
        monthlyEarnings={monthlyEarnings}
        contractedHours={settings?.contracted_weekly_hours ?? 45}
        isEmpty={!hasData}
      />

      <RecentShiftsList shifts={recentShifts} />
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
});
