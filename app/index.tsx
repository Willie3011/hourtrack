import { useHourTrackStore } from "@/src/store";
import { Text, View } from "react-native";

export default function Index() {
  const isReady = useHourTrackStore((state) => state.isReady);




  return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>HourTrack</Text>
      <Text>Store ready: {isReady ? 'Yes' : 'No'}</Text>

    </View>

  );
}
