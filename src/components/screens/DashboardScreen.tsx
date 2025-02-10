import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Switch } from 'react-native';
import { Layout, Button} from '@ui-kitten/components';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useProgress } from '../helpers/progress.hook';
import { getGasValue, setFanState, getFanState, triggerGasValve } from '../service/api';

const { height } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const [progress, setProgress ] = useState(0);
  const [ gasValue, setGasValue ] = useState<number>(0);
  const [fanState, setFanStateValue] = useState<boolean>(false);
  const [fanOn, setFanOn] = useState(false);
  const [fanTime, setFanTime] = useState(0); 

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (fanOn) {
      interval = setInterval(() => {
        setFanTime((prevTime) => prevTime + 1);
      }, 1000); 
    } else {
      setFanTime(0); 
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fanOn]);


  useEffect(() => {
    const fetchGasData = async () => {
      try {
        const gasResponse = await getGasValue();
        setGasValue(gasResponse.data.gas_concentration);
        setProgress(gasResponse.data.gas_concentration);
      } catch (error) {
        console.error('Error al obtener el valor del gas:', error);
      }
    };

    fetchGasData(); 
  }, []);

  useEffect(() => {
    const fetchFanState = async () => {
      try {
        const ledResponse = await getFanState();
        setFanStateValue(ledResponse.led_state);
      } catch (error) {
        console.error('Error al obtener el estado del ventilador:', error);
      }
    };

    fetchFanState();
  }, []);

  const toggleFan = () => {
    setFanOn((prevState) => !prevState);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const toggleGasValve = async (state: string) => {
    try {
      await triggerGasValve(state);
      const gasResponse = await getGasValue();
      setGasValue(gasResponse.data.gas_concentration);
      setProgress(gasResponse.data.gas_concentration); 
    } catch (error) {
      console.error(`Error al cambiar el estado de la válvula de gas (${state}):`, error);
    }
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={200}
            width={25}
            fill={progress} 
            tintColor="#D9631E"
            backgroundColor="#E0E0E0"
            lineCap="round"
            rotation={0}
          >
            {() => (
              <Text style={styles.percentageText}>
                {Math.round(gasValue)} ppm
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>

      <View style={styles.fanInfoContainer}>
        <View style={styles.fanStatusCard}>
          <View style={styles.fanStatusHeader}>
            <Text style={styles.fanStatusTitle}>
              {fanOn ? 'Ventilador Encendido' : 'Ventilador Apagado'}
            </Text>
          </View>
          <View style={styles.fanStatusContent}>
            <Text style={styles.timerText}>
              {fanOn ? `Tiempo: ${formatTime(fanTime)}` : 'Sin tiempo activo'}
            </Text>
            <View style={styles.controlContainer}>
              <Text style={styles.controlText}>
                {fanOn ? 'Apagar Ventilador' : 'Encender Ventilador'}
              </Text>
              <Switch
                trackColor={{ false: '#D79B3C', true: '#D79B3C' }}
                thumbColor={fanOn ? '#BA2121' : '#FFFFFF'}
                onValueChange={toggleFan}
                value={fanOn}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.gasControlContainer}>
        <View style={styles.gasControlCard}>
          <Text style={styles.gasControlTitle}>Control de Válvula de Gas</Text>
          <View style={styles.gasControlActions}>
            <Button
              style={styles.gasControlButton}
              onPress={() => toggleGasValve('open')}
              status="success"
            >
              Abrir Válvula
            </Button>
            <Button
              style={styles.gasControlButton}
              onPress={() => toggleGasValve('close')}
              status="danger"
            >
              Cerrar Válvula
            </Button>
          </View>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:  height * 0.1,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#73121A',
  },
  fanInfoContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    top: height * 0.48,
    width: '100%',
  },
  fanStatusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fanStatusHeader: {
    backgroundColor: '#D79B3C',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  fanStatusTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  fanStatusContent: {
    padding: 15,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 16,
    color: '#D79B3C',
    fontWeight: '500',
  },
  gasControlContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    top: height * 0.65,
    width: '100%',
  },
  gasControlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gasControlTitle: {
    backgroundColor: '#D79B3C',
    color: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  gasControlActions: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gasControlButton: {
    width: '40%',
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
});


export default DashboardScreen;
