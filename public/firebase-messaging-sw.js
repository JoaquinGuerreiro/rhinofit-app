importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCr7a26P7-Z0aJdjn6jk6mFV7pI-baaaU4",
  projectId: "rhinofit-21a4a",
  messagingSenderId: "164684158170",
  appId: "1:164684158170:web:dd7100b3b4add0f4bc01e3"
});

const messaging = firebase.messaging();

// Manejar clicks en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const baseUrl = event.notification.data.userType === 'entrenador' ? 
    '/entrenadores' : '/usuarios-premium';
  
  const urlToOpen = new URL(`${baseUrl}/${event.notification.data.senderId}/chat`, self.location.origin).href;
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Buscar si hay una ventana abierta
        for (let client of windowClients) {
          if (client.url === urlToOpen) {
            return client.focus();
          }
        }
        // Abrir una nueva ventana
        return clients.openWindow(urlToOpen);
      })
  );
});

// Manejar mensajes
messaging.onBackgroundMessage((payload) => {
  console.log('Recibido mensaje en background:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'icons/icon-192x192.png',
    badge: 'icons/icon-16x16.png',
    tag: 'chat-message',
    data: {
      senderId: payload.data.senderId,
      chatId: payload.data.chatId,
      userType: payload.data.userType
    },
    requireInteraction: true,
    renotify: false
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});