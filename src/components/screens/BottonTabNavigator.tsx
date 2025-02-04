import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@ui-kitten/components';
import DashboardScreen from '../screens/DashboardScreen';
import NotificationScreen from '../screens/EventsScreen';

export type RootTabParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName = '';

          if (route.name === 'Dashboard') iconName = 'home-outline';
          else if (route.name === 'Orders') iconName = 'bell-outline';
          else if (route.name === 'Settings') iconName = 'settings-outline';

          return <Icon name={iconName} fill={color} style={{ width: size, height: size }} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Orders" component={NotificationScreen} options={{ title: 'Pedidos' }} />   
      </Tab.Navigator>
  );
};

export default BottomTabNavigator;
