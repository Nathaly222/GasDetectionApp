import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const BASE_URL = process.env.API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Función para registrar a un usuario
export const registerUser = async (username: string, email: string, password: string, phone: string): Promise<void> => {
  try {
    const response = await api.post('/auth/register', { username, email, password, phone });
    console.log(response.data);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Error desconocido al registrar');
    }
  } catch (error: any) {
    console.error(error); 
    throw new Error(error.response?.data?.message || 'Error al registrar');
  }
};

// Función para autenticar al usuario
export const authenticateUser = async (email: string, password: string): Promise<{ token: string; user: any }> => {
  try {
    const response = await api.post('/auth/login', { email: email.trim(), password });
    const { token, user } = response.data.data;

    // Guardar token en AsyncStorage
    await AsyncStorage.setItem('token', token);

    return { token, user };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al autenticar');
  }
};


// Función para obtener datos del usuario autenticado
export const getUserData = async (): Promise<any> => {
  try {
    const response = await api.get('/users/profile');
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener datos del usuario');
  }
};

// Función para actualizar los datos del usuario
export const updateUser = async (userData: any): Promise<void> => {
  try {
    const response = await api.put('/users/update', userData);
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Error desconocido al actualizar');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar datos del usuario');
  }
};


export const deleteUser = async (): Promise<void> => {
  try {
    const response = await api.delete('/users/delete');
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Error desconocido al eliminar usuario');
    }
    // Limpia el token tras eliminar la cuenta
    localStorage.removeItem('token');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
  }
};

// Función para obtener eventos relacionados con gas detectado (si es necesario)
export const getEvents = async (): Promise<any[]> => {
  try {
    const response = await api.get('/api/users/events');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener eventos');
  }
};
