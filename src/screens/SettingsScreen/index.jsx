import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Fetch the user's current name and email from AsyncStorage
    const fetchUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const user = JSON.parse(storedData);
          setName(user.name);
          setEmail(user.email); // Assuming email is stored as part of userData
        }
      } catch (error) {
        console.error("Error fetching user's data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("token");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.containerWrapper}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* Back button with Text */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{name}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{email}</Text>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#f4f6f9', // Light background color
  },
  containerWrapper: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 30,
    color: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  infoContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoText: {
    fontSize: 18,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF4B5C',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SettingsScreen;
