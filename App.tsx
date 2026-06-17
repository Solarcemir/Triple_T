import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import { colors } from './src/constants/theme';

// TODO: create these two screens next
// import StatsScreen from './src/screens/StatsScreen';
// import ManageScreen from './src/screens/ManageScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            tabBarStyle: { backgroundColor: colors.tabBar, borderTopColor: colors.cardBorder },
            tabBarActiveTintColor: colors.green,
            tabBarInactiveTintColor: colors.textSecondary,
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          {/* Add Stats and Manage here when ready */}
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
