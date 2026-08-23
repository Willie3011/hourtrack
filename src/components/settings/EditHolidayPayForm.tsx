import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AppInput from '../shared/AppInput';
import AppButton from '../shared/AppButton';
import AppToggle from '../shared/AppToggle';
import RatePreviewBox from '../shared/RatePreviewBox';
import { spacing } from '../../utils/theme';

interface EditHolidayPayFormProps {
    enabled: boolean;
    currentMultiplier: number;
    hourlyRate: number;
    onSave: (enabled: boolean, multiplier: number) => Promise<void>;
    onCancel: () => void;
}

export default function EditHolidayPayForm({
    enabled,
    currentMultiplier,
    hourlyRate,
    onSave,
    onCancel
}: EditHolidayPayFormProps) {
    const [holidayEnabled, setHolidayEnabled] = useState(enabled);
    const [multiplier, setMultiplier] = useState(currentMultiplier.toString());
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);


    const holidayRate = holidayEnabled && !isNaN(Number(multiplier)) && Number(multiplier) > 0 ? (hourlyRate * Number(multiplier)).toFixed(2) : null;

    const validate = (): boolean => {
        if (holidayEnabled) {
            if (!multiplier || isNaN(Number(multiplier)) || Number(multiplier) <= 0) {
                setError('Please enter a valid holiday rate multiplier');
                return false
            }
        }
        setError('');
        return true;
    }

    const handleSave = async () => {
        if (!validate()) return;

        setLoading(true);
        await onSave(holidayEnabled, Number(multiplier));
        setLoading(false);
    };

    return (
        <View>
            <AppToggle
                label="Enable holiday pay"
                value={holidayEnabled}
                onValueChange={(value) => {
                    setHolidayEnabled(value);
                    setError('');
                }}
                hint='Turn on if you earn a different rate on public holidays'
            />

            {holidayEnabled && (
                <>
                    <AppInput
                        label="Holiday multiplier"
                        value={multiplier}
                        onChangeText={setMultiplier}
                        placeholder='e.g. 2'
                        keyboardType='decimal-pad'
                        hint="2 means you earn double your hourly rate on public holidays"
                        error={error}
                    />
                    {holidayRate && (
                        <RatePreviewBox
                            label="Holiday rate preview"
                            lines={[
                                `R${hourlyRate.toFixed(2)} x ${multiplier} = R${holidayRate} / hr`,
                            ]}
                        />
                    )}
                </>
            )}
            <View style={styles.btnRow}>
                <AppButton
                    label="Cancel"
                    onPress={onCancel}
                    variant='secondary'
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
        marginTop: spacing.sm
    }
})
