// Servicio para manejar los chats privados

import { addDoc, collection, DocumentReference, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, arrayUnion, increment, doc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { getUserProfileById } from "./user-profiles";

let chatDocsCache = {};
let currentChatId = null; 

/**
 * ------------------------------Obtener Cache Keys------------------------------
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {string}
 */
function getCacheKey(senderId, receiverId) {
    return [senderId, receiverId].sort().join("_");
}

/**
 * 
 * @param {string} key 
 * @returns {string|null}
 */
function getPrivateChatDocFromCache(key) {
    return chatDocsCache[key] || null;
}

/**
 * 
 * @param {string} key 
 * @param {any} doc
 */
function addPrivateChatDocToCache(key, doc) {
    chatDocsCache[key] = doc;
}


/**
 * ------------------------------Obtener Documento de Chat Privado------------------------------
 * @param {string} senderId 
 * @param {string} receiverId 
 * @returns {Promise<DocumentReference>}
 */
export async function getPrivateChatDoc(senderId, receiverId) {
    if (!senderId || !receiverId) {
        console.warn('senderId o receiverId faltante en getPrivateChatDoc');
        return null;
    }

    const cacheKey = getCacheKey(senderId, receiverId);
    const cachedDoc = getPrivateChatDocFromCache(cacheKey);

    if(cachedDoc) return cachedDoc;

    const chatRef = collection(db, 'private-chats');
    console.log('Buscando chat entre usuarios:', { senderId, receiverId });

    const q = query(
        chatRef,
        where(`users.${senderId}`, '==', true),
        where(`users.${receiverId}`, '==', true),
        limit(1)
    );

    const chatSnapshot = await getDocs(q);
    let chatDoc;

    if(chatSnapshot.empty) {
        console.log('Chat no encontrado, creando nuevo...');
        chatDoc = await addDoc(chatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true
            },
            created_at: serverTimestamp()
        });
        console.log('Nuevo chat creado:', chatDoc.id);
    } else {
        chatDoc = chatSnapshot.docs[0];
        console.log('Chat existente encontrado:', chatDoc.id);
    }

    addPrivateChatDocToCache(cacheKey, chatDoc);
    return chatDoc;
}


/**
 * ------------------------------Guardar Mensajes de Chat Privado------------------------------
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function savePrivateChatMessage(senderId, receiverId, text) {
    try {
        const chatDoc = await getPrivateChatDoc(senderId, receiverId);
        const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);
        
        // Crear el mensaje con el campo read
        const message = {
            user_id: senderId,
            text,
            created_at: serverTimestamp(),
            read: false
        };

        // Guardar el mensaje
        await addDoc(messagesRef, message);

        // Actualizar el contador de mensajes no leídos para el receptor
        await updateDoc(doc(db, 'private-chats', chatDoc.id), {
            [`unreadCount.${receiverId}`]: increment(1)
        });

        return message;
    } catch (error) {
        console.error('Error al guardar mensaje:', error);
        throw error;
    }
}


/**
 * ------------------------------Suscribirse a los mensajes de Chat Privado------------------------------
 */
export async function subscribeToPrivateChatMessages(senderId, receiverId, callback) {
    try {
        console.log('Iniciando suscripción a mensajes:', { senderId, receiverId });
        const chatDoc = await getPrivateChatDoc(senderId, receiverId);
        if (!chatDoc) {
            console.warn('No se encontró documento de chat');
            return () => {};
        }
        
        currentChatId = chatDoc.id;
        console.log('Chat actual establecido:', currentChatId);
        
        const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);
        const q = query(messagesRef, orderBy('created_at', 'asc'));
        
        return onSnapshot(q, async (snapshot) => {
            console.log('Snapshot de mensajes recibido:', snapshot.docs.length);
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                created_at: doc.data().created_at?.toDate()
            }));
            
            // Primero enviamos los mensajes al callback
            callback(messages);
            
            // Luego marcamos como leídos si corresponde
            if (currentChatId === chatDoc.id) {
                try {
                    await markMessagesAsRead(chatDoc.id, senderId);
                } catch (error) {
                    console.error('Error al marcar mensajes como leídos:', error);
                }
            }
        }, error => {
            console.error('Error en la suscripción a mensajes:', error);
            callback([]);
        });
    } catch (error) {
        console.error('Error al suscribirse a mensajes:', error);
        callback([]);
        return () => {};
    }
}

