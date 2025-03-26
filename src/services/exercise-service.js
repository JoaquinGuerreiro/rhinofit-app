import { db } from './firebase';
import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
import exercisesData from '../data/exercises.json';

/**
 * Obtener todas las categorías de ejercicios
 */
export const getExerciseCategories = async () => {
  return exercisesData.categories.muscleGroups.map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1)
  }));
};

/**
 * Obtener ejercicios, opcionalmente filtrados por categoría
 */
export const getExercises = async (categoryId = null) => {
  let exercises = exercisesData.exercises;
  
  if (categoryId) {
    exercises = exercises.filter(exercise => exercise.muscleGroup === categoryId);
  }
  
  return exercises;
};

/**
 * Obtener ejercicios por categoría específica
 */
export const getExercisesByCategory = async (categoryId) => {
  return exercisesData.exercises.filter(exercise => exercise.muscleGroup === categoryId);
};

/**
 * Inicializar ejercicios en Firestore (usar una sola vez)
 */
export const initializeExercisesInFirestore = async () => {
  try {
    const exercisesRef = collection(db, 'exercises');
    
    for (const exercise of exercisesData.exercises) {
      await setDoc(doc(exercisesRef, exercise.id), exercise);
    }
    
    // También guardamos las categorías
    await setDoc(doc(db, 'metadata', 'categories'), {
      muscleGroups: exercisesData.categories.muscleGroups,
      difficulties: exercisesData.categories.difficulties,
      trainingTypes: exercisesData.categories.trainingTypes
    });
    
    console.log('Ejercicios inicializados en Firestore exitosamente');
  } catch (error) {
    console.error('Error inicializando ejercicios:', error);
    throw error;
  }
}; 