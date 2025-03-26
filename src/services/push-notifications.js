import { getToken, onMessage, deleteToken } from 'firebase/messaging';
import { messaging } from './firebase';
import { editUserProfile } from './user-profiles';

// Función para eliminar el token FCM
export async function removePushNotificationToken() {
    try {
        if (!messaging) return;
        
        // Eliminar el token de Firebase
        await deleteToken(messaging);
        console.log('Token FCM eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar token FCM:', error);
    }
}

export async function initializePushNotifications(userId) {
    try {
        if (!messaging) {
            console.warn('Messaging no está disponible');
            return;
        }

        await deleteToken(messaging);

        // Verificar si el navegador soporta notificaciones
        if (!('Notification' in window)) {
            console.warn('Este navegador no soporta notificaciones push');
            return;
        }

        // Solicitar permiso
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Permiso de notificaciones denegado');
            return;
        }

        // Obtener nuevo token FCM
        const token = await getToken(messaging, {
            vapidKey: 'BM8m9ykUzQiHZgKbd96qbTIDryIeThLQptqbIwdd83vU1YudIEhBFHIvMMRViYgPyipq7u-aGaskwq-4FWugSZU'
        });

        if (!token) {
            console.warn('No se pudo obtener el token FCM');
            return;
        }

        // Guardar token en el perfil del usuario
        await editUserProfile(userId, { fcmToken: token });
        console.log('Token FCM guardado:', token);

        onMessage(messaging, (payload) => {
            console.log('Mensaje recibido en foreground:', payload);
            
            if (document.visibilityState === 'hidden') {
                // Usar la API de notificaciones nativa
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(payload.notification.title, {
                        body: payload.notification.body,
                        icon: 'icons/icon-192x192.png',
                        badge: 'icons/icon-16x16.png',
                        tag: 'chat-message',
                        data: {
                            senderId: payload.data.senderId,
                            chatId: payload.data.chatId
                        },
                        requireInteraction: true,
                        renotify: false
                    });
                });
            } else {
                const audio = new Audio('/notification.mp3');
                audio.play().catch(e => console.log('Error reproduciendo sonido:', e));
            }
        });

    } catch (error) {
        console.error('Error al inicializar notificaciones push:', error);
        if (error.code === 'messaging/permission-blocked') {
            console.log('Las notificaciones están bloqueadas. El usuario debe habilitarlas manualmente.');
        }
    }
}