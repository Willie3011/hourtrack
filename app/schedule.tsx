import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Image,
} from 'react-native';
import { useCallback, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useHourTrackStore } from '../src/store';
import { getAllScheduledShifts } from '../src/database/schedulesShifts';
import { calculateNetShiftMinutes } from '../src/utils/calaculations';
import { getMondayOf, addDays, toDateString, getWeekTag, parseDateString } from '../src/utils/dates';
import WeekCard from '../src/components/schedule/WeekCard';
import EmptyState from '../src/components/shared/EmptyState';
import AppButton from '../src/components/shared/AppButton';
import AppInput from '../src/components/shared/AppInput';
import BottomSheet from '../src/components/shared/BottomSheet';
import { colors, spacing, fontSize, fontWeight } from '../src/utils/theme';
import DatePicker from '@/src/components/shared/Datepicker';

type WeekStats = Record<number, { count: number; minutes: number }>;

const isValidDate = (s: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
};

export default function ScheduleScreen() {
  const weeks = useHourTrackStore((state) => state.weeks);
  const loadWeeks = useHourTrackStore((state) => state.loadWeeks);
  const addWeek = useHourTrackStore((state) => state.addWeek);

  const [showAddWeek, setShowAddWeek] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [addingWeek, setAddingWeek] = useState(false);
  const [pastWeekDay, setPastWeekDay] = useState('');
  const [quickError, setQuickError] = useState('');
  const [pastError, setPastError] = useState('');
  const [weekStats, setWeekStats] = useState<WeekStats>({});

  // Reload weeks and their shift totals every time the tab gains focus,
  // so edits made on the week detail screen show up on return
  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        try {
          await loadWeeks();
          const rows = await getAllScheduledShifts();
          if (!active) return;
          const stats: WeekStats = {};
          for (const r of rows) {
            const entry = stats[r.week_id] ?? { count: 0, minutes: 0 };
            entry.count += 1;
            entry.minutes += calculateNetShiftMinutes(r.shift_start, r.shift_end);
            stats[r.week_id] = entry;
          }
          setWeekStats(stats);
        } catch (error) {
          console.error('Schedule load error:', error);
        }
      };
      load();
      return () => {
        active = false;
      };
    }, [loadWeeks])
  );

  const weekAlreadyExists = (start: string): boolean =>
    weeks.some((w) => w.week_start_date === start);

  const closeSheet = () => {
    setShowAddWeek(false);
    setQuickError('');
    setPastError('');
    setPastWeekDay('');
  };

  const handleAddQuickWeek = async (weekOffset: 0 | 1) => {
    const monday = addDays(getMondayOf(new Date()), weekOffset * 7);
    const start = toDateString(monday);
    const end = toDateString(addDays(monday, 6));

    if(weekAlreadyExists(start)) {
      setQuickError(
        weekOffset === 0 ? 'Current week already exists' : 'Next week already exists'
      );
      return;
    }
    setAddingWeek(true);
    try {
      const id = await addWeek({ week_start_date: start, week_end_date: end });
      closeSheet();
      router.push(`/schedule/${id}`);
    } finally {
      setAddingWeek(false);
    }
  }

  const handleAddPastWeek = async () => {
    if(!pastWeekDay) {
      setPastError('Pick any day in the week you want to add');
      return;
    }

    const monday = getMondayOf(parseDateString(pastWeekDay));
    const start = toDateString(monday);
    const end = toDateString(addDays(monday, 6));

    if(weekAlreadyExists(start)) {
      setPastError('This week is already saved');
      return;
    }
    setAddingWeek(true);
    try {
      const id = await addWeek({week_start_date: start, week_end_date: end});
      closeSheet();
      router.push(`/schedule/${id}`);
    } finally {
      setAddingWeek(false);
    }
  }

  const pastWeekPreview = (() => {
    if(!pastWeekDay) return '';
    const monday = getMondayOf(parseDateString(pastWeekDay));
    const fmt = (d: Date) => 
      d.toLocaleDateString('en-ZA', {weekday: 'short', day: 'numeric', month: 'short'});
    return `${fmt(monday)} to ${fmt(addDays(monday, 6))}`;
  })();

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        {weeks.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No schedules saved yet"
            message="Upload your weekly schedule image or add your shifts manually to get started."
            actionLabel="+ Add first schedule"
            onActionPress={() => setShowAddWeek(true)}
          />
        ) : (
          <>
            {weeks.map((week) => {
              const stats = weekStats[week.id!] ?? { count: 0, minutes: 0 };
              return (
                <WeekCard
                  key={week.id}
                  weekStartDate={week.week_start_date}
                  weekEndDate={week.week_end_date}
                  tag={getWeekTag(week.week_start_date)}
                  imageUri={week.schedule_image_url}
                  shiftCount={stats.count}
                  totalHours={Math.round((stats.minutes / 60) * 10) / 10}
                  onViewDetails={() => router.push(`/schedule/${week.id}`)}
                  onViewImage={() =>
                    week.schedule_image_url &&
                    setFullscreenImage(week.schedule_image_url)
                  }
                />
              );
            })}
            <AppButton
              label="+ Add new week schedule"
              onPress={() => setShowAddWeek(true)}
            />
          </>
        )}
      </ScrollView>

      <BottomSheet
        visible={showAddWeek}
        onDismiss={closeSheet}
        title="Add week schedule"
      >
        <AppButton
          label="Add next week"
          onPress={() => handleAddQuickWeek(1)}
          loading={addingWeek}
        />
        <View style={{ height: spacing.sm }} />
        <AppButton
          label="Add current week"
          onPress={() => handleAddQuickWeek(0)}
          loading={addingWeek}
        />
        {quickError ? <Text style={styles.quickError}>{quickError}</Text> : null}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or add a past week</Text>
          <View style={styles.dividerLine} />
        </View>

        <DatePicker
          label="Pick any day in that week"
          value={pastWeekDay}
          onChange={(d) => {
            setPastWeekDay(d)
            setPastError('')
          }}
          error={pastError}
        />
        {pastWeekPreview ? (
          <Text style={styles.weekPreview}>Week: {pastWeekPreview}</Text>
        ) : null
        }

        <AppButton
          label='Add past week'
          onPress={handleAddPastWeek}
          loading={addingWeek}
          variant='secondary'
        />

        <View style={{ height: spacing.sm }} />
        <AppButton label="Cancel" onPress={closeSheet} variant="secondary" />
      </BottomSheet>

      <Modal
        visible={!!fullscreenImage}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenImage(null)}
      >
        <TouchableOpacity
          style={styles.fullscreenOverlay}
          activeOpacity={1}
          onPress={() => setFullscreenImage(null)}
        >
          {fullscreenImage && (
            <Image
              source={{ uri: fullscreenImage }}
              style={styles.fullscreenImage}
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
    backgroundColor: colors.background 
  },
  content: { 
    padding: spacing.lg 
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  dividerLine: { 
    flex: 1, 
    height: 1, 
    backgroundColor: colors.border 
  },
  dividerText: { 
    fontSize: fontSize.caption, 
    color: colors.textMuted 
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: { 
    width: '100%', 
    height: '80%' 
  },
  quickError: {
    fontSize: fontSize.caption,
    color: colors.error,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  weekPreview: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.semibold,
    color: colors.emeraldDark,
    marginBottom: spacing.md
  }
});