import { View, ScrollView } from 'react-native';
import RuleBox from '../src/components/shared/RuleBox';
import { colors, spacing } from '../src/utils/theme';

export default function HomeScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
    >
      <RuleBox
        title="How nightshift is calculated"
        rules={[
          '1 hour per shift is automatically converted to overtime',
          'Remaining hours are paid at your regular rate',
          'A 10% nightshift allowance is added on top of the remaining hours',
        ]}
      />
      <RuleBox
        title="How overtime works"
        rules={[
          'Overtime can occur before or after your regular shift',
          'Each overtime period is calculated at your overtime multiplier',
          'Both before and after overtime can apply on the same day',
        ]}
      />
    </ScrollView>
  );
}