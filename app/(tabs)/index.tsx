import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEY = "@exercises";

const initialExercises = [
  {
    id: 1,
    name: "Reverse Kegels",
    reps: "3 sets of 15",
    completed: false,
    frequency: "daily",
  },
  {
    id: 2,
    name: "Child's Pose Breathing",
    reps: "3 sets of 20",
    completed: false,
    frequency: "daily",
  },
  {
    id: 3,
    name: "Donkey Kicks",
    reps: "3 sets of 30 seconds",
    completed: false,
    frequency: "daily",
  },
  {
    id: 4,
    name: "Lumbar Wall Slide",
    reps: "3 sets of 10 each leg",
    completed: false,
    frequency: "daily",
  },
  {
    id: 5,
    name: "everyother1",
    reps: "3 sets of 30",
    completed: false,
    frequency: "even",
  },
  {
    id: 6,
    name: "Burpees",
    reps: "3 sets of 10",
    completed: false,
    frequency: "even",
  },
  {
    id: 7,
    name: "everyother2",
    reps: "3 sets of 20",
    completed: false,
    frequency: "even",
  },
  {
    id: 8,
    name: "everyother3",
    reps: "3 sets of 15",
    completed: false,
    frequency: "even",
  },
  {
    id: 9,
    name: "everyother4",
    reps: "3 sets of 15",
    completed: false,
    frequency: "even",
  },
  {
    id: 10,
    name: "everyother5",
    reps: "3 sets of 15",
    completed: false,
    frequency: "even",
  },
];

const index = () => {
  const [exercises, setExercises] = useState(initialExercises);

  // Get formatted current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    });
  };

  const isEvenDay = () => {
    return new Date().getDate() % 2 === 0;
  };

  const dailyExercises = exercises.filter((ex) => ex.frequency === "daily");
  const evenDayExercises = exercises.filter((ex) => ex.frequency === "even");

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

  const resetExercises = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setExercises(initialExercises);
    } catch (error) {
      console.error("Error resetting exercises:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/pelvic_power_logo.webp")}
          style={styles.logo}
        />
        <Text style={styles.header}>{getCurrentDate()}</Text>
        {__DEV__ && (
          <TouchableOpacity onPress={resetExercises} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Daily Exercises Section */}
        <Text style={styles.sectionHeader}>Daily Exercises</Text>
        {dailyExercises.map((exercise) => (
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

        {/* Even Day Exercises Section - only show on even days */}
        {isEvenDay() && (
          <>
            <Text style={styles.sectionHeader}>Even Day Exercises</Text>
            {evenDayExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseItem}
                onPress={() => toggleExercise(exercise.id)}
              >
                <View style={styles.checkbox}>
                  {exercise.completed && (
                    <View style={styles.checkboxChecked} />
                  )}
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
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00b9b070",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logo: {
    width: 48,
    height: 40,
    marginRight: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "right",
  },
  resetButton: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    borderColor: "#ff8173",
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    borderRadius: 2,
    backgroundColor: "#ff8173",
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
