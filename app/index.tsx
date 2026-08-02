import { openDatabase } from "@/src/database";
import { useHourTrackStore } from "@/src/store";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const isReady = useHourTrackStore((state) => state.isReady);
  const [dbStatus, setDbStatus] = useState('connecting...');

  useEffect(() => {
    openDatabase()
      .then(() => setDbStatus('connected'))
      .catch(() => setDbStatus('failed to connect'));
  }, [])

  return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>HourTrack</Text>
      <Text>Store ready: {isReady ? 'Yes' : 'No'}</Text>
      <Text>Database: {dbStatus}</Text>
    </View>

  );
}
