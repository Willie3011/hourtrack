import AddShiftForm from "@/src/components/schedule/AddShiftForm";
import ScheduleImageBox from "@/src/components/schedule/ScheduleImageBox";
import ShiftEntryRow from "@/src/components/schedule/ShiftEntryRow";
import WeekDetailHeader from "@/src/components/schedule/WeekDetailHeader";
import WeekSummaryBar from "@/src/components/schedule/WeekSummaryBar";
import BottomSheet from "@/src/components/shared/BottomSheet";
import EmptyState from "@/src/components/shared/EmptyState";
import SectionHeader from "@/src/components/shared/SectionHeader";
import { useHourTrackStore } from "@/src/store";
import { colors, fontSize, spacing } from "@/src/utils/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function WeekDetailScreen() {
    const weekId = useLocalSearchParams<{weekId: string}>();
    const activeWeek = useHourTrackStore((state) => state.activeWeek);
    const scheduledShifts = useHourTrackStore((state) => state.scheduledShifts);
    const settings = useHourTrackStore((state) => state.settings);
    const loadWeekById = useHourTrackStore((state) => state.loadWeeksById);
    const loadShiftsByWeek = useHourTrackStore((state) => state.loadShiftsByWeek);
    const setWeekImage = useHourTrackStore((state) => state.setWeekImage);
    const addScheduledShift = useHourTrackStore((state) => state.addScheduledShift);
    const editScheduledShift = useHourTrackStore((state) => state.editScheduledShift);
    const removeScheduledShift = useHourTrackStore((state) => state.removeScheduledShift);

    const [showAddShift, setShowAddShift] = useState(false);
    const [editingShift, setEditingShift] = useState<any>(null);

    useEffect(() => {
        if(weekId) {
            loadWeekById(Number(weekId));
            loadShiftsByWeek(Number(weekId));
        }
    }, [weekId]);

    const calculateTotalHours = (): Number => {
        return scheduledShifts.reduce((total, shift) => {
            const [startH, startM] = shift.shift_start.split(':').map(Number);
            const [endH, endM] = shift.shift_end.split(':').map(Number);
            const minutes = (endH * 60 + endM) - (startH * 60 + startM);
            return total + minutes / 60;
        }, 0)
    }

    const getWeekTag = (): string => {
        if(!activeWeek) return '';

        const now = new Date();
        const start = new Date(activeWeek.week_start_date);
        const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if(diffDays < 7) return 'Current week';
        if(diffDays < 14) return 'Last week';
        return `${Math.floor(diffDays / 7)} weeks ago`;
    };

    const handleSaveShift = async (day: string, start: string, end: string) => {
        if(editingShift) {
            await editScheduledShift({
                ...editingShift,
                day_of_week: day,
                shift_start: start,
                shift_end: end,
            });
            setEditingShift(null);
        } else {
            await addScheduledShift({
                week_id: Number(weekId),
                day_of_week: day,
                shift_start: start,
                shift_end: end
            });
        }
        setShowAddShift(false);
    };

    if(!activeWeek) {
        return (
            <View style={styles.loading}>
                <Text style={styles.loadingText}>Loading week...</Text>
            </View>
        )
    }

    const totalHours = calculateTotalHours();

    return (
        <>
            <WeekDetailHeader
                weekStartDate={activeWeek.week_start_date}
                weekEndDate={activeWeek.week_end_date}
                tag={getWeekTag()}
                onBack={() => router.back}
            />

            <ScrollView
                style={styles.screen}
                contentContainerStyle={styles.content}
            >
                <ScheduleImageBox
                    imageUri={activeWeek.schedule_image_url}
                    onImageSelected={(uri) => setWeekImage(Number(weekId), uri)}
                />

                <SectionHeader
                    title="Shifts"
                    actionLabel="+ Add shift"
                    onActionPress={() => {
                        setEditingShift(null);
                        setShowAddShift(true);
                    }}
                />

                {scheduledShifts.length === 0 ? (
                    <EmptyState
                        title="No shifts added yet"
                        message="Add your shifts manually or upload a schedule image above."
                    />
                ) : (
                    scheduledShifts.map((shift) => (
                        <ShiftEntryRow
                            key={shift.id}
                            day={shift.day_of_week}
                            shiftStart={shift.shift_start}
                            shiftEnd={shift.shift_end}
                            onEdit={() => {
                                setEditingShift(shift)
                                setShowAddShift(true)
                            }}
                            onDelete={() => removeScheduledShift(shift.id!)}
                        />
                    ))
                )}

                {scheduledShifts.length > 0 && (
                    <WeekSummaryBar
                        shiftCount={scheduledShifts.length}
                        totalHours={Math.round(Number(totalHours) * 10) / 10}
                        contractedHours={settings?.contracted_weekly_hours ?? 45}
                    />
                )}
            </ScrollView>

            <BottomSheet
                visible={showAddShift}
                onDismiss={() => {
                    setShowAddShift(false)
                    setEditingShift(null)
                }}
                title={editingShift ? 'Edit shift' : 'Add shift'}
            >
                <AddShiftForm
                    weekId={Number(weekId)}
                    onSave={handleSaveShift}
                    onCancel={() => {
                        setShowAddShift(false)
                        setEditingShift(null)
                    }}
                    initialData={
                        editingShift ? {
                            day: editingShift.day_of_week,
                            start: editingShift.shift_start,
                            end: editingShift.shift_end
                        } : undefined
                    }
                />
            </BottomSheet>
        </>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background
    },
    content: {
        padding: spacing.lg,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background
    },
    loadingText: {
        fontSize: fontSize.body,
        color: colors.textMuted
    }
});