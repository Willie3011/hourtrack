import { spacing } from "@/src/utils/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../shared/AppButton";
import RatePreviewBox from "../shared/RatePreviewBox";
import AppInput from "../shared/AppInput";

interface EditOvertimeFormProps {
    currentMultiplier: number;
    hourlyRate: number;
    onSave: (multiplier: number) => Promise<void>;
    onCancel: () => void;
}

export default function EditOvertimeForm({ 
    currentMultiplier,
    hourlyRate,
    onSave,
    onCancel
}: EditOvertimeFormProps) {
    const [multiplier, setMultiplier] = useState(currentMultiplier.toString());
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const overtimeRate = !isNaN(Number(multiplier)) && Number(multiplier) > 0 ? (hourlyRate * Number(multiplier)).toFixed(2) : null;

    const validate = (): boolean => {
        if (!multiplier || isNaN(Number(multiplier)) || Number(multiplier) <= 0) {
            setError('Please enter a valid overtime multiplier');
            return false
        }

        setError('');
        return true;
    }

    const handleSave = async () => {
        if (!validate()) return;

        setLoading(true);
        await onSave(Number(multiplier));
        setLoading(false);
    }
  return (
        <View>
            <AppInput
                label="Overtime multiplier"
                value={multiplier}
                onChangeText={setMultiplier}
                placeholder="e.g. 1.5"
                keyboardType="decimal-pad"
                hint="1.5 means you earn 1.5x your hourly rate for every overtime hour"
                error={error}
            />
            {overtimeRate && (
                <RatePreviewBox
                    label="Overtime rate preview"
                    lines={[
                        `R ${hourlyRate.toFixed(2)} × ${multiplier} = R ${overtimeRate} / hr`,
                    ]}
                />
            )}
            <View style={styles.btnRow}>
                <AppButton
                    label="Cancel"
                    onPress={onCancel}
                    variant="secondary"
                    fullWidth={false}
                />
                <AppButton
                    label="Save changes"
                    onPress={handleSave}
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
    marginTop: spacing.sm,
  },
});