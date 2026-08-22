import { router, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '../src/database';
import { useHourTrackStore } from '../src/store';
import { colors, fontSize, fontWeight } from '../src/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const loadSettings = useHourTrackStore((state) => state.loadSettings);

  useEffect(() => {
    const initialise = async () => {
      await initDatabase();
      await loadSettings();
      const settings = useHourTrackStore.getState().settings;
      if (!settings || settings.onboarding_complete === 0) {
        router.replace('/onboarding/step1')
      }
    };
    initialise().catch((error) => {
      console.error('Initialisation failed:', error);
    });
  }, []);

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.emerald,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 94,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: fontSize.caption,
            fontWeight: fontWeight.semibold,
          },
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.textPrimary,
            fontSize: fontSize.h2,
            fontWeight: fontWeight.bold,
          },
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="log-hours"
          options={{
            title: 'Log Hours',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'time' : 'time-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="summary"
          options={{
            title: 'Summary',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'bar-chart' : 'bar-chart-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="onboarding"
          options={{
            href: null,
            headerShown: false,
            tabBarStyle: {display: 'none'}
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}