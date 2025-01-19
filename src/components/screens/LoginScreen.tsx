import React, { useState } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Layout, Text, Input, Button, Spinner } from '@ui-kitten/components';
import { authenticateUser } from '../service/api';
import { useNavigation } from '@react-navigation/native';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);
    try {

      await authenticateUser(email, password);
      setError('');
      navigation.navigate('DashboardScreen' as never); 
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión.');
    }
    setLoading(false); 
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/fuego.png')} style={styles.image} />
      </View>

      <Text category="h1" style={styles.header}>
        Iniciar Sesión
      </Text>

      <Input
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button 
        style={styles.button}
        onPress={handleLogin} 
        disabled={loading}
        accessoryLeft={loading ? (props) => <Spinner size='small'/> : undefined}
      >{loading ? 'Iniciando...' : 'Iniciar'}
      </Button>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#D79B3C', 
    borderRadius: 10,           
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;
