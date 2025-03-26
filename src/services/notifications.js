import { onSnapshot, query, collection, where } from 'firebase/firestore';
import { db } from './firebase';

let unreadCountObservers = [];
let unsubscribeFromUnreadCount = null;

export function subscribeToUnreadMessages(userId, callback) {
    if (!userId) return () => {};

    // Cancelar suscripción anterior si existe
    if (unsubscribeFromUnreadCount) {
        unsubscribeFromUnreadCount();
    }

    const chatsRef = collection(db, 'private-chats');
    const q = query(
        chatsRef,
        where(`users.${userId}`, '==', true)
    );

    unsubscribeFromUnreadCount = onSnapshot(q, (snapshot) => {
        let totalUnread = 0;
        const unreadByUser = {};

        snapshot.docs.forEach(doc => {
            const chatData = doc.data();
            if (chatData.unreadCount && chatData.unreadCount[userId]) {
                totalUnread += chatData.unreadCount[userId];
                
                // Encontrar el ID del otro usuario
                const otherUserId = Object.keys(chatData.users)
                    .find(id => id !== userId);
                
                if (otherUserId) {
                    unreadByUser[otherUserId] = chatData.unreadCount[userId];
                }
            }
        });

        callback({
            total: totalUnread,
            byUser: unreadByUser
        });
    });

    return unsubscribeFromUnreadCount;
}

export function subscribeToUnreadMessagesByUser(userId, callback) {
    if (!userId) return () => {};

    const chatsRef = collection(db, 'private-chats');
    const q = query(
        chatsRef,
        where(`users.${userId}`, '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const unreadByUser = {};

        snapshot.docs.forEach(doc => {
            const chatData = doc.data();
            if (chatData.unreadCount && chatData.unreadCount[userId]) {
                // Encontrar el ID del otro usuario
                const otherUserId = Object.keys(chatData.users)
                    .find(id => id !== userId);
                
                if (otherUserId) {
                    unreadByUser[otherUserId] = chatData.unreadCount[userId];
                }
            }
        });

        callback(unreadByUser);
    });

    return unsubscribe;
} 