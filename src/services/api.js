import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.29.175:8080/api'; // Replace with your backend server URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in request headers
api.interceptors.request.use(
  async (config) => {
    const userData = await AsyncStorage.getItem('userData');  // Get full user data
    if (userData) {
      const parsedData = JSON.parse(userData);  // Parse the data back
      const token = parsedData.token;  // Extract the token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;  // Attach the token to request header
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration or unauthorized access
api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access - token may have expired.');
      // Clear user data and navigate to login screen if necessary
      await AsyncStorage.removeItem('userData');  // Clear the stored user data
      // You can trigger navigation to the login screen if you're using React Navigation
      // For example: navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);

export default api;
