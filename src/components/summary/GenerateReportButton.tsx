import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../shared/AppButton';
import { colors, fontSize, spacing } from '../../utils/theme';

interface Props {
  disabled: boolean;
  loading?: boolean;
  onPress: () => void;
}

export default function GenerateReportButton({ disabled, loading, onPress }: Props) {
  return (
    <View style={styles.container}>
      <AppButton
        label="Generate report"
        onPress={onPress}
        loading={loading}
        variant={disabled ? 'disabled' : 'primary'}
      />
      {disabled && <Text style={styles.note}>Log shifts to enable report</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: spacing.xl },
  note: { fontSize: fontSize.caption, color: colors.textHint, textAlign: 'center', marginTop: spacing.sm },
});