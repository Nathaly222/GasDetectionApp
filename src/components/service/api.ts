import axios from 'axios';

const BASE_URL = process.env.API_URL || 'http://localhost:8081';
 // Cambia esta URL a la de tu backend

// Configurar una instancia de Axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Tiempo máximo de espera (opcional)
  headers: {
    'Content-Type': 'application/json',
  },
});

const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.Authorization;
  }
};

// Función para autenticar al usuario (Login)
export const authenticateUser = async (email: string, password: string): Promise<{ token: string }> => {
  const response = await api.post('/login', { email, password });
  const token = response.data.token;
  setAuthToken(token);
  return response.data;
};


// Función para registrar a un usuario (Registro)
export const registerUser = async (email: string, password: string): Promise<void> => {
  try {
    await api.post('/register', { email, password });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar');
  }
};

// Función para obtener datos del usuario autenticado
export const getUserData = async (token: string): Promise<any> => {
  try {
    const response = await api.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token en el header
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener datos del usuario');
  }
};

// Función para enviar datos al backend (por ejemplo, configuración de preferencias)
export const updatePreferences = async (token: string, preferences: any): Promise<void> => {
  try {
    await api.put('/preferences', preferences, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar preferencias');
  }
};

// Función para obtener eventos relacionados con gas detectado
export const getEvents = async (token: string): Promise<any[]> => {
  try {
    const response = await api.get('/events', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener eventos');
  }
};
