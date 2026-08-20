import { Tabs } from "expo-router";
import "./global.css";
import { useEffect } from "react";
import { initDatabase } from "../src/database";
import { useHourTrackStore } from "../src/store";

export default function RootLayout() {
  const loadSettings = useHourTrackStore((state) => state.loadSettings)

  useEffect(() => {
    const initialise = async () => {
      await initDatabase();
      await loadSettings();
    }
    initialise().catch((error) => {
      console.error('Error initializing database:', error);
    });
  }, []);

  return (<Tabs>
    <Tabs.Screen name="index" options={{ title: "Home" }} />
    <Tabs.Screen name="schedule" options={{ title: "Schedule" }} />
    <Tabs.Screen name="log-hours" options={{ title: "Log Hours" }} />
    <Tabs.Screen name="summary" options={{ title: "Summary" }} />
    <Tabs.Screen name="settings" options={{ title: "Settings" }} />
  </Tabs>)
}
