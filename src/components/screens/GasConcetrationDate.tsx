import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getGasData } from '../service/api'; // Asegúrate de importar tu función de API
import * as ScreenOrientation from 'expo-screen-orientation'; // Importar para controlar la orientación

const { width, height } = Dimensions.get('window');

const GasConcentrationChart = () => {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartWidth, setChartWidth] = useState<number>(width - 40); // Ancho inicial del gráfico

  // Filtrar los datos de esta semana (de lunes a domingo)
  const filterDataForThisWeek = (gasData: any[]) => {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)); // Lunes de la semana
    const endOfWeek = new Date(startOfWeek); 
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo de la semana

    // Crear un arreglo con los días de la semana
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    }

    // Mapear los datos y combinarlos con los días de la semana
    const filteredData = weekDates.map((date: string) => {
      const item = gasData.find((item: any) => item.date.startsWith(date)); // Buscar datos para el día
      return item ? parseFloat(item.avg_concentration) : null; // Si no hay datos, será null
    });

    return { weekDates, filteredData };
  };

  // Fetch data from API
  useEffect(() => {
    // Desbloquear la orientación de la pantalla
    ScreenOrientation.unlockAsync(); // Permite que la pantalla se rote libremente

    const fetchData = async () => {
      try {
        const gasData = await getGasData();
        console.log('Gas Data:', gasData); // Verifica qué contiene gasData
        if (gasData && Array.isArray(gasData.data) && gasData.data.length > 0) {
          const { weekDates, filteredData } = filterDataForThisWeek(gasData.data);
          setLabels(weekDates);

          // Filtrar los valores nulos antes de asignarlos a los datos del gráfico
          const filteredDataWithoutNulls = filteredData.filter((value) => value !== null) as number[];
          setData(filteredDataWithoutNulls); // Solo números, sin null
        } else {
          console.error('Gas data is empty or in an unexpected format', gasData);
        }
      } catch (error) {
        console.error('Error fetching gas data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Liberar la orientación cuando se desmonte el componente
    return () => {
      ScreenOrientation.unlockAsync(); // Mantiene la posibilidad de rotar la pantalla
    };
  }, []);

  // Actualizar el tamaño del gráfico cuando cambie la orientación
  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get('window');
      setChartWidth(width - 40); // Ajusta el ancho del gráfico
    };

    // Suscribirse a cambios de dimensiones
    const subscription = Dimensions.addEventListener('change', handleOrientationChange);

    // Limpiar el evento cuando se desmonte el componente (react-native 0.65+ no necesita removeEventListener)
    return () => {
      subscription.remove(); // Eliminar el evento manualmente
    };
  }, []);

  // Si los datos se están cargando
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#D9631E" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.chartContainer}>
      <Text style={styles.title}>Concentración de Gas por Día</Text>
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data,
              color: (opacity = 1) => `rgba(217, 99, 30, ${opacity})`,
              strokeWidth: 3,
            },
          ],
        }}
        width={chartWidth} // Usar el ancho dinámico
        height={250}
        yAxisLabel="ppm"
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: '#f5f5f5',
          backgroundGradientTo: '#f5f5f5',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: '5', strokeWidth: '2', stroke: '#D9631E' },
        }}
        bezier
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default GasConcentrationChart;
