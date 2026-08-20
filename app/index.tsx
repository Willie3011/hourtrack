import { View, Text } from 'react-native';
import { useHourTrackStore } from '../src/store';

export default function HomeScreen() {
  const settings = useHourTrackStore((state) => state.settings);
  const settingsLoading = useHourTrackStore((state) => state.settingsLoading);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home</Text>
      <Text>
        Settings: {settingsLoading ? 'Loading...' : settings ? 'Loaded' : 'No settings yet'}
      </Text>
    </View>
  );
}