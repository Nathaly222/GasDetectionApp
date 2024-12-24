import React from 'react';
import { ApplicationProvider } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import AppRouter from './src/components/routers';

const App = () => {
  return (
    <ApplicationProvider
      {...eva}
      theme={{ ...eva.light }}
     
    >
      <NavigationContainer>
        <AppRouter />
      </NavigationContainer>
    </ApplicationProvider>
  );
};

export default App;
