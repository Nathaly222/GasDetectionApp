import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Button, Text, Card } from '@ui-kitten/components';

const HelpSupport = () => {
  const callSupport = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const sendSupportEmail = () => {
    Linking.openURL('mailto:caballeronathaly31@gmail.com');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text category="h5" style={styles.title}>Ayuda y Soporte Técnico</Text>
        
        <Text style={styles.description}>
          Este sistema de detección de fugas de gas utiliza el ESP32, sensores de gas MQ-2, un ventilador eléctrico y un mecanismo de cierre automático de válvula para protegerte de posibles fugas de gas.
        </Text>

        <Text style={styles.subtitle}>Problemas Comunes:</Text>
        <Text style={styles.text}>- No se detectan fugas de gas</Text>
        <Text style={styles.text}>- El ventilador no se enciende</Text>
        <Text style={styles.text}>- El sistema no envía notificaciones</Text>

        <Text style={styles.subtitle}>¿Necesitas ayuda?</Text>
        <Button onPress={() => callSupport('0981117091')} style={styles.button}>
          Llamar a Soporte
        </Button>
        <Button onPress={() => callSupport('0939731833')} style={styles.button}>
          Llamar a Soporte Alternativo
        </Button>
        <Button onPress={() => {}} style={styles.button}>
          Ver Preguntas Frecuentes
        </Button>
        <Button onPress={sendSupportEmail} style={styles.button}>
          Enviar Correo de Soporte
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  card: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  text: {
    marginBottom: 5,
    fontSize: 14,
  },
  button: {
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#D79B3C',  // Color actualizado
  },
});

export default HelpSupport;
