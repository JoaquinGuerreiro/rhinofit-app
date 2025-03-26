// Servicio para manejar los perfiles de los usuarios

import { doc, getDoc, setDoc, updateDoc, getDocs, collection, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";


/**
 * ------------------------------Obtener Pefil por ID------------------------------
 * @param {string} userId 
 * @returns 
 */
export async function getUserProfileById(id) {
    try {
        const profileRef = doc(db, `user-profiles/${id}`);
        const profileSnapshot = await getDoc(profileRef);
        
        if (!profileSnapshot.exists()) {
            console.warn(`No se encontró perfil para el usuario ${id}`);
            return null;
        }

        const data = profileSnapshot.data();
        return {
            id: profileSnapshot.id,
            email: data?.email,
            displayName: data?.displayName,
            photoURL: data?.photoURL,
            bio: data?.bio,
            training: data?.training,
            type: data?.type,
            premiumExpiresAt: data?.premiumExpiresAt
        };
    } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        return null;
    }
}


/**
 *  ------------------------------Crear Perfil------------------------------
 * @param {string} id 
 * @param {{email: string, displayName: string}} data 
 */
export async function createUserProfile(id, { email, displayName }) {
    const profileRef = doc(db, `user-profiles/${id}`);

    await setDoc(profileRef, {
        email,
        displayName,
        bio: null,
        training: null,
        photoURL: null,
        type: 'basico'
    });
}


/**
 * ------------------------------Edita los datos del perfil del usuario------------------------------
 * 
 * @param {string} id 
 * @param {{displayName: string, bio: string, training: string, photoURL: string }} data
 */
export async function editUserProfile(id, data) {
    const profileRef = doc(db, `user-profiles/${id}`);
    return await updateDoc(profileRef, data);
}


/**
 * ------------------------------Actualizar a usuario premium------------------------------
 * @param {string} id 
 */
export async function updateToPremium(id) {
    const profileRef = doc(db, `user-profiles/${id}`);
    
    // Calcular fecha de expiración (1 mes desde ahora)
    const premiumExpiresAt = new Date();
    premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + 1);

    return await updateDoc(profileRef, {
        type: 'premium',
        premiumExpiresAt: premiumExpiresAt.toISOString(),
        lastPaymentDate: serverTimestamp()
    });
}

/**
 * ------------------------------Verificar y actualizar estado premium--------------------------
 * @param {string} id 
 * @param {boolean} testMode - Si es true, simula que ha pasado un mes
 */
export async function checkPremiumStatus(id, testMode = false) {
    try {
        const profileRef = doc(db, `user-profiles/${id}`);
        const profile = await getDoc(profileRef);
        
        if (!profile.exists()) return;
        
        const data = profile.data();
        
        // Si no es premium o no tiene fecha de expiración, ignorar
        if (data.type !== 'premium' || !data.premiumExpiresAt) return;
        
        // Verificar si la membresía expiró
        const expirationDate = new Date(data.premiumExpiresAt);
        const now = new Date();

        // En modo prueba, simulamos que ha pasado un mes
        if (testMode) {
            now.setMonth(now.getMonth() + 1);
        }
        
        if (expirationDate <= now) {
            console.log('[user-profiles.js checkPremiumStatus] Membresía expirada, actualizando a básico');
            // Actualizar a usuario básico
            await updateDoc(profileRef, {
                type: 'basico',
                premiumExpiresAt: null
            });
            return true; // Indica que se actualizó el estado
        }
        return false; // No hubo cambios
    } catch (error) {
        console.error('[user-profiles.js checkPremiumStatus] Error al verificar estado premium:', error);
        return false;
    }
}


/**
 * ------------------------------Obtener Entrenadores y Usuarios Premium--------------------------
 * @returns 
 */
export async function getTrainers() {
    try {
        const querySnapshot = await getDocs(
            query(
                collection(db, 'user-profiles'),
                where('type', '==', 'entrenador')
            )
        );

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("[user-profiles.js getTrainers] Error al obtener entrenadores: ", error);
        throw error;
    }
}

export async function getPremiums() {
    try {
        const querySnapshot = await getDocs(
            query(
                collection(db, 'user-profiles'),
                where('type', '==', 'premium')
            )
        );

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("[user-profiles.js getPremiums] Error al obtener usuarios premium: ", error);
        throw error;
    }
}
