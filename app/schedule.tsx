import WeekCard from '@/src/components/schedule/WeekCard';
import AppButton from '@/src/components/shared/AppButton';
import BottomSheet from '@/src/components/shared/BottomSheet';
import EmptyState from '@/src/components/shared/EmptyState';
import { useHourTrackStore } from '@/src/store';
import { colors, spacing } from '@/src/utils/theme';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';

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

  useEffect(() => {
    loadWeeks();
  }, []);

  const getWeekTag = (weekStartDate: string): string => {
    const now = new Date();
    const start = new Date(weekStartDate);
    const diffDays = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    if(diffDays < 7) return 'Current week';
    if(diffDays < 14) return 'Last week';
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
      start: monday.toISOString().split('T')[0],
      end: sunday.toISOString().split('T')[0],
    }
  }

  const handleAddCurrentWeek = async () => {
    setAddingWeek(true);
    const { start, end } = getWeekDates();
    const id = await addWeek({
      week_start_date: start,
      week_end_date: end
    });
    setAddingWeek(false);
    setShowAddWeek(false);
    router.push(`/schedule/${id}`);
  }

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
      >
        {weeks.length === 0 ? (
          <EmptyState
            title='No schedules saved yet'
            message='Upload your weekly schedule image or add your shifts manually to get started.'
            actionLabel='+ Add first schedule'
            onActionPress={()=> setShowAddWeek(true)}
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
                shiftCount={0}
                totalHours={0}
                onViewDetails={() => router.push(`/schedule/${week.id}`)}
                onViewImage={() => 
                  week.schedule_image_url && 
                  setFullScreenImage(week.schedule_image_url)
                }
              />
            ))}
            <AppButton
              label='+ Add new week schedule'
              onPress={() => setShowAddWeek(true)}
            />
          </>
        )}
      </ScrollView>

      <BottomSheet
        visible={showAddWeek}
        onDismiss={() => setShowAddWeek(false)}
        title='Add new week'
      >
        <AppButton
          label='Add current week'
          onPress={handleAddCurrentWeek}
          loading={addingWeek}
        />
        <View style={{height: spacing.sm}}/>

        <AppButton
          label='Cancel'
          onPress={() => setShowAddWeek(false)}
          variant='secondary'
        />
      </BottomSheet>

      <Modal
        visible={!!fullScreenImage}
        transparent
        animationType='fade'
        onRequestClose={() => setFullScreenImage(null)}
      >
        <TouchableOpacity
          style={styles.fullscreenOverlay}
          activeOpacity={1}
          onPress={() => setFullScreenImage(null)}
        >
          {fullScreenImage && (
            <Image
              source={{uri: fullScreenImage}}
              style={styles.fullScreenImage}
              resizeMode='contain'
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
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%'
  }
})