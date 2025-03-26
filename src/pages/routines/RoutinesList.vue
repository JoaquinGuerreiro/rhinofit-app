<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import SkeletonLoader from '../../components/SkeletonLoader.vue';
import { getUserRoutines, deleteRoutine } from '../../services/routines-service';
import { subscribeToAuth } from '../../services/auth';
import FeedbackMessage from '../../components/FeedbackMessage.vue';

export default {
  name: 'RoutinesList',
  components: { BaseHeading1, SkeletonLoader, FeedbackMessage },
  
  data() {
    return {
      routines: [],
      loading: true,
      userId: null,
      routineToDelete: null,
      showFeedback: false,
      feedbackMessage: ''
    };
  },

  methods: {
    formatDate(timestamp) {
      if (!timestamp) return 'Fecha no disponible';
      
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      };
      
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString('es-AR', options);
      }
      
      if (typeof timestamp === 'number') {
        return new Date(timestamp * 1000).toLocaleDateString('es-AR', options);
      }

      return 'Fecha no disponible';
    },

    //Carga las rutinas del usuario 
    async loadRoutines() {
      if (!this.userId) return;
      
      try {
        this.loading = true;
        this.routines = await getUserRoutines(this.userId);
      } catch (error) {
        console.error('Error al cargar rutinas:', error);
      } finally {
        this.loading = false;
      }
    },

    //Funciones con modal para eliminar una rutina
    showDeleteModal(routine) {
      this.routineToDelete = routine;
    },

    async confirmDelete() {
      try {
        await deleteRoutine(this.userId, this.routineToDelete.id);
        await this.loadRoutines();
        this.routineToDelete = null;
      } catch (error) {
        console.error('Error al eliminar rutina:', error);
      }
    },

    handleFeedback() {
      const editType = this.$route.query.edit;
      if (editType) {
        this.showFeedback = true;
        this.feedbackMessage = editType === 'create' 
          ? '¡Rutina creada exitosamente!' 
          : editType === 'update'
            ? '¡Rutina actualizada exitosamente!'
            : '';
        
        this.$router.replace({ 
          path: this.$route.path,
          query: {} 
        });
      }
    }
  },

  mounted() {
    subscribeToAuth((user) => {
      if (user) {
        this.userId = user.id;
        this.loadRoutines();
      }
    });
    this.handleFeedback();
  },

  watch: {
    '$route'() {
      this.handleFeedback();
    }
  }
};
</script> 

<template>
  <div class="relative min-h-screen">

    <!-- Banner fijo -->
    <div class="fixed top-0 left-0 w-full h-screen -z-10">
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/rutinas-banner.webp')"
        role="presentation"
        aria-hidden="true"
      ></div>
    </div>

    <!-- Contenido -->
    <div class="relative pt-10 px-4 md:px-8 text-white">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <BaseHeading1>Mis Rutinas</BaseHeading1>
          <button
            @click="$router.push('/rutinas/crear')"
            class="bg-celeste text-azul px-6 py-3 rounded-xl font-bold hover:brightness-125 transition-all transform hover:scale-105"
          >
            Crear Rutina
          </button>
        </div>

        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-12">
          <SkeletonLoader class="h-32 w-full max-w-2xl mx-auto" />
        </div>

        <!-- Sin rutinas -->
        <div 
          v-else-if="!routines.length" 
          class="bg-black/40 backdrop-blur-md rounded-xl p-8 text-center"
        >
          <h2 class="text-2xl font-bold text-celeste mb-4">¡Comenzá tu entrenamiento!</h2>
          <p class="text-white/80 mb-6">
            Todavía no creaste ninguna rutina. Creá tu primera rutina personalizada y empezá a entrenar.
          </p>
          <button
            @click="$router.push('/rutinas/crear')"
            class="bg-celeste text-azul px-8 py-4 rounded-xl font-bold hover:brightness-125 transition-all transform hover:scale-105"
          >
            Crear Mi Primera Rutina
          </button>
        </div>

        <!-- Lista de rutinas -->
        <div 
          v-else 
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="routine in routines"
            :key="routine.id"
            class="bg-celeste/10 backdrop-blur-md rounded-xl p-6 hover:bg-celeste/20 hover:scale-105 transition group relative flex flex-col h-[200px]"
          >
            <!-- Botones de acción -->
            <div class="absolute top-4 right-4 flex gap-2">
              <router-link
                :to="`/rutinas/${routine.id}`"
                class="text-celeste hover:brightness-125 p-2 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </router-link>
              <button
                @click.prevent="showDeleteModal(routine)"
                class="text-red-500 hover:text-red-400 p-2 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <router-link
              :to="`/rutinas/${routine.id}`"
              class="flex flex-col h-full"
            >
              <div class="pr-16">
                <!-- Título -->
                <h2 class="text-xl font-semibold text-celeste mb-2 line-clamp-2">
                  {{ routine.name }}
                </h2>
                <!-- Descripción -->
                <p class="text-white mb-4 line-clamp-2">
                  {{ routine.description || 'Sin descripción' }}
                </p>
              </div>
              <!-- Fecha -->
              <div class="text-white/65 text-sm mt-auto">
                Última actualización: {{ formatDate(routine.updatedAt) }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div 
      v-if="routineToDelete"
      class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
    >
      <div class="bg-black/80 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-md w-full relative border border-celeste/30">
        <h2 class="text-2xl font-bold text-celeste mb-4">Eliminar Rutina</h2>
        <p class="text-white mb-6">
          ¿Estás seguro de que deseas eliminar la rutina "{{ routineToDelete.name }}"? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-4">
          <button
            @click="routineToDelete = null"
            class="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition"
          >
            Cancelar
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- FeedbackMessage -->
    <FeedbackMessage
      v-if="showFeedback"
      :message="feedbackMessage"
      @close="showFeedback = false"
    />
  </div>
</template>

