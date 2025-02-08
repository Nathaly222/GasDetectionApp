import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const  BASE_URL = 'http://192.168.100.61:3000';  

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


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await AsyncStorage.getItem('refreshToken');
          if (refreshToken) {
            const { accessToken } = await refreshAccessToken(refreshToken);
            await AsyncStorage.setItem('token', accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Error al refrescar el token:', refreshError);
          await AsyncStorage.clear(); 
        }
      }
    }

    return Promise.reject(error);
  },
);


const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al refrescar el token');
  }
};


export const registerUser = async (username: string, email: string, password: string, phone: string): Promise<void> => {
  try {
    const response = await api.post('/auth/register', { username, email, password, phone });
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Error desconocido al registrar');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al registrar');
  }
};


export const authenticateUser = async (email: string, password: string): Promise<{ user: any }> => {
  try {
    const response = await api.post('/auth/login', { email: email.trim(), password });
    const { accessToken, refreshToken, user } = response.data.data;

   
    await AsyncStorage.setItem('token', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    return { user };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al autenticar');
  }
};


export const getUserData = async (): Promise<any> => {
  try {
    const token = await AsyncStorage.getItem("token"); 
    if (!token) throw new Error("No hay token disponible");

    const response = await api.get("/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data; // `data` dentro de `data`
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener datos del usuario");
  }
};


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
    await AsyncStorage.clear(); 
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
  }
};

export const getGasValue = async (): Promise<any> => {
  try {
    const response = await api.get('/events/gas-value');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el valor de gas');
  }
};

export const getValveState = async (): Promise<any> => {
  try {
    const response = await api.get('/events/valve-state');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el estado de la válvula');
  }
};

export const getFanState = async (): Promise<any> => {
  try {
    const response = await api.get('/events/fan-state');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener el estado del ventilador');
  }
};


export const setFanState = async (state: string): Promise<any> => {
  try {
    const response = await api.post(`/events/fan-state/${state}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al activar/desactivar el ventilador');
  }
}; 

export const triggerGasValve = async (state: string): Promise<any> => {
  try {
    const response = await api.get(`/events/valve-state/${state}`);
    return response.data;
  } catch (error: any) {
    throw new Error (error.response?.data?.message || 'Error al activar/desactivar la válvula de gas');
  }
}
 
export const getNotificationDanger = async (): Promise<any> => {
  try {
    const response = await api.get('/events/notification-danger');
    return response.data; 
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener las notificaciones de peligro');
  }
};
