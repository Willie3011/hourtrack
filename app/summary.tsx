import { View, Text, ScrollView, StyleSheet, Share } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useHourTrackStore } from "../src/store";
import {
  LoggedShift,
  getLoggedShiftsByWeek,
} from "../src/database/loggedShifts";
import { getScheduledShiftsInRange } from "../src/database/schedulesShifts";
import SummaryToggle, {
  SummaryView,
} from "../src/components/summary/SummaryToggle";
import PeriodNavigator from "../src/components/summary/PeriodNavigator";
import SummaryStatRow from "../src/components/summary/SummaryStatRow";
import DiscrepancyBlock from "../src/components/summary/DiscrepancyBlock";
import HoursBreakdownList from "../src/components/summary/HoursBreakdownList";
import GenerateReportButton from "../src/components/summary/GenerateReportButton";
import EmptyState from "../src/components/shared/EmptyState";
import {
  getWeekPeriod,
  getMonthPeriod,
  summariseShifts,
  calculateScheduledMinutes,
  buildReportText,
} from "../src/utils/summary";
import { colors, fontSize, spacing } from "../src/utils/theme";
import { exportReportPdf } from "@/src/utils/reportPdf";

export default function SummaryScreen() {
  const settings = useHourTrackStore((state) => state.settings);

  const [view, setView] = useState<SummaryView>("monthly");
  const [offset, setOffset] = useState(0);
  const [shifts, setShifts] = useState<LoggedShift[]>([]);
  const [scheduledMinutes, setScheduledMinutes] = useState(0);
  const [generating, setGenerating] = useState(false);

  const period =
    view === "monthly" ? getMonthPeriod(offset) : getWeekPeriod(offset);
  const { start, end } = period;

  // Reload whenever the tab gains focus or the period changes,
  // so edits made on other tabs are always reflected
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        try {
          const logged = await getLoggedShiftsByWeek(start, end);
          const scheduledRows = await getScheduledShiftsInRange(start, end);
          if (!active) return;
          setShifts(logged);
          setScheduledMinutes(
            calculateScheduledMinutes(scheduledRows, start, end),
          );
        } catch (error) {
          console.error("Summary load error:", error);
        }
      };
      load();
      return () => {
        active = false;
      };
    }, [start, end]),
  );

  if (!settings) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const totals = summariseShifts(shifts, settings);
  const hasData = shifts.length > 0;

  const handleViewChange = (next: SummaryView) => {
    setView(next);
    setOffset(0);
  };

  const handleGenerateReport = async () => {
    const periodTitle = `${view === "monthly" ? "" : "Week "}${period.label}`;
    setGenerating(true);
    try {
      await exportReportPdf({ 
        periodTitle, 
        shifts, 
        totals, 
        scheduledMinutes,
        workerName: settings.name
       });
    } catch (error) {
      console.error("PDF export failed, falling back to text:", error);
      // Fall back to the plain text report so the user is never stuck
      await Share.share({
        title: `HourTrack — ${period.label}`,
        message: buildReportText({
          periodTitle,
          shifts,
          totals,
          scheduledMinutes,
        }),
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SummaryToggle activeView={view} onChange={handleViewChange} />

      <PeriodNavigator
        label={period.label}
        subLabel={period.subLabel}
        canGoForward={offset < 0}
        onPrevious={() => setOffset((o) => o - 1)}
        onNext={() => setOffset((o) => Math.min(o + 1, 0))}
      />

      <SummaryStatRow
        totalMinutes={totals.totalMinutes}
        totalEarnings={totals.totalEarnings}
        periodLabel={period.label}
        isEmpty={!hasData}
      />

      <DiscrepancyBlock
        scheduledMinutes={scheduledMinutes}
        loggedMinutes={totals.totalMinutes}
        hasData={hasData}
      />

      {hasData ? (
        <HoursBreakdownList totals={totals} />
      ) : (
        <EmptyState
          title={`No data for this ${view === "monthly" ? "month" : "week"}`}
          message={`Log your shifts and save your schedule to see your ${view} summary here.`}
        />
      )}

      <GenerateReportButton
        disabled={!hasData}
        loading={generating}
        onPress={handleGenerateReport}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxxxl },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: { fontSize: fontSize.body, color: colors.textMuted },
});
