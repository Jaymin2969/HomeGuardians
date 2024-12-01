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
import styles from '../LoginScreen/style';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const RegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Animation for logo and input fields
  const fadeAnim = new Animated.Value(0);  // Initial opacity of 0
  const scaleAnim = new Animated.Value(0.8);  // Initial scale for the logo
  const buttonScaleAnim = new Animated.Value(1);  // Button scale animation

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/users/register', { name, email, password });
      console.log("API Response:", response.data);

      // Ensure the response has the required data
      if (response.data && response.data.token && response.data.user._id) {
        // Create a user object to store in AsyncStorage
        const user = {
          name,
          email,
          token: response.data.token,
          userId: response.data.user._id,
        };

        // Store the user object in AsyncStorage
        await AsyncStorage.setItem('userData', JSON.stringify(user));

        Alert.alert('Success', `Welcome, ${name}!`);
        navigation.navigate('TaskManagement', { userId: response.data._id });
      } else {
        Alert.alert('Error', 'User ID or token not received from the server.');
      }
    } catch (error) {
      console.error("API Error:", error.message);
      if(error.message) return Alert.alert('Error', error.message);
      Alert.alert('Error', 'Failed to register user.');
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

  const handleButtonPressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={['#007BFF', '#00C6FF']}
          style={styles.gradientBackground}
        >
          <View style={styles.mainWrapper}>
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.logo}>Home Guardian</Text>
            </Animated.View>

            <Text style={styles.title}>Register Now</Text>
            <Text style={styles.subtitle}>Create an account to manage your tasks</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor="#aaa"
            />

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
              <Animated.View
                style={{ transform: [{ scale: buttonScaleAnim }] }}
              >
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleRegister}
                  onPressIn={handleButtonPressIn}
                  onPressOut={handleButtonPressOut}
                >
                  <Text style={styles.loginButtonText}>Register</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerText}>Login Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;
