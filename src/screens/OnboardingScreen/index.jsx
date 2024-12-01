import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: '1',
    title: 'Welcome to Our App!',
    text: 'We are excited to show you the app features.',
    backgroundColor: '#fff',
  },
  {
    key: '2',
    title: 'Register your Name',
    text: 'Enter your first name to get started.',
    image: require('../../assets/slide1.png'),
    backgroundColor: '#fff',
  },
  {
    key: '3',
    title: 'Enter Your Email',
    text: 'Provide your email address to complete registration.',
    image: require('../../assets/slide2.png'),
    backgroundColor: '#fff',
  },
  {
    key: '4',
    title: 'Manage Tasks Easily',
    text: 'Add, edit, and organize your tasks seamlessly.',
    image: require('../../assets/slide3.png'),
    backgroundColor: '#fff',
  },
  {
    key: '5',
    title: 'Add a New Task',
    text: 'Enter a task title and press "Add Task" to create a new task.',
    image: require('../../assets/slide4.png'),
    backgroundColor: '#fff',
  },
  {
    key: '7',
    title: 'Set Task Reminders',
    text: 'Never forget a task by setting reminders.',
    image: require('../../assets/slide6.png'),
    backgroundColor: '#fff',
  },
  {
    key: '8',
    title: 'Turn On Reminders',
    text: 'Press on "Set Reminder" to start receiving notifications.',
    image: require('../../assets/slide8.png'),
    backgroundColor: '#fff',
  },
  {
    key: '10',
    title: 'Popup Reminder Notification',
    text: 'Get a reminder popup when it\'s time to complete your task.',
    image: require('../../assets/slide9.png'),
    backgroundColor: '#fff',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      {item.image && <Image source={item.image} style={styles.image} />}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const onDone = () => {
    navigation.navigate('Login');
  };

  const renderDoneButton = () => (
    <TouchableOpacity style={styles.doneButton} onPress={onDone}>
      <Text style={styles.doneText}>Next</Text>
    </TouchableOpacity>
  );

  const renderSkipButton = () => (
    <TouchableOpacity style={styles.skipButton} onPress={onDone}>
      <Text style={styles.skipText}>Skip</Text>
    </TouchableOpacity>
  );

  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDone}
      showSkipButton
      onSkip={onDone}
      dotStyle={styles.dotStyle}
      activeDotStyle={styles.activeDotStyle}
      skipLabel="Skip"
      doneLabel="Get Started"
      renderDoneButton={renderDoneButton}
      renderSkipButton={renderSkipButton}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  image: {
    width: 280,
    height: 280,
    marginBottom: 20,
    borderRadius: 10, // Add border radius for rounded corners
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333', // Adjusted color for better visibility
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  dotStyle: {
    backgroundColor: '#bbb',
  },
  activeDotStyle: {
    backgroundColor: '#000',
  },

  doneButton: {
    marginTop: 10,
    backgroundColor: '#2E93D1', // Button color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  doneText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ddd', // Background color for skip button
    borderRadius: 5,
  },
  skipText: {
    fontSize: 16,
    color: '#000',
  },
});

export default OnboardingScreen;
