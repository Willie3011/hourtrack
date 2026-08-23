import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { useHourTrackStore } from "../src/store";
import { colors, fontSize, spacing } from "../src/utils/theme";
import SettingsSectionCard from "../src/components/settings/SettingsSectionCard";
import BottomSheet from "../src/components/shared/BottomSheet";
import EditBasicRateForm from "../src/components/settings/EditBasicRateForm";
import EditOvertimeForm from "../src/components/settings/EditOvertimeForm";
import EditHolidayPayForm from "../src/components/settings/EditHolidayPayForm";
import EditNightshiftForm from "../src/components/settings/EditNightshiftForm";

type ActiveModal = 'basicRate' | 'overtime' | 'holidayPay' | 'nightshift' | null;

export default function SettingsScreen() {
  const settings = useHourTrackStore((state) => state.settings);
  const updateSettingsInStore = useHourTrackStore((state) => state.updateSettings);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  if (!settings) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  const handleSaveBasicRate = async (rate: number, hours: number) => {
    await updateSettingsInStore({
      hourly_rate: rate,
      contracted_weekly_hours: hours,
    });
    setActiveModal(null);
  }

  const handleSaveOvertime = async (multiplier: number) => {
    await updateSettingsInStore({ overtime_multiplier: multiplier });
    setActiveModal(null);
  }

  const handleSaveHolidayPay = async (enabled: boolean, multiplier: number) => {
    await updateSettingsInStore({
      holiday_pay_enabled: enabled ? 1 : 0,
      holiday_multiplier: multiplier,
    });
    setActiveModal(null);
  }

  const handleSaveNightshift = async (enabled: boolean) => {
    await updateSettingsInStore({ nightshift_enabled: enabled ? 1 : 0 });
    setActiveModal(null);
  }

  const overtimeRate = (settings.hourly_rate * settings.overtime_multiplier).toFixed(2);

  const holidayRate = (settings.hourly_rate * settings.holiday_multiplier);

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
      >
        <SettingsSectionCard
          title="Basic rate"
          rows={[
            {
              label: 'Hourly rate',
              value: `R${settings.hourly_rate.toFixed(2)} / hr`
            }, 
            {
              label: "Contracted weekly hours",
              value: `${settings.contracted_weekly_hours} hrs`
            }
          ]}
          onEdit={() => setActiveModal('basicRate')}
        />
        <SettingsSectionCard
          title="Overtime"
          rows={[
            {
              label: 'Overtime multiplier',
              value: `R${settings.overtime_multiplier}x`
            }, 
            {
              label: "Overtime rate",
              value: `R${overtimeRate} / hr`
            }
          ]}
          onEdit={() => setActiveModal('overtime')}
        />
        <SettingsSectionCard
          title="Holiday pay"
          rows={[
            {
              label: 'Holiday pay enabled',
              value: settings.holiday_pay_enabled === 1 ? 'On' : 'Off'
            },
            ...(settings.holiday_pay_enabled === 1
              ? [
                {
                  label: 'Holiday multiplier',
                  value: `${settings.holiday_multiplier}x`,
                },
                {
                  label: 'Holiday rate',
                  value: `R${holidayRate} / hr`
                }
              ]
            : []
            )
          ]}
          onEdit={() => setActiveModal('holidayPay')}
        />
        <SettingsSectionCard
          title="Nightshift"
          rows={[
            {
              label: 'Nightshift tracking',
              value: settings.nightshift_enabled === 1 ? 'On' : 'Off',
            }
          ]}
          onEdit={() => setActiveModal('nightshift')}
        />
      </ScrollView>

      <BottomSheet
        visible={activeModal === "basicRate"}
        onDismiss={() => setActiveModal(null)}
        title="Edit basic rate"
      >
        <EditBasicRateForm
          currentRate={settings.hourly_rate}
          currentHours={settings.contracted_weekly_hours}
          onSave={handleSaveBasicRate}
          onCancel={() => setActiveModal(null)}
        />
      </BottomSheet>

      <BottomSheet
        visible={activeModal === 'overtime'}
        onDismiss={() => setActiveModal(null)}
        title="Edit overtime"
      >
        <EditOvertimeForm
          currentMultiplier={settings.overtime_multiplier}
          hourlyRate={settings.hourly_rate}
          onSave={handleSaveOvertime}
          onCancel={() => setActiveModal(null)}
        />
      </BottomSheet>

      <BottomSheet
        visible={activeModal === 'holidayPay'}
        onDismiss={() => setActiveModal(null)}
        title="Edit holiday pay"
      >
        <EditHolidayPayForm
          enabled={settings.holiday_pay_enabled === 1}
          currentMultiplier={settings.holiday_multiplier}
          hourlyRate={settings.hourly_rate}
          onSave={handleSaveHolidayPay}
          onCancel={() => setActiveModal(null)}
        />
      </BottomSheet>

      <BottomSheet
        visible={activeModal === 'nightshift'}
        onDismiss={() => setActiveModal(null)}
        title="Edit nightshift"
      >
        <EditNightshiftForm
          enabled={settings.nightshift_enabled === 1}
          hourlyRate={settings.hourly_rate}
          overtimeMultiplier={settings.overtime_multiplier}
          onSave={handleSaveNightshift}
          onCancel={() => setActiveModal(null)}
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
    padding: spacing.lg
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
})