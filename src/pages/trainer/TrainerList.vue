<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import SkeletonLoader from '../../components/SkeletonLoader.vue';
import ModalPremiumAlert from '../../components/ModalPremiumAlert.vue';
import ModalCheckout from '../../components/ModalCheckout.vue';
import FeedbackMessage from '../../components/FeedbackMessage.vue';
import { getTrainers } from '../../services/user-profiles';
import { subscribeToAuth } from '../../services/auth';
import { subscribeToUnreadMessagesByUser } from '../../services/notifications';

export default {
  name: 'TrainerList',
  components: { BaseHeading1, SkeletonLoader, ModalPremiumAlert, ModalCheckout, FeedbackMessage },
  data() {
    return {
      trainers: [],
      loading: true,
      isBasicUser: false,
      showPremiumModal: false,
      showCheckoutModal: false,
      showFeedback: false,
      checkingUserStatus: true,
      userId: null,
      unreadMessages: {},
      unsubscribeFromUnread: null,
      unsubscribeFromAuth: null
    };
  },
  methods: {
    handleUpgradeClick() {
      this.showPremiumModal = false;
      this.showCheckoutModal = true;
    },
    handleUpgradeSuccess() {
      this.showCheckoutModal = false;
      this.isBasicUser = false;
      this.showFeedback = true;
    },
    handleUserChange(user) {
      if (user && user.id) {
        this.userId = user.id;
        this.isBasicUser = user.type === 'basico';
        this.showPremiumModal = this.isBasicUser && !this.showCheckoutModal;
        
        if (this.unsubscribeFromUnread) {
          this.unsubscribeFromUnread();
        }
        this.unsubscribeFromUnread = subscribeToUnreadMessagesByUser(
          user.id,
          (unreadByUser) => {
            this.unreadMessages = unreadByUser;
          }
        );
      }
      this.checkingUserStatus = false;
    }
  },
  async mounted() {
    try {
      this.trainers = await getTrainers();
      this.unsubscribeFromAuth = subscribeToAuth(this.handleUserChange);
    } catch (error) {
      console.error('Error al cargar entrenadores:', error);
    } finally {
      this.loading = false;
    }
  },
  unmounted() {
    if (this.unsubscribeFromUnread) {
      this.unsubscribeFromUnread();
    }
    if (this.unsubscribeFromAuth) {
      this.unsubscribeFromAuth();
    }
  }
};
</script>

<template>
    <div class="relative min-h-screen">
      
      <!-- Estado de carga global -->
      <div 
        v-if="checkingUserStatus"
        class="fixed inset-0 bg-black flex justify-center items-center z-40"
      >
        <p class="text-white text-xl">Cargando...</p>
      </div>
  
      <!-- Fondo separado del contenido blureado -->
      <div 
        class="fixed top-0 left-0 w-full h-screen -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div 
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/entrenadora-trainers.webp')"
        ></div>
      </div>
  
      <!-- Contenido principal -->
      <div 
        v-show="!checkingUserStatus" 
        :class="{ 'blur-sm pointer-events-none': isBasicUser }"
        class="relative z-10"
      >
        <div class="max-w-7xl mx-auto px-4 py-8">
          <BaseHeading1 class="mb-8">Nuestros Entrenadores</BaseHeading1>
  
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
              v-for="trainer in trainers"
              :key="trainer.id"
              class="bg-black/40 backdrop-blur-md rounded-xl p-6 hover:bg-black/60 transition group relative"
              :class="{ 'ring-2 ring-red-500/50': unreadMessages[trainer.id] }"
            >
              <!-- Indicador de mensajes no leídos -->
              <span 
                v-if="unreadMessages[trainer.id]"
                class="absolute -top-3 -right-3 bg-red-500 text-white text-sm font-semibold rounded-full min-w-[24px] h-6 flex items-center justify-center px-1 z-10 shadow-lg shadow-red-500/20 animate-pulse"
              >
                {{ unreadMessages[trainer.id] }}
              </span>

              <!-- Contenido del perfil -->
              <router-link :to="`/entrenadores/${trainer.id}`">
                <div class="aspect-square mb-4 overflow-hidden rounded-xl bg-white/10">
                  <img 
                    v-if="trainer.photoURL"
                    :src="trainer.photoURL" 
                    :alt="trainer.displayName"
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
                <h2 class="text-xl font-semibold text-celeste mb-2">{{ trainer.displayName }}</h2>
                <p class="text-white/80 mb-2 line-clamp-2 min-h-[48px]">{{ trainer.bio || 'Sin biografía' }}</p>
                <p class="text-white/60 text-sm">{{ trainer.training || 'Sin información de entrenamiento' }}</p>
              </router-link>

              <!-- Botón de chat -->
              <router-link
                :to="`/entrenadores/${trainer.id}/chat`"
                class="mt-4 w-full block"
              >
                <button class="w-full text-celeste font-semibold transition brightness-125 hover:brightness-100 bg-celeste/10 rounded-lg py-2 px-4 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chatear con {{ trainer.displayName }}
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modales -->
      <ModalPremiumAlert 
        v-if="showPremiumModal"
        @close="showPremiumModal = false"
        @upgrade="handleUpgradeClick"
      />

      <ModalCheckout
        v-if="showCheckoutModal && userId"
        :userId="userId"
        @close="showCheckoutModal = false"
        @upgraded="handleUpgradeSuccess"
      />

      <FeedbackMessage
        v-if="showFeedback"
        message="¡Felicitaciones! Tu cuenta ha sido actualizada a Premium"
        type="success"
        @close="showFeedback = false"
      />

      <!-- Botón flotante de upgrade -->
      <button
        v-if="isBasicUser"
        @click="showCheckoutModal = true"
        class="fixed md:bottom-6 bottom-24 right-6 bg-celeste text-azul font-bold px-6 py-3 rounded-xl shadow-lg hover:brightness-125 transition-all transform hover:scale-105 flex items-center space-x-2 z-40 border-2 border-celeste/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span>Mejorar a Premium</span>
      </button>
    </div>
  </template>
  
  
