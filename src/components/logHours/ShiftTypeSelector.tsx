import { StyleSheet, View } from "react-native";
import ShiftTypeButton from "./ShiftTypeButton";
import { spacing } from "@/src/utils/theme";

type ShiftType = 'Regular' | 'Holiday' | 'Nightshift';

interface ShiftTypeSelectorProps {
    selected: ShiftType,
    onChange: (type: ShiftType) => void;
}

const SHIFT_TYPES: ShiftType[] = ['Regular', 'Holiday', 'Nightshift'];

export default function ShiftTypeSelector({
    selected,
    onChange
}: ShiftTypeSelectorProps) {
    return (
        <View style={styles.container}>
            {SHIFT_TYPES.map((type) => (
                <ShiftTypeButton
                    key={type}
                    label={type}
                    selected={selected === type}
                    onPress={() => onChange(type)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md
    }
})