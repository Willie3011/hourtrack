import { colors, fontSize, fontWeight, spacing } from "@/src/utils/theme";
import { StyleSheet, Text, View } from "react-native";

interface SettingsSectionRowProps {
    label: string;
    value: string;
}

export default function SettingsSectionRow({
    label,
    value
}: SettingsSectionRowProps) {
  return (
      <View style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
      </View>
  )
}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    label: {
        fontSize: fontSize.caption,
        color: colors.textMuted,
        flex: 1,
    },
    value: {
        fontSize: fontSize.caption,
        fontWeight: fontWeight.semibold,
        color: colors.emeraldDark
    }
})