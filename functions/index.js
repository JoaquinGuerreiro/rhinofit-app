const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onNewMessage = functions.firestore
  .document("private-chats/{chatId}/messages/{messageId}")
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const chatId = context.params.chatId;

    try {
      // Obtener datos del chat
      const chatDoc = await admin.firestore()
        .collection("private-chats")
        .doc(chatId)
        .get();

      if (!chatDoc.exists) {
        console.log("Chat no encontrado");
        return;
      }

      const chatData = chatDoc.data();
      const receiverId = Object.keys(chatData.users)
        .find((id) => id !== message.user_id);

      if (!receiverId) {
        console.log("Receptor no encontrado");
        return;
      }

      // Perfil del receptor
      const receiverProfile = await admin.firestore()
        .collection("user-profiles")
        .doc(receiverId)
        .get();

      if (!receiverProfile.exists) {
        console.log("Perfil del receptor no encontrado");
        return;
      }

      const receiverData = receiverProfile.data();
      const fcmToken = receiverData.fcmToken;

      if (!fcmToken) {
        console.log("Token FCM no encontrado");
        return;
      }

      // Perfil del remitente
      const senderProfile = await admin.firestore()
        .collection("user-profiles")
        .doc(message.user_id)
        .get();

      let senderName = "Usuario";
      let userType = "default";
      if (senderProfile.exists) {
        const senderData = senderProfile.data();
        if (senderData.displayName) {
          senderName = senderData.displayName;
        }
        if (senderData.type) {
          userType = senderData.type;
        }
      }

      // Enviar notificación
      const notification = {
        title: `Nuevo mensaje de ${senderName}`,
        body: message.text,
      };

      await admin.messaging().send({
        token: fcmToken,
        notification,
        data: {
          senderId: message.user_id,
          chatId: chatId,
          type: "chat_message",
          userType: userType,
        },
        webpush: {
          notification: {
            ...notification,
            icon: "icons/icon-192x192.png",
            badge: "icons/icon-16x16.png",
            tag: "chat-message",
            requireInteraction: true,
            renotify: false,
          },
          fcmOptions: {
            link: userType === "entrenador" ?
              `/entrenadores/${message.user_id}/chat` :
              `/usuarios-premium/${message.user_id}/chat`,
          },
        },
        android: {
          notification: {
            icon: "icons/icon-192x192.png",
            clickAction: "FLUTTER_NOTIFICATION_CLICK",
            tag: "chat-message",
          },
        },
      });

      console.log("Notificación enviada con éxito al usuario:", receiverId);
    } catch (error) {
      console.error("Error en onNewMessage:", error);
    }
  });
