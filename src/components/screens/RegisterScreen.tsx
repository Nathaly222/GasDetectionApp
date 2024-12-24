import React, { useState } from 'react';
import { Layout, Input, Button, Text, Spinner } from '@ui-kitten/components';
import { StyleSheet, Alert, Image, View } from 'react-native';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: string;
}

interface AuthProps {
  navigation: any; // Puedes mejorar este tipo si usas un tipo de navegación específico
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
      
      const response = await fetch('YOUR_API_URL/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Éxito', 'Usuario registrado correctamente');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', data.message || 'Error al registrar usuario');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión');
      console.error(error);
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
        <Image 
          source={require('../assets/fuego.png')} 
          style={styles.image} 
        />
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
            onPress={() => navigation.navigate('Login')}
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
    color: '#BA2121', // Color personalizado para el label
    fontWeight: 'bold', // Opcional, para destacar el texto
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
    marginBottom: 20, // Espaciado para la imagen
  },
  image: {
    width: 100, // Ancho de la imagen
    height: 100, // Alto de la imagen
    resizeMode: 'contain', // Ajusta la imagen a la caja sin deformarla
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    textAlign: 'center',
  },
  loginLink: {
    color: '#D79B3C', // Color para el enlace
    fontWeight: 'bold',
    textDecorationLine: 'underline', // Subraya el texto
  },
});

export default Auth;