/**
 * ------------------------------Obtener Lista de Chats del Usuario------------------------------
 * @param {string} userId 
 * @param {Function} callback
 * @returns {Function} Unsubscribe function
 */
export function subscribeToUserChats(userId, callback) {
    if (!userId) {
        console.warn('No se proporcionó userId para subscribeToUserChats');
        callback([]);
        return () => {};
    }

    console.log('Iniciando suscripción a chats para usuario:', userId);
    const chatRef = collection(db, 'private-chats');
    const q = query(
        chatRef,
        where(`users.${userId}`, '==', true)
    );

    return onSnapshot(q, async (snapshot) => {
        console.log('Snapshot de chats recibido, docs:', snapshot.docs.length);
        const chatsPromises = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            console.log('Datos del chat:', doc.id, data);
            
            const otherUserId = Object.keys(data.users || {}).find(id => id !== userId);
            
            if (!otherUserId) {
                console.warn('No se encontró el otro usuario en el chat:', doc.id);
                return null;
            }

            try {
                // Obtener el último mensaje
                const messagesRef = collection(db, `private-chats/${doc.id}/messages`);
                const lastMessageQuery = query(messagesRef, orderBy('created_at', 'desc'), limit(1));
                const lastMessageSnapshot = await getDocs(lastMessageQuery);
                const lastMessage = lastMessageSnapshot.docs[0]?.data();

                // Obtener perfil del otro usuario
                const userProfile = await getUserProfileById(otherUserId);
                console.log('Perfil de usuario encontrado:', userProfile);

                if (userProfile) {
                    return {
                        userId: otherUserId,
                        displayName: userProfile.displayName || 'Usuario',
                        photoURL: userProfile.photoURL,
                        lastMessage: lastMessage?.text || '',
                        timestamp: lastMessage?.created_at?.toDate()
                    };
                }
            } catch (error) {
                console.error('Error al obtener información del chat:', error);
            }
            return null;
        });

        const chats = (await Promise.all(chatsPromises))
            .filter(chat => chat !== null)
            .sort((a, b) => {
                if (!a.timestamp) return 1;
                if (!b.timestamp) return -1;
                return b.timestamp - a.timestamp;
            });
        
        console.log('Lista final de chats:', chats);
        callback(chats);
    });
}

/**
 * ------------------------------Marcar mensajes como leídos------------------------------
 */
export async function markMessagesAsRead(chatId, userId) {
    try {
        // Solo marcar como leídos si este es el chat actualmente abierto
        if (currentChatId !== chatId) return;

        const chatRef = doc(db, 'private-chats', chatId);
        const messagesRef = collection(db, `private-chats/${chatId}/messages`);
        
        // Primero obtenemos los mensajes no leídos
        const q = query(
            messagesRef,
            where('read', '==', false)
        );
        
        const unreadMessages = await getDocs(q);
        
        if (unreadMessages.docs.length > 0) {
            const batch = writeBatch(db);
            let hasMessagesToUpdate = false;

            unreadMessages.docs.forEach(doc => {
                const messageData = doc.data();
                // Solo actualizamos los mensajes que no son del usuario actual
                if (messageData.user_id !== userId) {
                    hasMessagesToUpdate = true;
                    batch.update(doc.ref, { read: true });
                }
            });
            
            if (hasMessagesToUpdate) {
                batch.update(chatRef, {
                    [`unreadCount.${userId}`]: 0
                });
                
                await batch.commit();
            }
        }
    } catch (error) {
        console.error('Error al marcar mensajes como leídos:', error);
    }
}

/**
 * ------------------------------Obtener el total de mensajes no leídos------------------------------
 * @param {string} userId 
 * @returns {number}
 */
export async function getUnreadMessagesCount(userId) {
    try {
        const chatsRef = collection(db, 'private-chats');
        const q = query(
            chatsRef,
            where(`users.${userId}`, '==', true)
        );
        
        const snapshot = await getDocs(q);
        let totalUnread = 0;
        
        snapshot.docs.forEach(doc => {
            const chatData = doc.data();
            if (chatData.unreadCount && chatData.unreadCount[userId]) {
                totalUnread += chatData.unreadCount[userId];
            }
        });
        
        return totalUnread;
    } catch (error) {
        console.error('Error al obtener mensajes no leídos:', error);
        return 0;
    }
}

/**
 * ------------------------------Limpiar Chat Actual------------------------------
 */
export function clearCurrentChat() {
    currentChatId = null;
}
