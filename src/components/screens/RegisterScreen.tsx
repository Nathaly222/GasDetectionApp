import React, { useState } from 'react';
import { Layout, Input, Button, Text, Spinner } from '@ui-kitten/components';
import { StyleSheet, Alert, Image, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Usar AsyncStorage para almacenar el token
import { registerUser } from '../service/api'; // Asegúrate de importar las funciones de la API correctamente

interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;
}

interface AuthProps {
  navigation: any;
}

const Auth: React.FC<AuthProps> = ({ navigation }) => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      console.log(formData);
      await registerUser(formData.username, formData.email, formData.password, formData.phone);
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.navigate('LoginScreen'); // Redirigir a la pantalla de login tras el registro
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message || 'Error al registrar usuario');
      } else {
        Alert.alert('Error', 'Error desconocido al registrar');
      }
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (name: keyof RegisterData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/fuego.png')} style={styles.image} />
      </View>

      <Text category="h1" style={styles.header}>Registrar</Text>

      <Input
        style={styles.input}
        label="Nombre de usuario"
        value={formData.username}
        onChangeText={handleChange('username')}
        placeholder="Ingrese su nombre de usuario"
      />

      <Input
        style={styles.input}
        label="Correo Electrónico"
        value={formData.email}
        onChangeText={handleChange('email')}
        keyboardType="email-address"
        placeholder="ejemplo@correo.com"
      />

      <Input
        style={styles.input}
        label="Teléfono"
        value={formData.phone}
        onChangeText={handleChange('phone')}
        keyboardType="phone-pad"
        placeholder="Ingrese su teléfono"
      />

      <Input
        style={styles.input}
        label="Contraseña"
        value={formData.password}
        onChangeText={handleChange('password')}
        secureTextEntry
        placeholder="Ingrese su contraseña"
      />

      <Button
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
        accessoryLeft={loading ? (props) => <Spinner size='small'/> : undefined}
      >
        {loading ? 'Registrando...' : 'Registrar'}
      </Button>

      <View style={styles.loginContainer}>
        <Text category="s1" style={styles.loginText}>
          ¿Ya tienes una cuenta?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            Iniciar sesión
          </Text>
        </Text>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  label: {
    color: '#BA2121',
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#D79B3C',
    borderRadius: 10,
    padding: 10,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    textAlign: 'center',
  },
  loginLink: {
    color: '#D79B3C',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Auth;
