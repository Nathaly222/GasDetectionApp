import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
      <Stack.Navigator initialRouteName="Sign up">
        <Stack.Screen name="Sign up" component={Auth} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name='DashboardScreen' component={DashboardScreen} />
      </Stack.Navigator>
  );
};

export default App;
