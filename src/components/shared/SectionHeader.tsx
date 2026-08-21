import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  colors,
  fontSize,
  fontWeight,
  spacing,
} from '../../utils/theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onActionPress && (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.h3,
    fontWeight: fontWeight.bold,
    color: colors.forest,
  },
  action: {
    fontSize: fontSize.caption,
    color: colors.emerald,
    fontWeight: fontWeight.semibold,
  },
});