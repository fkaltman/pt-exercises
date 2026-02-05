import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "@exercises";

const initialExercises = [
  { id: 1, name: "Push-ups", reps: "3 sets of 15", completed: false },
  { id: 2, name: "Squats", reps: "3 sets of 20", completed: false },
  { id: 3, name: "Plank", reps: "3 sets of 30 seconds", completed: false },
  { id: 4, name: "Lunges", reps: "3 sets of 10 each leg", completed: false },
  { id: 5, name: "Jumping Jacks", reps: "3 sets of 30", completed: false },
  { id: 6, name: "Burpees", reps: "3 sets of 10", completed: false },
  {
    id: 7,
    name: "Mountain Climbers",
    reps: "3 sets of 20",
    completed: false,
  },
  { id: 8, name: "Bicycle Crunches", reps: "3 sets of 15", completed: false },
];

const index = () => {
  const [exercises, setExercises] = useState(initialExercises);

  // Load exercises from storage on mount
  useEffect(() => {
    loadExercises();
  }, []);

  // Save exercises to storage whenever they change
  useEffect(() => {
    saveExercises();
  }, [exercises]);

  const loadExercises = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setExercises(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading exercises:", error);
    }
  };

  const saveExercises = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
    } catch (error) {
      console.error("Error saving exercises:", error);
    }
  };

  const toggleExercise = (id: number) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id
          ? { ...exercise, completed: !exercise.completed }
          : exercise,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Exercises</Text>
      <ScrollView style={styles.scrollView}>
        {exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseItem}
            onPress={() => toggleExercise(exercise.id)}
          >
            <View style={styles.checkbox}>
              {exercise.completed && <View style={styles.checkboxChecked} />}
            </View>
            <View style={styles.exerciseInfo}>
              <Text
                style={[
                  styles.exerciseName,
                  exercise.completed && styles.completedText,
                ]}
              >
                {exercise.name}
              </Text>
              <Text
                style={[
                  styles.exerciseReps,
                  exercise.completed && styles.completedText,
                ]}
              >
                {exercise.reps}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: "#4CAF50",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  exerciseReps: {
    fontSize: 14,
    color: "#666",
  },
  completedText: {
    color: "#999",
    textDecorationLine: "line-through",
  },
});

export default index;
