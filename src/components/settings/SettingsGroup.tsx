import { borderRadius, colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SettingsGroupProps {
    title: string;
    children: React.ReactNode
}

export default function SettingsGroup({title, children}: SettingsGroupProps) {
    const items = React.Children.toArray(children);

    return (
        <View style={styles.wrap}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.card}>
                {items.map((child, index) => (
                    <View key={index}>
                        {child}
                        {index < items.length - 1 && <View style={styles.divider}/>}
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        marginTop: spacing.lg
    },
    title: {
        fontSize: fontSize.caption,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: spacing.sm
    },
    card: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: 56
    }
})