import { View, Text, StyleSheet } from 'react-native';
import {
  colors,
  fontSize,
  fontWeight,
  borderRadius,
  spacing,
} from '../../utils/theme';
import AppButton from './AppButton';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  message: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function EmptyState({
  icon = 'file-tray-outline',
  title,
  message,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={26} color={colors.emeraldDark} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onActionPress && (
        <View style={styles.buttonWrap}>
          <AppButton
            label={actionLabel}
            onPress={onActionPress}
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    borderStyle: 'dashed',
    padding: spacing.xxl,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.emeraldLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  message: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  buttonWrap: {
    marginTop: spacing.xs,
  },
});