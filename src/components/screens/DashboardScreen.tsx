import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Layout, Button, Icon } from '@ui-kitten/components';
import Svg, { Circle } from 'react-native-svg';

const DashboardScreen: React.FC = () => {
  const HomeIcon = () => (
    <Text style={styles.iconText}>🏠</Text>
  );

  const ChatIcon = () => (
    <Text style={styles.iconText}>💬</Text>
  );

  const SettingsIcon = () => (
    <Text style={styles.iconText}>⚙️</Text>
  );

  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Button style={styles.nowButton} size="small">
          Now
        </Button>
        <Button style={styles.arrowButton} size="small">
          ⇩
        </Button>
      </View>
      
      <View style={styles.circleContainer}>
        <Svg height="200" width="200">
          <Circle cx="100" cy="100" r="80" stroke="#F4A261" strokeWidth="20" fill="none" />
          <Circle cx="100" cy="100" r="60" stroke="#FFF" strokeWidth="20" fill="none" />
        </Svg>
        <Text style={styles.percentageText}>0.02% G</Text>
      </View>

      <View style={styles.bottomNav}>
        <Button 
          style={styles.navButton} 
          appearance="ghost"
          accessoryLeft={HomeIcon}
        />
        <Button 
          style={styles.navButton} 
          appearance="ghost"
          accessoryLeft={ChatIcon}
        />
        <Button 
          style={styles.navButton} 
          appearance="ghost"
          accessoryLeft={SettingsIcon}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9C46A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  nowButton: {
    backgroundColor: '#F4A261',
    borderColor: 'transparent',
    borderRadius: 10,
  },
  arrowButton: {
    backgroundColor: '#F4A261',
    borderColor: 'transparent',
    borderRadius: 10,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  percentageText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F4A261',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  iconText: {
    fontSize: 24,
  },
});

export default DashboardScreen;