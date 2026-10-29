import EditBasicRateForm from "@/src/components/settings/EditBasicRateForm";
import EditHolidayPayForm from "@/src/components/settings/EditHolidayPayForm";
import EditNameForm from "@/src/components/settings/EditNameForm";
import EditNightshiftForm from "@/src/components/settings/EditNightshiftForm";
import EditOvertimeForm from "@/src/components/settings/EditOvertimeForm";
import ProfileHeader from "@/src/components/settings/ProfileHeader";
import SettingsGroup from "@/src/components/settings/SettingsGroup";
import SettingsListItem from "@/src/components/settings/SettingsListItem";
import BottomSheet from "@/src/components/shared/BottomSheet";
import { useHourTrackStore } from "@/src/store";
import { colors, fontSize, spacing } from "@/src/utils/theme";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type ActiveModal =
  "name" | "basicRate" | "overtime" | "holidayPay" | "nightshift" | null;

export default function SettingsScreen() {
  const settings = useHourTrackStore((state) => state.settings);
  const updateSettingsInStore = useHourTrackStore(
    (state) => state.updateSettings,
  );
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  if (!settings) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading settings</Text>
      </View>
    );
  }

  const close = () => setActiveModal(null);

  const handleSaveName = async (name: string) => {
    await updateSettingsInStore({ name });
    close();
  };

  const handleSaveBasicRate = async (rate: number, hours: number) => {
    await updateSettingsInStore({
      hourly_rate: rate,
      contracted_weekly_hours: hours,
    });
    close();
  };

  const handleSaveOvertime = async (multiplier: number) => {
    await updateSettingsInStore({ overtime_multiplier: multiplier });
    close();
  };

  const handleSaveHolidayPay = async (enabled: boolean, multiplier: number) => {
    await updateSettingsInStore({
      holiday_pay_enabled: enabled ? 1 : 0,
      holiday_multiplier: multiplier,
    });
    close();
  };

  const handleSaveNightshift = async (enabled: boolean) => {
    await updateSettingsInStore({ nightshift_enabled: enabled ? 1 : 0 });
    close();
  };

  const overtimeRate = (
    settings.hourly_rate * settings.overtime_multiplier
  ).toFixed(2);
  const holidayRate = (
    settings.hourly_rate * settings.holiday_multiplier
  ).toFixed(2);
  const holidayOn = settings.holiday_pay_enabled === 1;
  const nightshiftOn = settings.nightshift_enabled === 1;

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ProfileHeader
          name={settings.name ?? ''}
          onPress={() => setActiveModal('name')}
        />

        <SettingsGroup title='Pay'>
          <SettingsListItem
            icon="cash-outline"
            title="Hourly rate"
            subtitle="Your basic rate"
            value={`R ${settings.hourly_rate.toFixed(2)}`}
            onPress={() => setActiveModal('basicRate')}
          />
          <SettingsListItem
            icon="time-outline"
            title="Contracted hours"
            subtitle="Per week"
            value={`${settings.contracted_weekly_hours} hrs`}
            onPress={() => setActiveModal('basicRate')}
          />
          <SettingsListItem
            icon="flash-outline"
            variant="forest"
            title="Overtime"
            subtitle={`${settings.overtime_multiplier}x your rate`}
            value={`R ${overtimeRate}`}
            onPress={() => setActiveModal('overtime')}
          />
        </SettingsGroup>

        <SettingsGroup title="Shift types">
          <SettingsListItem
            icon="star-outline"
            title="Holiday pay"
            subtitle={
              holidayOn ? `${settings.holiday_multiplier}x · R ${holidayRate} / hr` :
              'Tap to set a holiday rate'
            }
            onPress={() => setActiveModal('holidayPay')}
            toggle={{
              value: holidayOn,
              onChange: (value) => updateSettingsInStore({holiday_pay_enabled: value ? 1 : 0})
            }}
          />
          <SettingsListItem
            icon="moon-outline"
            variant="indigo"
            title="Nightshift"
            subtitle={
              nightshiftOn
                ? '1 hr overtime + 10% allowance'
                : 'Tracking is off'
            }
            onPress={() => setActiveModal('nightshift')}
            toggle={{
              value: nightshiftOn,
              onChange: (value) =>
                updateSettingsInStore({ nightshift_enabled: value ? 1 : 0 }),
            }}
          />
        </SettingsGroup>
      </ScrollView>

      <BottomSheet visible={activeModal === 'name'} onDismiss={close} title="Your name">
        <EditNameForm
          currentName={settings.name ?? ''}
          onSave={handleSaveName}
          onCancel={close}
        />
      </BottomSheet>
      <BottomSheet visible={activeModal === 'basicRate'} onDismiss={close} title="Edit basic rate">
        <EditBasicRateForm
          currentRate={settings.hourly_rate}
          currentHours={settings.contracted_weekly_hours}
          onSave={handleSaveBasicRate}
          onCancel={close}
        />
      </BottomSheet>

      <BottomSheet visible={activeModal === 'overtime'} onDismiss={close} title="Edit overtime">
        <EditOvertimeForm
          currentMultiplier={settings.overtime_multiplier}
          hourlyRate={settings.hourly_rate}
          onSave={handleSaveOvertime}
          onCancel={close}
        />
      </BottomSheet>

      <BottomSheet visible={activeModal === 'holidayPay'} onDismiss={close} title="Edit holiday pay">
        <EditHolidayPayForm
          enabled={holidayOn}
          currentMultiplier={settings.holiday_multiplier}
          hourlyRate={settings.hourly_rate}
          onSave={handleSaveHolidayPay}
          onCancel={close}
        />
      </BottomSheet>

      <BottomSheet visible={activeModal === 'nightshift'} onDismiss={close} title="Edit nightshift">
        <EditNightshiftForm
          enabled={nightshiftOn}
          hourlyRate={settings.hourly_rate}
          overtimeMultiplier={settings.overtime_multiplier}
          onSave={handleSaveNightshift}
          onCancel={close}
        />
      </BottomSheet>
    </>
  )
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
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: fontSize.body,
    color: colors.textMuted,
  },
});
