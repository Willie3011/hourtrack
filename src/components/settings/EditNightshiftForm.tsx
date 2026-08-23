import { useState } from "react";
import { View, StyleSheet } from 'react-native';
import AppButton from "../shared/AppButton";
import AppToggle from "../shared/AppToggle";
import RuleBox from "../shared/RuleBox";
import RatePreviewBox from "../shared/RatePreviewBox";
import { spacing } from "../../utils/theme";

interface EditNightshiftFormProps {
    enabled: boolean;
    hourlyRate: number;
    overtimeMultiplier: number;
    onSave: (enabled: boolean) => Promise<void>;
    onCancel: () => void;
}

export default function EditNightshiftForm({
    enabled,
    hourlyRate,
    overtimeMultiplier,
    onSave,
    onCancel
}: EditNightshiftFormProps) {
    const [nightshiftEnabled, setNightshiftEnabled] = useState(enabled);
    const [loading, setLoading] = useState(false);

    const overtimeRate = (hourlyRate * overtimeMultiplier).toFixed(2);
    const nightshiftAllowance = (hourlyRate * 0.1).toFixed(2);

    const handleSave = async () => {
        setLoading(true);
        await onSave(nightshiftEnabled);
        setLoading(false);
    };

    return (
        <View>
            <AppToggle
                label="Enable nightshift tracking"
                value={nightshiftEnabled}
                onValueChange={setNightshiftEnabled}
                hint="Turn on if you occasionally work nightshift hours"
            />
            {nightshiftEnabled && (
                <>
                    <RuleBox
                        title="How nightshift is calculated"
                        rules={[
                            '1 hour per shift is automatically converted to overtime',
                            'Remaining hours are paid at your regular rate',
                            'A 10% nightshift allowance is added on top of the remaining hours',
                        ]}
                    />
                    <RatePreviewBox
                        label="Nightshift rate preview"
                        lines={[
                            `Overtime (1 hr): R ${overtimeRate} (R ${hourlyRate.toFixed(2)} × ${overtimeMultiplier})`,
                            `Regular rate (remaining hrs): R ${hourlyRate.toFixed(2)} / hr`,
                            `Nightshift allowance: R ${nightshiftAllowance} / hr (10% of R ${hourlyRate.toFixed(2)})`,
                        ]}
                    />
                </>
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