// Servicio para manejar la base de datos de Firebase

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCr7a26P7-Z0aJdjn6jk6mFV7pI-baaaU4",
  authDomain: "rhinofit-21a4a.firebaseapp.com",
  projectId: "rhinofit-21a4a",
  storageBucket: "rhinofit-21a4a.appspot.com",
  messagingSenderId: "164684158170",
  appId: "1:164684158170:web:dd7100b3b4add0f4bc01e3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;