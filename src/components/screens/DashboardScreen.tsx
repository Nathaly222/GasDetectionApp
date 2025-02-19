import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { getGasValue, getFanState, getValveState, triggerGasValve, triggerFan } from '../service/api';

const { height } = Dimensions.get('window');

const COLORS = {
  primary: '#D79B3C',
  secondary: '#73121A',
  primaryLight: '#F7F7F7',
  secondaryLight: '#8F1622',
  background: '#F7F7F7', 
  cardBg: '#FFFFFF',
  text: '#2C1810',
};

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

  const handleOpenValve = async () => {
    try {
      await triggerFan(false);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [gasResponse, valveStateResponse] = await Promise.all([
        getGasValue(),
        getValveState(),
      ]);
      setGasValue(gasResponse?.data?.gas_concentration ?? 0);
      setProgress(gasResponse?.data?.gas_concentration ?? 0);
      setValveOpen(valveStateResponse?.data?.valve_state ?? null);
    } catch (error) {
      console.error('Error al abrir la válvula de gas:', error);
    }
  };

  const handleCloseValve = async () => {
    try {
      await triggerGasValve(false);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const [gasResponse, valveStateResponse] = await Promise.all([
        getGasValue(),
        getValveState(),
      ]);
      setGasValue(gasResponse?.data?.gas_concentration ?? 0);
      setProgress(gasResponse?.data?.gas_concentration ?? 0);
      setValveOpen(valveStateResponse?.data?.valve_state ?? null);
    } catch (error) {
      console.error('Error al cerrar la válvula de gas:', error);
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
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>GASGUARD</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            size={180} 
            width={20} 
            fill={progress ?? 0}
            tintColor={COLORS.secondary}
            backgroundColor={COLORS.primaryLight}
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
            <Text style={styles.fanStatusTitle}>Tiempo del Ventilador</Text>
          </View>
          <View style={styles.fanStatusContent}>
            <Text style={styles.timerText}>{formatTime(fanTime)}</Text>
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
              onPress={handleOpenValve}
              status="primary"
              disabled={valveOpen === true}
            >
              Abrir Válvula
            </Button>
            <Button
              style={styles.gasControlButton}
              onPress={handleCloseValve}
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
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingBottom: 40, // Aumenta el padding inferior para darle más altura
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
    borderBottomLeftRadius: 50,  // Redondea la parte inferior izquierda
    borderBottomRightRadius: 50, // Y la parte inferior derecha
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.cardBg,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.1,
    backgroundColor: COLORS.cardBg,
    padding: 15, // Espacio reducido
    borderRadius: 15, // Bordes más suaves
    marginHorizontal: 20,
    elevation: 3, // Sombra más sutil
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  percentageText: {
    fontSize: 28, // Un poco más pequeño
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  fanInfoContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    top: height * 0.48,
    width: '100%',
  },
  fanStatusCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12, // Bordes más suaves
    elevation: 2, // Sombra más sutil
    borderWidth: 0.5, // Borde más fino
    borderColor: COLORS.primaryLight,
  },
  fanStatusHeader: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
  },
  fanStatusTitle: {
    color: COLORS.cardBg,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  fanStatusContent: {
    padding: 20,
  },
  timerText: {
    fontSize: 18, // Un poco más pequeño
    fontWeight: '500',
    color: COLORS.secondary,
    textAlign: 'center',
  },
  gasControlContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    top: height * 0.65,
    width: '100%',
  },
  gasControlCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    elevation: 2, // Sombra más sutil
    borderWidth: 0.5, // Borde más fino
    borderColor: COLORS.primaryLight,
    overflow: 'hidden',
  },
  gasControlTitle: {
    backgroundColor: COLORS.primary,
    color: COLORS.cardBg,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.secondary,
  },
  gasControlActions: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  gasControlButton: {
    width: '45%',
    borderRadius: 10,
  },
  valveStatus: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.secondary,
    textAlign: 'center',
    marginVertical: 15,
  },
});

export default DashboardScreen;
