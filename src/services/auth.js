// Servicio para manejar la autenticación de los usuarios

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, editUserProfile, getUserProfileById, updateToPremium, checkPremiumStatus } from "./user-profiles";
import { getFileURL, uploadFile } from "./file-storage";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { removePushNotificationToken } from './push-notifications';

let userData = {
    id: null,
    email: null,
    displayName: null,
    bio: null,
    training: null,
    photoURL: null,
    fullProfileLoaded: false,
    type: null,
    premiumExpiresAt: null
}

if(localStorage.getItem('user')) {
    userData = JSON.parse(localStorage.getItem('user'));
}

let observers = [];


/**
 * ------------------------------Informa el cambio de estado de autenticación--------------------------
 * @param {User} user 
 */
onAuthStateChanged(auth, async user => {
    if(user) {
        updateUserData({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            type: 'basico',
            premiumExpiresAt: null
        });

        try {
            const fullProfile = await getUserProfileById(user.uid);
            if (fullProfile) {
                // Verificar estado premium antes de actualizar datos
                await checkPremiumStatus(user.uid);
                
                // Obtener perfil actualizado después de la verificación
                const updatedProfile = await getUserProfileById(user.uid);
                
                updateUserData({
                    bio: updatedProfile.bio,
                    training: updatedProfile.training,
                    fullProfileLoaded: true,
                    type: updatedProfile.type,
                    premiumExpiresAt: updatedProfile.premiumExpiresAt
                });
            }
        } catch (error) {
            console.error("[auth.js onAuthStateChanged] Error al obtener el perfil: ", error);
        }
    } else {
        updateUserData({
            id: null,
            email: null,
            displayName: null,
            bio: null,
            training: null,
            photoURL: null,
            fullProfileLoaded: false,
            type: null,
            premiumExpiresAt: null
        });
        localStorage.removeItem('user');
    }
});

// ------------------------------Mensajes de error personalizados--------------------------
const ERROR_MESSAGES = {
    'auth/email-already-in-use': 'Ya existe una cuenta con este email',
    'auth/invalid-email': 'El email ingresado no es válido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
    'auth/user-not-found': 'El email o la contraseña son incorrectos',
    'auth/wrong-password': 'El email o la contraseña son incorrectos',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Por favor, intentá más tarde',
    'auth/network-request-failed': 'Error de conexión. Por favor, verificá tu conexión a internet',
    'auth/invalid-credential': 'El email o la contraseña son incorrectos',
    'auth/missing-password': 'Por favor, ingresá tu contraseña',
    'auth/requires-recent-login': 'Por favor, volvé a iniciar sesión para cambiar tu contraseña',
    'auth/wrong-password': 'La contraseña actual es incorrecta',
    'auth/user-not-found': 'No existe una cuenta con este email',
    'auth/missing-email': 'Por favor, ingresá tu email'
}


/**
 * ------------------------------Función para el register------------------------------
 * @param {{email: string, password: string, displayName: string}} data 
 */
export async function register({ email, password, displayName }) {
    try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);

        await createUserProfile(credentials.user.uid, { 
            email, 
            displayName,
            type: 'basico' 
        });

        await updateProfile(credentials.user, { displayName });

        updateUserData({
            id: credentials.user.uid,
            email,
            displayName,
            bio: null,
            training: null,
            photoURL: null,
            fullProfileLoaded: true,
            type: 'basico', 
            premiumExpiresAt: null
        });

    } catch (error) {
        console.error("[auth.js register] Error al tratar de registrar el usuario: ", error);
        throw {
            code: error.code,
            message: ERROR_MESSAGES[error.code] || 'Error al crear la cuenta'
        };
    }
}


/**
 * ------------------------------Función para el login------------------------------
 * @param {{email: string, password: string}} data 
 */
export async function login({ email, password }) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("[auth.js login] Error al autenticar: ", error);
        if (!error.code) {
            throw new Error('Error al iniciar sesión');
        }
        throw {
            code: error.code,
            message: ERROR_MESSAGES[error.code] || 'Error al iniciar sesión'
        };
    }
}


/**
 * ------------------------------Función para editar el perfil del usuario--------------------------
 * @param {{displayName: string, bio: string, training: string}} data 
 */
export async function editMyProfile({ displayName, bio, training }) {
    try {
        const promiseAuth = updateProfile(auth.currentUser, { displayName });

        const promiseStore = editUserProfile(userData.id, { displayName, bio, training });

        await Promise.all([promiseAuth, promiseStore]);

        updateUserData({
            ...userData,
            displayName,
            bio,
            training,
        });
    } catch (error) {
        console.error('[auth.js editMyProfile] Error al editar el perfil: ', error);
        throw error;
    }
}


/**
 * ------------------------------Función para editar la foto de perfil--------------------------
 * @param {File} photo 
 */
