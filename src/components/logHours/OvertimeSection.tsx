import { View } from "react-native";
import OvertimeToggleBlock from "./OvertimeToggleBlock";

interface OvertimeSectionProps {
    overtimeBeforeEnabled: boolean;
    overtimeBeforeStart: string;
    overtimeBeforeEnd: string;
    overtimeAfterEnabled: boolean;
    overtimeAfterStart: string;
    overtimeAfterEnd: string;
    errors: {
        overtimeBeforeStart?: string;
        overtimeBeforeEnd?: string;
        overtimeAfterStart?: string;
        overtimeAfterEnd?: string;
    };
    onChange: (field: string, value: any) => void;
}

export default function OvertimeSection({
    overtimeBeforeEnabled,
    overtimeBeforeStart,
    overtimeBeforeEnd,
    overtimeAfterEnabled,
    overtimeAfterStart,
    overtimeAfterEnd,
    errors,
    onChange,
}: OvertimeSectionProps) {
    return (
        <View>
            <OvertimeToggleBlock
                label="Overtime before shift"
                hint="Turn on if you worked overtime before your regular shift started"
                enabled={overtimeBeforeEnabled}
                startTime={overtimeBeforeStart}
                endTime={overtimeBeforeEnd}
                startError={errors.overtimeBeforeStart}
                endError={errors.overtimeBeforeEnd}
                onToggle={(value) => onChange('overtimeBeforeEnabled', value)}
                onStartChange={(time) => onChange('overtimeBeforeStart', time)}
                onEndChange={(time) => onChange('overtimeBeforeEnd', time)}
            />
            <OvertimeToggleBlock
                label="Overtime after shift"
                hint="Turn on if you worked overtime after your regular shift ended"
                enabled={overtimeAfterEnabled}
                startTime={overtimeAfterStart}
                endTime={overtimeAfterEnd}
                startError={errors.overtimeAfterStart}
                endError={errors.overtimeAfterEnd}
                onToggle={(value) => onChange('overtimeAfterEnabled', value)}
                onStartChange={(time) => onChange('overtimeAfterStart', time)}
                onEndChange={(time) => onChange('overtimeAfterEnd', time)}
            />
        </View>
    )
}