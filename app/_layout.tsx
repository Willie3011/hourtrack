import { Tabs } from "expo-router";
import "./global.css";
import { initDatabase } from "../src/database";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch((error) => {
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
