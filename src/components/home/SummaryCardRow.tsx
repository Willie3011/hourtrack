import { StyleSheet, View } from "react-native";
import SummaryCard from "./SummaryCard";
import { spacing } from "@/src/utils/theme";

interface SummaryCardRowProps {
    weeklyHours: number;
    weeklyEarnings: number;
    monthlyHours: number;
    monthlyEarnings: number;
    contractedHours: number;
    isEmpty?: boolean;
}

export default function SummarCardRow({
    weeklyHours,
    weeklyEarnings,
    monthlyHours,
    monthlyEarnings,
    contractedHours,
    isEmpty = false
}: SummaryCardRowProps) {
    return (
        <View style={styles.row}>
            <SummaryCard
                label="This week"
                hours={weeklyHours}
                earnings={weeklyEarnings}
                subLabel={`of ${contractedHours} contracted hrs`}
                isEmpty={isEmpty}
            />
            <SummaryCard
                label="This month"
                hours={monthlyHours}
                earnings={monthlyEarnings}
                subLabel='Expected gross'
                isEmpty={isEmpty}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        gap: spacing.md,
        marginBottom: spacing.lg
    }
})