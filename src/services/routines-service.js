// Servicio para manejar las rutinas creadas por los usuarios

import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';


/**
 * ------------------------------Obtener Rutinas del Usuario------------------------------
 * @param {string} userId 
 * @returns 
 */
export async function getUserRoutines(userId) {
  try {
    const routinesRef = collection(db, 'user-routines', userId, 'routines');
    const snapshot = await getDocs(routinesRef);
    
    // Convertimos los documentos a objetos y ordenamos por fecha
    const routines = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Aseguramos que updatedAt sea un número para comparar
      updatedAt: doc.data().updatedAt?.seconds || doc.data().createdAt?.seconds || 0
    }));

    // Ordenamos las rutinas por fecha de actualización, las más recientes primero
    return routines.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Error al obtener rutinas:', error);
    throw error;
  }
}


/**
 * ------------------------------Crear Rutina------------------------------
 * @param {string} userId 
 * @param {object} routineData 
 */
export async function createRoutine(userId, routineData) {
  try {
    const routinesRef = collection(db, 'user-routines', userId, 'routines');
    const newRoutineRef = doc(routinesRef);
    
    // Estructura de la rutina
    const routine = {
      name: routineData.name,
      description: routineData.description,
      days: {
        monday: { exercises: [] },
        tuesday: { exercises: [] },
        wednesday: { exercises: [] },
        thursday: { exercises: [] },
        friday: { exercises: [] },
        saturday: { exercises: [] },
        sunday: { exercises: [] },
        ...routineData.days
      },
      isGenerated: routineData.isGenerated || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(newRoutineRef, routine);
    return { id: newRoutineRef.id, ...routine };
  } catch (error) {
    console.error('Error al crear rutina:', error);
    throw error;
  }
}


/**
 * ------------------------------Actualizar Rutina------------------------------
 * @param {string} userId 
 * @param {string} routineId 
 * @param {object} updates 
 */
export async function updateRoutine(userId, routineId, updates) {
  try {
    const routineRef = doc(db, 'user-routines', userId, 'routines', routineId);
    await updateDoc(routineRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error al actualizar rutina:', error);
    throw error;
  }
}


/**
 * ------------------------------Agregar Ejercicio a un día específico------------------------------
 * @param {string} userId 
 * @param {string} routineId 
 * @param {string} day 
 * @param {object} exercise 
 */
export async function addExerciseToDay(userId, routineId, day, exercise) {
  try {
    const routineRef = doc(db, 'user-routines', userId, 'routines', routineId);
    const routineDoc = await getDoc(routineRef);
    const routineData = routineDoc.data();

    const exercises = routineData.days[day].exercises || [];
    exercises.push({
      ...exercise,
      order: exercises.length // Mantener orden
    });

    await updateDoc(routineRef, {
      [`days.${day}.exercises`]: exercises,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error al agregar ejercicio:', error);
    throw error;
  }
}


/**
 * ------------------------------Eliminar Rutina------------------------------
 * @param {string} userId 
 * @param {string} routineId 
 */
export async function deleteRoutine(userId, routineId) {
  try {
    const routineRef = doc(db, 'user-routines', userId, 'routines', routineId);
    await deleteDoc(routineRef);
  } catch (error) {
    console.error('Error al eliminar rutina:', error);
    throw error;
  }
} 