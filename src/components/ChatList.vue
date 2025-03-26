<script>
import { subscribeToUnreadMessagesByUser } from '../services/notifications';
import { subscribeToAuth } from '../services/auth';

export default {
  name: 'ChatList',
  props: {
    chats: {
      type: Array,
      required: true,
      default: () => []
    },
    selectedUserId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      unreadMessages: {},
      unsubscribeFromUnread: null
    }
  },
  mounted() {
    subscribeToAuth((userData) => {
      if (userData?.id) {
        this.unsubscribeFromUnread = subscribeToUnreadMessagesByUser(
          userData.id,
          (unreadByUser) => {
            this.unreadMessages = unreadByUser;
          }
        );
      }
    });
  },
  unmounted() {
    if (this.unsubscribeFromUnread) {
      this.unsubscribeFromUnread();
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      const formatter = new Intl.DateTimeFormat('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return formatter.format(date);
    }
  }
}
</script>

<style scoped>
.chat-list {
  width: 320px;
}

@media (max-width: 768px) {
  .chat-list {
    width: 100%;
  }
}
</style>

<template>
  <div class="chat-list h-full bg-black/90 backdrop-blur-md border-r border-white/10">
    <!-- Header fijo solo visible en desktop -->
    <div class="flex-none h-20 p-4 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center md:flex hidden">
      <h2 class="text-lg font-semibold text-celeste">Chats</h2>
    </div>
    <!-- Lista de chats -->
    <div class="md:h-[calc(100vh-80px)] h-full overflow-y-auto">
      <div 
        v-for="chat in chats" 
        :key="chat.userId" 
        @click="$emit('select-chat', chat.userId)"
        class="flex items-center p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 relative"
        :class="{
          'bg-white/10': selectedUserId === chat.userId
        }"
      >
        <!-- Foto de perfil -->
        <div class="relative">
          <img 
            v-if="chat.photoURL" 
            :src="chat.photoURL" 
            class="w-12 h-12 rounded-full object-cover" 
            :alt="chat.displayName"
          >
          <div 
            v-else 
            class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <span class="text-xl text-white/70">{{ chat.displayName?.[0] || '?' }}</span>
          </div>
          
          <!-- Indicador de mensajes no leídos -->
          <span 
            v-if="unreadMessages[chat.userId]"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-semibold rounded-full min-w-[24px] h-6 flex items-center justify-center px-1 shadow-lg shadow-red-500/20"
          >
            {{ unreadMessages[chat.userId] }}
          </span>
        </div>

        <div class="ml-4 flex-1 min-w-0">
          <h3 
            class="text-sm font-medium"
            :class="unreadMessages[chat.userId] ? 'text-celeste font-semibold' : 'text-white'"
          >
            {{ chat.displayName }}
          </h3>
          <p 
            class="text-sm truncate"
            :class="unreadMessages[chat.userId] ? 'text-white/90 font-medium' : 'text-white/70'"
          >
            {{ chat.lastMessage }}
          </p>
        </div>
        <span 
          v-if="chat.timestamp" 
          class="text-xs whitespace-nowrap ml-2"
          :class="unreadMessages[chat.userId] ? 'text-celeste' : 'text-white/50'"
        >
          {{ formatDate(chat.timestamp) }}
        </span>
      </div>
    </div>
  </div>
</template>



