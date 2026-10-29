import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, borderRadius, spacing } from '../../utils/theme';

export type SummaryView = 'weekly' | 'monthly';

interface Props {
  activeView: SummaryView;
  onChange: (view: SummaryView) => void;
}

export default function SummaryToggle({ activeView, onChange }: Props) {
  return (
    <View style={styles.row}>
      {(['weekly', 'monthly'] as SummaryView[]).map((view) => (
        <TouchableOpacity
          key={view}
          style={[styles.btn, activeView === view && styles.btnActive]}
          onPress={() => onChange(view)}
          activeOpacity={0.8}
        >
          <Text style={[styles.label, activeView === view && styles.labelActive]}>
            {view === 'weekly' ? 'Weekly' : 'Monthly'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  btnActive: { backgroundColor: colors.emerald },
  label: { fontSize: fontSize.label, color: colors.textMuted, fontWeight: fontWeight.medium },
  labelActive: { color: colors.background, fontWeight: fontWeight.bold },
});