import { spacing } from "@/src/utils/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import AppInput from "../shared/AppInput";
import AppButton from "../shared/AppButton";

interface EditBasicRateFormProps {
    currentRate: number;
    currentHours: number;
    onSave: (rate: number, hours: number) => Promise<void>;
    onCancel: () => void;
}

export default function EditBasicRateForm({
    currentRate,
    currentHours,
    onSave,
    onCancel
}: EditBasicRateFormProps) {
    const [rate, setRate] = useState(currentRate.toString());
    const [hours, setHours] = useState(currentHours.toString());
    const [errors, setErrors] = useState({ rate: '', hours: '' });
    const [loading, setLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors = { rate: '', hours: '' };
        let valid = true;

        if (!rate || isNaN(Number(rate)) || Number(rate) <= 0) {
            newErrors.rate = 'Please enter a valid hourly rate';
            valid = false;
        }

        if (!hours || isNaN(Number(hours)) || Number(hours) <= 0) {
            newErrors.hours = 'Please enter valid contracted hours';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSve = async () => {
        if (!validate()) return;

        setLoading(true);
        await onSave(Number(rate), Number(hours));
        setLoading(false)
    }
  return (
      <View>
          <AppInput
              label="Hourly rate (R)"
              value={rate}
              onChangeText={setRate}
              placeholder="e.g. 28.00"
              keyboardType="decimal-pad"
              error={errors.rate}
          />

          <AppInput
              label="Contracted weekly hours"
              value={hours}
              onChangeText={setHours}
              placeholder="e.g. 45"
              keyboardType="decimal-pad"
              hint="The total hours you are contracted to work per week"
              error={errors.hours}
          />

          <View style={styles.btnRow}>
              <AppButton
                  label="Cancel"
                  onPress={onCancel}
                  variant="secondary"
                  fullWidth={false}
              />
              <AppButton
                  label="Save changes"
                  onPress={handleSve}
                  loading={loading}
                  fullWidth={false}
              />
          </View>
    </View>
  )
}

const styles = StyleSheet.create({
    btnRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.sm
    }
})
