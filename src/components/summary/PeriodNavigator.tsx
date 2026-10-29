import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, borderRadius, spacing } from '../../utils/theme';

interface Props {
  label: string;
  subLabel: string;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export default function PeriodNavigator({
  label, subLabel, canGoForward, onPrevious, onNext,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.arrow} onPress={onPrevious} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subLabel}>{subLabel}</Text>
      </View>
      <TouchableOpacity
        style={styles.arrow}
        onPress={onNext}
        disabled={!canGoForward}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-forward"
          size={22}
          color={canGoForward ? colors.textPrimary : colors.border}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  arrow: { padding: spacing.md, minWidth: 48, alignItems: 'center' },
  center: { alignItems: 'center' },
  label: { fontSize: fontSize.body, fontWeight: fontWeight.bold, color: colors.textPrimary },
  subLabel: { fontSize: fontSize.caption, color: colors.textMuted, marginTop: 2 },
});