import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useHourTrackStore } from '../../src/store';
import ShiftFilterRow from '../../src/components/logHours/ShiftFilterRow';
import MonthGroupLabel from '../../src/components/logHours/MonthGroupLabel';
import LoggedShiftCard from '../../src/components/logHours/LoggedShiftCard';
import EmptyState from '../../src/components/shared/EmptyState';
import { LoggedShift } from '../../src/database/loggedShifts';
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '../../src/utils/theme';

type FilterType = 'All' | 'Regular' | 'Holiday' | 'Nightshift';

export default function LoggedShiftsScreen() {
  const loggedShifts = useHourTrackStore((state) => state.loggedShifts);
  const loadLoggedShifts = useHourTrackStore((state) => state.loadLoggedShifts);
  const removeLoggedShift = useHourTrackStore((state) => state.removeLoggedShift);
  const setEditingShift = useHourTrackStore((state) => state.setEditingShift);

  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  useEffect(() => {
    loadLoggedShifts();
  }, []);

  const filteredShifts = loggedShifts.filter((shift) => {
    if (activeFilter === 'All') return true;
    return shift.shift_type === activeFilter;
  });

  const groupShiftsByMonth = (shifts: LoggedShift[]) => {
    const groups: Record<string, LoggedShift[]> = {};
    shifts.forEach((shift) => {
      const date = new Date(shift.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(shift);
    });
    return groups;
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete shift',
      'Are you sure you want to delete this logged shift? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeLoggedShift(id),
        },
      ]
    );
  };

  const groupedShifts = groupShiftsByMonth(filteredShifts);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.backRow}>
        <Text
          style={styles.backLink}
          onPress={() => router.back()}
        >
          ← Log hours
        </Text>
      </View>

      <Text style={styles.title}>Logged shifts</Text>

      <ShiftFilterRow
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />

      {filteredShifts.length === 0 ? (
        <EmptyState
          title="No shifts logged yet"
          message="Once you start logging your shifts they will appear here."
          actionLabel="Log your first shift"
          onActionPress={() => router.back()}
        />
      ) : (
        Object.entries(groupedShifts).map(([key, shifts]) => {
          const [year, month] = key.split('-').map(Number);
          return (
            <View key={key}>
              <MonthGroupLabel month={month} year={year} />
              {shifts.map((shift) => (
                <LoggedShiftCard
                  key={shift.id}
                  date={shift.date}
                  shiftType={shift.shift_type}
                  shiftStart={shift.shift_start}
                  shiftEnd={shift.shift_end}
                  regularHours={shift.regular_hours}
                  overtimeHours={shift.overtime_hours}
                  expectedEarnings={shift.expected_earnings}
                  lostTimeMinutes={shift.lost_time_minutes}
                  onEdit={() => {
                    setEditingShift(shift);
                    router.push('/log-hours');
                  }}
                  onDelete={() => handleDelete(shift.id!)}
                />
              ))}
            </View>
          );
        })
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
  },
  backRow: {
    marginBottom: spacing.md,
  },
  backLink: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
  title: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
});