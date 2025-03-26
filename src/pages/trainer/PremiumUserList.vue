<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import SkeletonLoader from '../../components/SkeletonLoader.vue';
import { getPremiums } from '../../services/user-profiles';
import { subscribeToAuth } from '../../services/auth';
import { subscribeToUnreadMessagesByUser } from '../../services/notifications';

export default {
  name: 'PremiumUserList',
  components: { BaseHeading1, SkeletonLoader },
  data() {
    return {
      users: [],
      loading: true,
      checkingUserStatus: true,
      userId: null,
      unreadMessages: {},
      unsubscribeFromUnread: null
    };
  },
  async mounted() {
    try {
      this.users = await getPremiums();

      subscribeToAuth((user) => {
        if (user && user.id) {
          this.userId = user.id;
          // Suscribirse a mensajes no leídos
          this.unsubscribeFromUnread = subscribeToUnreadMessagesByUser(
            user.id,
            (unreadByUser) => {
              this.unreadMessages = unreadByUser;
            }
          );
        }
        this.checkingUserStatus = false;
      });
    } catch (error) {
      console.error('Error al cargar usuarios premium:', error);
    } finally {
      this.loading = false;
    }
  },
  unmounted() {
    if (this.unsubscribeFromUnread) {
      this.unsubscribeFromUnread();
    }
  }
};
</script>

<template>
    <div class="relative min-h-screen"> 
         
      <!-- Background -->
      <div 
        class="fixed top-0 left-0 w-full h-screen -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div 
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/entrenadora-trainers.webp')"
        ></div>
      </div>
  
      <!-- Lista de usuarios premium -->
        <div class="max-w-7xl mx-auto px-4 py-8">
          <BaseHeading1 class="mb-8">Usuarios Premium</BaseHeading1>
  
          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-black/40 backdrop-blur-md rounded-xl p-6">
              <div class="aspect-square mb-4">
                <SkeletonLoader class="w-full h-full rounded-xl" />
              </div>
              <SkeletonLoader class="w-3/4 h-6 mb-4" />
              <SkeletonLoader class="w-full h-4 mb-2" />
              <SkeletonLoader class="w-full h-4" />
            </div>
          </div>
  
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="user in users"
              :key="user.id"
              class="bg-black/40 backdrop-blur-md rounded-xl p-6 hover:bg-black/60 transition group relative"
              :class="{ 'ring-2 ring-red-500/50': unreadMessages[user.id] }"
            >
              <!-- Indicador de mensajes no leídos -->
              <span 
                v-if="unreadMessages[user.id]"
                class="absolute -top-3 -right-3 bg-red-500 text-white text-sm font-semibold rounded-full min-w-[24px] h-6 flex items-center justify-center px-1 z-10 shadow-lg shadow-red-500/20 animate-pulse"
              >
                {{ unreadMessages[user.id] }}
              </span>

              <!-- Contenido del perfil -->
              <router-link :to="`/usuarios-premium/${user.id}`">
                <div class="aspect-square mb-4 overflow-hidden rounded-xl bg-white/10">
                  <img 
                    v-if="user.photoURL"
                    :src="user.photoURL" 
                    :alt="user.displayName"
                    class="w-full h-full object-cover"
                  >
                  <svg 
                    v-else
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-full w-full p-8 text-white/30"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="1.5" 
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 class="text-xl font-semibold text-celeste mb-2">{{ user.displayName }}</h2>
                <p class="text-white/80 mb-2 line-clamp-2 min-h-[48px]">{{ user.bio || 'Sin biografía' }}</p>
              </router-link>

              <!-- Botón de chat -->
              <router-link
                :to="`/usuarios-premium/${user.id}/chat`"
                class="mt-4 w-full block"
              >
                <button class="w-full text-celeste font-semibold transition brightness-125 hover:brightness-100 bg-celeste/10 rounded-lg py-2 px-4 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chatear con {{ user.displayName }}
                </button>
              </router-link>
            </div>
          </div>
        </div>
    </div>
  </template>