import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  StyleSheet,
  Animated,
} from "react-native";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import LinearGradient from "react-native-linear-gradient"; // Import for gradient
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskManagementScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null); // Store user data object
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [reminderDate, setReminderDate] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Fade-in animation

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData)); // Parse the stored user data
        fetchTasks(JSON.parse(storedUserData).userId); // Fetch tasks using userId
      } else {
        Alert.alert("Error", "User data not found.");
      }
    };

    fetchUserData();
  }, []);

  const fetchTasks = async (userId) => {
    try {
      console.log('userIduserIduserId',userId)
      const response = await api.get(`/users/${userId}`);
      setTasks(response.data.tasks);
      // Fade in tasks after fetching
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch tasks");
    }
  };

  const addCustomTask = async () => {
    // Task name validation
    if (newTaskName.trim() === "") {
      Alert.alert("Validation Error", "Task name cannot be empty");
      return;
    }

    // Reminder date validation
    if (!reminderDate || reminderDate < new Date()) {
      Alert.alert(
        "Validation Error",
        "Please set a valid reminder date (it should not be in the past)"
      );
      return;
    }

    const newTask = {
      name: newTaskName,
      isPredefined: false,
      reminderTime: reminderDate,
      userId: userData.userId, // Use userId from the userData object
    };

    try {
      const response = await api.post("/tasks", newTask);
      setTasks([...tasks, response.data]);
      setNewTaskName("");
      setReminderDate(new Date());
      setIsModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add task.");
    }
  };

  const toggleReminder = async (taskId) => {
    try {
      const updatedTask = tasks.find((task) => task._id === taskId);
      const isReminderSet = !updatedTask.isReminderSet;
      const updatedTaskData = await api.put(`/tasks/${taskId}`, {
        isReminderSet,
        reminderTime: isReminderSet ? new Date() : null,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? updatedTaskData.data : task
        )
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update reminder.");
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskWrapper}>
      <View style={styles.taskItem}>
        <Text style={styles.taskName}>{item.name}</Text>

        <TouchableOpacity
          style={[
            styles.reminderButton,
            item.isReminderSet ? styles.reminderSet : styles.reminderUnset,
          ]}
          onPress={() => toggleReminder(item._id)}
        >
          <Text style={styles.reminderText}>
            {item.isReminderSet ? "Reminder On" : "Set Reminder"}
          </Text>
        </TouchableOpacity>
      </View>

      {item.isReminderSet && item.reminderTime && (
        <Text style={styles.reminderTime}>
          Reminder set for:{" "}
          {moment(item.reminderTime).format("MMMM Do YYYY, h:mm:ss a")}
        </Text>
      )}
    </View>
  );

  // Setting
  const Setting =  () => {
   navigation.navigate('Setting')
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#007BFF", "#00C6FF"]} // Gradient color codes
        style={styles.gradientBackground}
      >
        <View style={styles.mainWrapper}>
          <Text style={styles.title}>Task Management</Text>

          <Animated.FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.taskList}
            style={{ opacity: fadeAnim }} // Apply fade animation here
          />

          <View style={styles.addTaskContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter custom task"
              value={newTaskName}
              onChangeText={setNewTaskName}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                if (newTaskName.trim() === "") {
                  Alert.alert("Validation Error", "Task name cannot be empty");
                  return;
                }
                  setIsModalVisible(true)
              }}
            >
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            animationType="slide"
          >
            <View style={styles.modalBackground}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Set Task Reminder</Text>

                {/* Picked Date Display */}
                {reminderDate && (
                  <Text style={styles.selectedDateText}>
                    Selected Date: {reminderDate.toLocaleString()} {/* Format the date to a string */}
                  </Text>
                )}

                {/* DatePicker */}
                <DatePicker
                  modal
                  open={openDatePicker}
                  date={reminderDate}
                  onConfirm={(date) => {
                    setOpenDatePicker(false);
                    setReminderDate(date); // Save the picked date
                  }}
                  onCancel={() => setOpenDatePicker(false)}
                  mode="datetime"
                />

                {/* Pick Date Button */}
                <TouchableOpacity
                  style={[styles.button, styles.dateButton]}
                  onPress={() => setOpenDatePicker(true)}
                >
                  <Text style={styles.buttonText}>Pick the Date</Text>
                </TouchableOpacity>

                {/* Save Task Button */}
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={addCustomTask}
                >
                  <Text style={styles.buttonText}>Save Task</Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={Setting}>
              <Text style={styles.logoutButtonText}>Setting →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
  },
  mainWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  taskList: {
    marginBottom: 100,
  },
  taskWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskName: {
    fontSize: 16,
    color: "#333",
  },
  reminderButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 25,
  },
  reminderUnset: {
    backgroundColor: "#f1f1f1",
  },
  reminderSet: {
    backgroundColor: "#4CAF50",
  },
  reminderText: {
    color: "#fff",
    fontSize: 14,
  },
  reminderTime: {
    fontSize: 12,
    color: "#888",
    marginVertical: 5,
  },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#f9f9f9",
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
  },
  logoutContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark background overlay
  },
  modal: {
    width: "90%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginVertical: 10,
  },
  dateButton: {
    backgroundColor: "#FF6347",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});

export default TaskManagementScreen;
