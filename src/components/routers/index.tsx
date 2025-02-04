import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@ui-kitten/components';
import Auth from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import NotificationScreen from '../screens/EventsScreen';
import { RootStackParamList, MainTabsParamList } from '../types/navigation';
import ProfileScreen from '../screens/PreferencesScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();


const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'Dashboard') {
            iconName = 'home-outline';
          } else if (route.name === 'Notification') {
            iconName = 'bell-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline';
          }
          return <Icon name={iconName} fill={color} style={{ width: size, height: size }} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ 
          title: 'Inicio',
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ 
          title: 'Notificaciones',
          headerShown: false
        }}
      />
      <Tab.Screen
        name='Settings'
        component={ProfileScreen}
        options={{
          title:'Configuraciones',
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
};

const AppRouter = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Sign up"
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen name="Sign up" component={Auth} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ 
          headerShown: false,
          gestureEnabled: false 
        }}
      />
    </Stack.Navigator>
  );
};

export default AppRouter;
