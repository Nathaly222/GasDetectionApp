import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { authenticateUser } from '../service/api';

const LoginScreen: React.FC = () => {
 
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    try {
      const { token } = await authenticateUser(email, password); 
      setToken(token); 
      setError('');
    } catch (error: any) {
      setError(error.message);
    }
  };
  
  


  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      {error && <Text>{error}</Text>}
      {token && <Text>Token: {token}</Text>}
    </View>
  );
};

export default LoginScreen;
