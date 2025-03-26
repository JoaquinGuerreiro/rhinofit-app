// Servicio para manejar el almacenamiento de archivos

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * 
 * @param {string} path 
 * @param {File} file 
 */
export async function uploadFile(path, file) {

    const fileRef = ref(storage, path);

    await uploadBytes(fileRef, file);
}

/**
 * Retorna la URL absoluta con la ubicación del archivo en el servidor
 * 
 * @param {string} path 
 */
export async function getFileURL(path) {
    const fileRef = ref(storage, path);

    return await getDownloadURL(fileRef);
}