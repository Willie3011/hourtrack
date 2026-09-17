import { StyleSheet, View } from "react-native";
import AppToggle from "../shared/AppToggle";
import TimePicker from "../shared/TimePicker";
import { colors, spacing } from "@/src/utils/theme";


interface OvertimeToggleBlockProps {
    label: string;
    hint: string;
    enabled: boolean;
    startTime: string;
    endTime: string;
    startError?: string;
    endError?: string;
    onToggle: (value: boolean) => void;
    onStartChange: (time: string) => void;
    onEndChange: (time: string) => void;
}

export default function OvertimeToggleBlock({
    label,
    hint,
    enabled,
    startTime,
    endTime,
    startError,
    endError,
    onToggle,
    onStartChange,
    onEndChange
}: OvertimeToggleBlockProps) {
    return (
        <View style={styles.container}>
            <AppToggle
                label={label}
                value={enabled}
                onValueChange={onToggle}
                hint={hint}
            />
            {enabled && (
                <View style={styles.timeRow}>
                    <View style={styles.timeCol}>
                        <TimePicker
                            label="OT start"
                            value={startTime}
                            onChange={onStartChange}
                            error={startError}
                        />
                    </View>
                    <View style={styles.timeCol}>
                        <TimePicker
                            label="OT end"
                            value={endTime}
                            onChange={onEndChange}
                            error={endError}
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: spacing.sm,
        padding: spacing.md,
        marginBottom: spacing.md
    },
    timeRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.sm
    },
    timeCol: {
        flex: 1
    }
})