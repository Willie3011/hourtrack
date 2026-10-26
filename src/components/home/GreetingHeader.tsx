import { colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { StyleSheet, Text, View } from "react-native";

interface GreetingHeaderProps {
    greeting: string;
    subtitle: string;
}

export default function GreetingHeader({ 
    greeting, subtitle
}: GreetingHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    greeting: {
        fontSize: fontSize.h1,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs
    },
    subtitle: {
        fontSize: fontSize.body,
        color: colors.textMuted
    }
})