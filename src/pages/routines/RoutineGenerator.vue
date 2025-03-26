<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import { getUserRoutines } from '../../services/routines-service';
import { subscribeToAuth } from '../../services/auth';

export default {
  name: 'RoutineGenerator',
  components: { BaseHeading1 },
  
  data() {
    return {
      userId: null,
      hasGeneratedRoutines: false,
      loading: true
    };
  },

  methods: {
    async checkGeneratedRoutines() {
      if (!this.userId) return;
      
      try {
        this.loading = true;
        const routines = await getUserRoutines(this.userId);
        this.hasGeneratedRoutines = routines.some(routine => routine.isGenerated);
      } catch (error) {
        console.error('Error al verificar rutinas generadas:', error);
      } finally {
        this.loading = false;
      }
    }
  },

  mounted() {
    subscribeToAuth((user) => {
      if (user) {
        this.userId = user.id;
        this.checkGeneratedRoutines();
      }
    });
  }
};
</script>

<template>
  <div class="relative min-h-screen">
    <!-- Banner fijo -->
    <div class="fixed top-0 left-0 w-full h-screen -z-10">
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/generador-banner.webp')"
        role="presentation"
        aria-hidden="true"
      ></div>
      <div 
        class="absolute inset-0 backdrop-blur-[2px] bg-black/20"
        role="presentation"
        aria-hidden="true"
      ></div>
    </div>

    <div class="relative pt-10 px-4 md:px-8 text-white">
      <div class="max-w-4xl mx-auto">
        <BaseHeading1 class="text-center mb-6">Generador de Rutinas</BaseHeading1>

        <!-- Descripción del generador -->
        <div class="bg-black/40 backdrop-blur-md rounded-xl p-8 mb-8">
          <h2 class="text-2xl font-bold text-celeste mb-4">¿Cómo funciona?</h2>
          <p class="text-lg mb-6">
            Nuestro generador de rutinas creará un plan de entrenamiento personalizado basado en tus objetivos, necesidades y características. Solo tenés que completar un breve formulario sobre:
          </p>
          <ul class="list-disc list-inside space-y-2 mb-6 text-celeste/90">
            <li>Tu nivel de experiencia</li>
            <li>Equipamiento disponible</li>
            <li>Tipo de entrenamiento deseado</li>
            <li>Duración preferida de los entrenamientos</li>
          </ul>
        </div>

        <!-- Estado de carga -->
        <div v-if="loading" class="text-center">
          <p class="text-celeste">Cargando...</p>
        </div>

        <!-- Contenido principal -->
        <div v-else class="bg-black/40 backdrop-blur-md rounded-xl p-8">
          <!-- Usuario sin rutinas generadas -->
          <div v-if="!hasGeneratedRoutines">
            <h2 class="text-2xl font-bold text-celeste mb-4">¡Empezá a entrenar ahora!</h2>
            <p class="text-white/80 mb-6">
              Todavía no generaste ninguna rutina. Vamos a crear tu primera rutina personalizada para vos, para que puedas empezar a entrenar de la manera más efectiva.
            </p>
          </div>

          <!-- Usuario con rutinas generadas -->
          <div v-else>
            <h2 class="text-2xl font-bold text-celeste mb-4">¡Ya tenés rutinas generadas!</h2>
            <p class="text-white/80 mb-6">
              Podés encontrar tus rutinas generadas en la sección "Mis Rutinas", junto a tus otras rutinas. ¿Querés crear una nueva rutina personalizada?
            </p>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button
              @click="$router.push('/generador/formulario')"
              class="bg-celeste text-azul px-8 py-4 rounded-xl font-bold hover:brightness-125 transition-all transform hover:scale-105"
            >
              {{ hasGeneratedRoutines ? 'Generar Nueva Rutina' : 'Generar Primera Rutina' }}
            </button>
            
            <button
              v-if="hasGeneratedRoutines"
              @click="$router.push('/rutinas')"
              class="bg-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 transition"
            >
              Ver Mis Rutinas
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 