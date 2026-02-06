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
    sets: 3,
    completedSets: [false, false, false],
  },
  {
    id: 2,
    name: "Child's Pose Breathing",
    reps: "3 sets of 20",
    completed: false,
    frequency: "daily",
    sets: 3,
    completedSets: [false, false, false],
  },
  {
    id: 3,
    name: "Donkey Kicks",
    reps: "3 sets of 30 seconds",
    completed: false,
    frequency: "daily",
    sets: 1,
    completedSets: [false],
  },
  {
    id: 4,
    name: "Single Leg Bridge 12lbs",
    reps: "3 sets of 8 each leg",
    completed: false,
    frequency: "even",
    sets: 1,
    completedSets: [false],
  },
  {
    id: 5,
    name: "Superman",
    reps: "5x (hold for 10 seconds)",
    completed: false,
    frequency: "even",
    sets: 1,
    completedSets: [false],
  },
  {
    id: 6,
    name: "Step up",
    reps: "3 sets of 8 each leg",
    completed: false,
    frequency: "even",
    sets: 1,
    completedSets: [false],
  },
  {
    id: 7,
    name: "Squats with 20lbs",
    reps: "3 sets of 8 each leg",
    completed: false,
    frequency: "even",
    sets: 1,
    completedSets: [false],
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

  const toggleSet = (id: number, setIndex: number) => {
    setExercises(
      exercises.map((exercise) => {
        if (exercise.id === id) {
          const newCompletedSets = [...exercise.completedSets];
          newCompletedSets[setIndex] = !newCompletedSets[setIndex];
          const allCompleted = newCompletedSets.every((set) => set === true);
          return {
            ...exercise,
            completedSets: newCompletedSets,
            completed: allCompleted,
          };
        }
        return exercise;
      }),
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
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/pelvic_power_logo.webp")}
          style={styles.logo}
        />
        {__DEV__ && (
          <TouchableOpacity onPress={resetExercises} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Daily Exercises Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Daily Exercises</Text>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
        </View>
        {dailyExercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View style={styles.checkboxContainer}>
              {exercise.completedSets.map((isCompleted, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkbox}
                  onPress={() => toggleSet(exercise.id, index)}
                >
                  {isCompleted && <View style={styles.checkboxChecked} />}
                </TouchableOpacity>
              ))}
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
          </View>
        ))}

        {/* Even Day Exercises Section - only show on even days */}
        {isEvenDay() && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Every Other Day Exercises</Text>
            </View>
            {evenDayExercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseItem}>
                <View style={styles.checkboxContainer}>
                  {exercise.completedSets.map((isCompleted, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.checkbox}
                      onPress={() => toggleSet(exercise.id, index)}
                    >
                      {isCompleted && <View style={styles.checkboxChecked} />}
                    </TouchableOpacity>
                  ))}
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
              </View>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 50,
  },
  resetButton: {
    position: "absolute",
    top: 10,
    right: 10,
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
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 6,
    marginRight: 6,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
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
  checkboxContainer: {
    flexDirection: "row",
    marginRight: 16,
    gap: 4,
    width: 68,
    justifyContent: "flex-end",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ff8173",
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
