import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

/**
 * Obtener rutina generada por ID
 */
export async function getGeneratedRoutine(routineId) {
  try {
    if (!routineId) {
      throw new Error('El ID de la rutina es inválido');
    }

    const routineRef = doc(db, 'generated-routines', routineId);
    const routineSnap = await getDoc(routineRef);

    if (!routineSnap.exists()) {
      throw new Error('La rutina no existe');
    }

    return routineSnap.data();
  } catch (error) {
    console.error('Error al obtener rutina generada:', error);
    throw error;
  }
}

/**
 * Obtener rutinas que coincidan con las características del usuario
 */
export async function findMatchingRoutines(preferences) {
  try {
    const routinesRef = collection(db, 'generated-routines');
    const snapshot = await getDocs(routinesRef);
    
    const routines = snapshot.docs.map(doc => ({
      id: doc.id,
      matchScore: 0,
      ...doc.data()
    }));

    const { equipment, difficulty, trainingType, duration } = preferences;

    routines.forEach(routine => {
      if (routine.characteristics.equipment === equipment) routine.matchScore += 4;
      if (routine.characteristics.difficulty === difficulty) routine.matchScore += 3;
      if (routine.characteristics.trainingType === trainingType) routine.matchScore += 3;
      if (routine.characteristics.duration === duration) routine.matchScore += 2;
    });

    return routines
      .filter(routine => routine.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Error al buscar rutinas coincidentes:', error);
    throw error;
  }
} 