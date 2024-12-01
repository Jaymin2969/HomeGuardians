import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Animated, 
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import api from '../../services/api';
import styles from './style';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Animation for logo and input fields
  const fadeAnim = new Animated.Value(0);  // Initial opacity of 0
  const scaleAnim = new Animated.Value(0.8);  // Initial scale for the logo

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/users/login', { email, password });
      console.log('API Response:', response.data);

      if (response.data && response.data.token) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.data));  // Store as a string

        Alert.alert('Success', 'Login successful!');
        navigation.navigate('TaskManagement');
      } else {
        Alert.alert('Error', response.data.message || 'User ID not received from the server.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger fade-in and scale animation for logo
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={['#007BFF', '#00C6FF']}
          style={styles.gradientBackground}
        >
          <View style={styles.mainWrapper}>
            <Animated.View
              style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
            >
              <Text style={styles.logo}>Home Guardian</Text>
            </Animated.View>

            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subtitle}>Log in to manage your tasks</Text>

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              placeholderTextColor="#aaa"
            />

            {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.registerText}>Register Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
