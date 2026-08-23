import { borderRadius, colors, fontSize, fontWeight, shadow, spacing } from "@/src/utils/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SettingsSectionRow from "./SettingsSectionRow";

interface Row {
    label: string;
    value: string;
}

interface SettingsSectionCardProps {
    title: string;
    rows: Row[];
    onEdit: () => void;
}

export default function SettingsSectionCard({ 
    title,
    rows,
    onEdit
}: SettingsSectionCardProps) {
  return (
      <View style={styles.card}>
          <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
                  <Text style={styles.editLabel}>Edit</Text>
              </TouchableOpacity>
          </View>
          <View style={styles.body}>
              {rows.map((row, index) => (
                  <SettingsSectionRow
                      key={index}
                      label={row.label}
                      value={row.value}
                  />
              ))}
          </View>
      </View>
  )
}


const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadow.sm
    },
    header: {
        backgroundColor: colors.forest,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: fontSize.label,
        fontWeight: fontWeight.bold,
        color: colors.background
    },
    editLabel: {
        fontSize: fontSize.caption,
        color: colors.emeraldSoft,
        fontWeight: fontWeight.semibold
    },
    body: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xs
    }
})