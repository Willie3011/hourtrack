import { View } from 'react-native';
import { router } from 'expo-router';
import AppButton from '../src/components/shared/AppButton';
import { colors, spacing } from '../src/utils/theme';

export default function HomeScreen() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.lg,
      justifyContent: 'center',
    }}>
      <AppButton
        label="Go to onboarding"
        onPress={() => router.push('/onboarding/step1')}
      />
    </View>
  );
}