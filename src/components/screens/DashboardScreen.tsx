import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getGasValue, getFanState, getValveState, triggerGasValve } from '../service/api';

const { height } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [gasValue, setGasValue] = useState<number>(0);
  const [fanOn, setFanOn] = useState(false);
  const [fanTime, setFanTime] = useState(0);
  const [valveOpen, setValveOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchFanState = async () => {
      try {
        const fanState = await getFanState();
        if (fanState?.status === 'success') {
          setFanOn(fanState.data.fan_state);
          setFanTime(fanState.data.fan_time ?? 0);
        } else {
          throw new Error('No se pudo obtener el estado del ventilador');
        }
      } catch (error) {
        console.error('Error al obtener el estado del ventilador:', error);
        setFanOn(false);
        setFanTime(0);
      }
    };

    fetchFanState();
  }, []);

  useEffect(() => {
    const fetchGasData = async () => {
      try {
        const data = await getGasValue();
        if (data?.status === 'success' && data?.data?.gas_concentration !== undefined) {
          const gasValue = data.data.gas_concentration;
          setGasValue(gasValue);
          setProgress(gasValue);
        } else {
          throw new Error('Gas value not found in response');
        }
      } catch (error) {
        console.error('Error al obtener el valor del gas:', error);
        setGasValue(0);
        setProgress(0);
      }
    };

    fetchGasData();
  }, []);


  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const toggleGasValve = async (state: string) => {
    try {
      // 'open' -> false (abrir válvula) y 'close' -> true (cerrar válvula)
      const valveState: boolean = state === 'open' ? false : true;
      await triggerGasValve(valveState);
  
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      const [gasResponse, valveStateResponse] = await Promise.all([
        getGasValue(),
        getValveState(),
      ]);
      setGasValue(gasResponse?.data?.gas_concentration ?? 0);
      setProgress(gasResponse?.data?.gas_concentration ?? 0);
      setValveOpen(valveStateResponse?.data?.valve_state ?? null);
    } catch (error) {
      console.error(`Error al cambiar el estado de la válvula de gas (${state}):`, error);
    }
  };
  
  useEffect(() => {
    const fetchValveState = async () => {
      try {
        const valveStateResponse = await getValveState();
        setValveOpen(valveStateResponse?.data?.valve_state ?? null);
      } catch (error) {
        console.error('Error al obtener el estado de la válvula:', error);
        setValveOpen(null);
      }
    };
    fetchValveState();
  }, []);

  return (
    <Layout style={styles.container}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={200}
            width={25}
            fill={progress ?? 0} 
            tintColor="#D9631E"
            backgroundColor="#E0E0E0"
            lineCap="round"
            rotation={0}
          >
            {() => (
              <Text style={styles.percentageText}>
                {Math.round(gasValue)} %
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
          </View>
        </View>
      </View>

      <View style={styles.gasControlContainer}>
        <View style={styles.gasControlCard}>
          <Text style={styles.gasControlTitle}>Control de Válvula de Gas</Text>
          <Text style={styles.valveStatus}>
            Estado: {valveOpen === null ? 'Desconocido' : valveOpen ? 'Abierta' : 'Cerrada'}
          </Text>
          <View style={styles.gasControlActions}>
            <Button
              style={styles.gasControlButton}
              onPress={() => toggleGasValve('open')}
              status="success"
              disabled={valveOpen === true} 
            >
              Abrir Válvula
            </Button>
            <Button
              style={styles.gasControlButton}
              onPress={() => toggleGasValve('close')}
              status="danger"
              disabled={valveOpen === false}
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
    marginTop: height * 0.1,
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
    elevation: 3,
  },
  gasControlTitle: {
    backgroundColor: '#D79B3C',
    color: '#FFFFFF',
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
  valveStatus: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  }
});

export default DashboardScreen;