export async function editMyProfilePhoto(photo) {
    try {
        const filepath = `users/${userData.id}/avatar.jpg`; 

        // Se sube el archivo.
        await uploadFile(filepath, photo);

        const photoURL = await getFileURL(filepath);

        const promiseAuth = updateProfile(auth.currentUser, { photoURL });
        const promiseFirestore = editUserProfile(userData.id, { photoURL });

        await Promise.all([promiseAuth, promiseFirestore]);

        updateUserData({ photoURL });
    } catch (error) {
        console.error('[auth.js editMyProfilePhoto] Error al editar la foto del perfil: ', error);
        throw error;
    }
}


// ------------------------------Función para cerrar la sesión--------------------------
export async function logout() {
    try {
        // Eliminar el token FCM
        await removePushNotificationToken();
        
        await auth.signOut();
        
    } catch (error) {
        console.error('Error durante el logout:', error);
        throw error;
    }
}


/**
 * ------------------------------Función para suscribirse a los cambios de autenticación--------------------------
 * @param {Function} callback 
 * @returns {Function} Cancela la suscripción.
 */
export function subscribeToAuth(callback) {
    observers.push(callback);

    notify(callback);

    return () => {
        observers = observers.filter(obs => obs !== callback)
    };
}

/**
 * ------------------------------Función para notificar a los observers--------------------------
 * @param {Function} callback 
 */
function notify(callback) {
    callback({...userData});
}

// -----------------------------Función para notificar a todos los observers--------------------------
function notifyAll() {
    observers.forEach(callback => notify(callback));
}

/**
 * ------------------------------Función para actualizar los datos del usuario--------------------------
 * @param {{}} newData 
 */
function updateUserData(newData) {
    userData = {
        ...userData,
        ...newData,
    }
    notifyAll();
    localStorage.setItem('user', JSON.stringify(userData));
}


/**
 * ------------------------------Función para cambiar la contraseña--------------------------
 * @param {string} currentPassword 
 * @param {string} newPassword 
 */
export async function changePassword(currentPassword, newPassword) {
    try {
        const user = auth.currentUser;
        
        // Se crean las credenciales con el email actual y la contraseña proporcionada
        const credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
        );

        // Se reautentica al usuario
        await reauthenticateWithCredential(user, credential);

        // Se actualiza la contraseña
        await updatePassword(user, newPassword);

    } catch (error) {
        console.error("[auth.js changePassword] Error al cambiar la contraseña: ", error);
        throw {
            code: error.code,
            message: ERROR_MESSAGES[error.code] || 'Error al cambiar la contraseña'
        };
    }
}


/**
 * ------------------------------Función para restablecer la contraseña--------------------------
 * @param {string} email 
 */
export async function resetPassword(email) {
    try {
        const actionCodeSettings = {
            url: 'https://rhinofit-21a4a.web.app/nueva-password',
            handleCodeInApp: true
        };

        await sendPasswordResetEmail(auth, email, actionCodeSettings);
    } catch (error) {
        console.error('Error al enviar email de recuperación:', error);
        throw new Error('Error al enviar el email de recuperación. Por favor, intentá nuevamente.');
    }
}

/**
 * ------------------------------Función para actualizar el tipo de usuario--------------------------
 * @param {string} type 
 */
export async function updateUserType(type) {
    try {
        if (type === 'premium') {
            await updateToPremium(userData.id);
        } else {
            await editUserProfile(userData.id, { type });
        }
        updateUserData({ type });
    } catch (error) {
        console.error('[auth.js updateUserType] Error al actualizar tipo de usuario:', error);
        throw error;
    }
}

/**
 * ------------------------------Función para reautenticar al usuario--------------------------
 * @param {string} password 
 */
export async function reauthenticate(password) {
  try {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    return true;
  } catch (error) {
    console.error("[auth.js reauthenticate] Error al reautenticar:", error);
    throw {
      code: error.code,
      message: ERROR_MESSAGES[error.code] || 'Error al reautenticar'
    };
  }
}

/**
 * ------------------------------Función para eliminar la cuenta del usuario--------------------------
 */
export async function deleteUserCompletely(password) {
  try {
    await reauthenticate(password);

    const user = auth.currentUser;
    const userId = user.uid;

    // Eliminamos el perfil de Firestore
    await deleteDoc(doc(db, 'user-profiles', userId));

    // Eliminamos el usuario de Authentication
    await deleteUser(user);

    // Actualizamos el estado local
    updateUserData({
      id: null,
      email: null,
      displayName: null,
      bio: null,
      training: null,
      photoURL: null,
      fullProfileLoaded: false,
      type: null,
      premiumExpiresAt: null
    });

    localStorage.removeItem('user');
  } catch (error) {
    console.error("[auth.js deleteUserCompletely] Error al eliminar usuario: ", error);
    throw {
      code: error.code,
      message: ERROR_MESSAGES[error.code] || 'Error al eliminar la cuenta'
    };
  }
}