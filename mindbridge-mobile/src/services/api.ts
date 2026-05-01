import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // For Android Emulator use: http://10.0.2.2:5000/api
  // For iOS Simulator or Web use: http://localhost:5000/api
  // For Physical Device, use your computer's local IP (e.g., http://192.168.1.X:5000/api)
  baseURL: 'http://localhost:5000/api', 
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
