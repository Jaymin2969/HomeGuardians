import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RegistrationScreen from '../screens/RegistrationScreen';
import TaskManagementScreen from '../screens/TaskManagementScreen/TaskManagementScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // New state to track login status

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const firstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (firstLaunch === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('isFirstLaunch', 'false');
        } else {
          setIsFirstLaunch(false);
        }

        // Check if the user is already logged in
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData); // Parse the user data
          if (parsedUserData.token) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking first launch or login status:', error);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Show Onboarding screen only for first time users */}
        {isFirstLaunch && (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        )}

        {/* Always show TaskManagement, and let login state handle if it's accessed */}
        <Stack.Screen
          name="TaskManagement"
          component={TaskManagementScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Setting"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
