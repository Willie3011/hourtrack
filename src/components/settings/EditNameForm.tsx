import { useState } from "react";
import { View, StyleSheet } from "react-native";
import AppInput from "../shared/AppInput";
import AppButton from "../shared/AppButton";
import { spacing } from "@/src/utils/theme";

interface EditNameFormProps {
    currentName: string;
    onSave: (name: string) => Promise<void>;
    onCancel: () => void;
}

export default function EditNameForm({
    currentName,
    onSave,
    onCancel
}: EditNameFormProps) {
    const [name, setName] = useState(currentName);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const trimmed = name.trim();
        if(!trimmed) {
            setError('Please enter your name')
            return;
        }

        if(trimmed.length > 30) {
            setError('Keep it under 30 characters');
            return;
        }
        setError('');
        setLoading(true)
        try {
            await onSave(trimmed);
        } finally {
            setLoading(false)
        }
    };

    return (
        <View>
            <AppInput
                label="Your name"
                value={name}
                onChangeText={setName}
                placeholder="e.g. John"
                autoCapitalize="words"
                hint="Shown on your home screen and on reports you share"
                error={error}
            />
            <View style={styles.btnRow}>
                <AppButton
                    label="Cancel"
                    onPress={onCancel}
                    variant="secondary"
                    fullWidth={false}
                />
                <AppButton
                    label="Save"
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