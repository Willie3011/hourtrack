import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import SectionHeader from '../shared/SectionHeader';
import EmptyState from '../shared/EmptyState';
import RecentShiftItem from './RecentShiftItem';
import { LoggedShift } from '../../database/loggedShifts';

interface RecentShiftsListProps {
  shifts: LoggedShift[];
}

export default function RecentShiftsList({ shifts }: RecentShiftsListProps) {
  return (
    <View style={styles.container}>
      <SectionHeader
        title="Recently logged shifts"
        actionLabel={shifts.length > 0 ? 'View all' : undefined}
        onActionPress={
          shifts.length > 0
            ? () => router.push('/log-hours/logged-shifts')
            : undefined
        }
      />
      {shifts.length === 0 ? (
        <EmptyState
          title="No shifts logged yet"
          message="Start by logging your first shift or uploading this week's schedule."
          actionLabel="Log your first shift"
          onActionPress={() => router.push('/log-hours')}
        />
      ) : (
        shifts.map((shift) => (
          <RecentShiftItem
            key={shift.id}
            date={shift.date}
            shiftType={shift.shift_type}
            hours={shift.regular_hours + shift.overtime_hours}
            earnings={shift.expected_earnings}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});