import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Layout, Button, Icon, BottomNavigation, BottomNavigationTab, IconProps } from '@ui-kitten/components';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useProgress } from '../helpers/progress.hook';

const { height } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const progress = useProgress();

  const HomeIcon = (props: IconProps) => <Icon {...props} name="home-outline" />;
  const BellIcon = (props: IconProps) => <Icon {...props} name="bell-outline" />;
  const SettingsIcon = (props: IconProps) => <Icon {...props} name="settings-outline" />;

  return (
    <Layout style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <Button style={styles.nowButton} size="small">
            Now
          </Button>
          <Button style={styles.arrowButton} size="small">
            ⇩
          </Button>
        </View>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={200}
            width={20}
            fill={progress}
            tintColor="#BA2121"
            backgroundColor="#E0E0E0"
            lineCap="round"
          >
            {() => (
              <Text style={styles.percentageText}>
                {Math.round(progress)}%
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
      <View style={styles.bottomNavContainer}>
        <BottomNavigation
          style={styles.bottomNav}
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <BottomNavigationTab icon={HomeIcon} title="HOME" />
          <BottomNavigationTab icon={BellIcon} title="ORDERS" />
          <BottomNavigationTab icon={SettingsIcon} title="SETTINGS" />
        </BottomNavigation>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5, 
    backgroundColor: '#D79B3C',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  nowButton: {
    backgroundColor: '#BA2121',
    borderColor: 'transparent',
    borderRadius: 10,
  },
  arrowButton: {
    backgroundColor: '#BA2121',
    borderColor: 'transparent',
    borderRadius: 10,
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNav: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default DashboardScreen;