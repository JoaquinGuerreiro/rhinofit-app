<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import { findMatchingRoutines } from '../../services/generated-routines-service';
import { subscribeToAuth } from '../../services/auth';

export default {
  name: 'RoutineGeneratorForm',
  components: { BaseHeading1 },
  
  data() {
    return {
      userId: null,
      loading: false,
      preferences: {
        equipment: '',
        difficulty: '',
        trainingType: '',
        duration: ''
      }
    };
  },

  methods: {
    async generateRoutine() {
      if (!this.userId) return;
      
      this.loading = true;
      try {
        // Guardar preferencias en localStorage
        localStorage.setItem('routinePreferences', JSON.stringify(this.preferences));
        
        const matchingRoutines = await findMatchingRoutines(this.preferences);
        if (matchingRoutines.length > 0) {
          this.$router.push(`/generador/resultado/${matchingRoutines[0].id}`);
        } else {
        }
      } catch (error) {
        console.error('Error al generar rutina:', error);
      } finally {
        this.loading = false;
      }
    }
  },

  mounted() {
    subscribeToAuth((user) => {
      if (user) {
        this.userId = user.id;
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
      ></div>
      <div class="absolute inset-0 backdrop-blur-[2px] bg-black/20"></div>
    </div>

    <div class="relative pt-10 px-4 md:px-8 text-white">
      <div class="max-w-4xl mx-auto">
        <BaseHeading1 class="text-center mb-6">Genera tu Rutina Personalizada</BaseHeading1>
        
        <div class="bg-black/40 backdrop-blur-md rounded-xl p-8">
          <form @submit.prevent="generateRoutine" class="space-y-6">
            <!-- Equipamiento -->
            <div>
              <label class="block text-lg font-medium text-celeste mb-2">
                ¿Qué equipamiento tenés disponible?
              </label>
              <select 
                v-model="preferences.equipment"
                required
                class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-3"
              >
                <option value="">Selecciona una opción</option>
                <option value="poco/ninguno">Poco o ningún equipamiento</option>
                <option value="basico">Equipamiento básico (mancuernas, bandas)</option>
                <option value="maquinas de gimnasio">Acceso a gimnasio completo</option>
              </select>
            </div>

            <!-- Nivel -->
            <div>
              <label class="block text-lg font-medium text-celeste mb-2">
                ¿Cuál es tu nivel de experiencia?
              </label>
              <select 
                v-model="preferences.difficulty"
                required
                class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-3"
              >
                <option value="">Selecciona una opción</option>
                <option value="principiante">Principiante</option>
                <option value="intermedia">Intermedio</option>
                <option value="avanzada">Avanzado</option>
              </select>
            </div>

            <!-- Tipo de entrenamiento -->
            <div>
              <label class="block text-lg font-medium text-celeste mb-2">
                ¿Qué objetivo tenés en tu entrenamiento?
              </label>
              <select 
                v-model="preferences.trainingType"
                required
                class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-3"
              >
                <option value="">Selecciona una opción</option>
                <option value="hipertrofia">Hipertrofia (ganar músculo)</option>
                <option value="fuerza">Ganar Fuerza</option>
                <option value="resistencia">Mejorar Resistencia</option>
              </select>
            </div>

            <!-- Duración -->
            <div>
              <label class="block text-lg font-medium text-celeste mb-2">
                ¿Cuánto tiempo querés entrenar por sesión?
              </label>
              <select 
                v-model="preferences.duration"
                required
                class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-3"
              >
                <option value="">Selecciona una opción</option>
                <option value="corto">30-45 minutos</option>
                <option value="normal">45-60 minutos</option>
                <option value="largo">60-90 minutos</option>
              </select>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-4 pt-4">
              <button
                type="button"
                @click="$router.push('/generador')"
                class="px-6 py-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="bg-celeste text-azul px-6 py-3 rounded-xl font-bold hover:brightness-125 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? 'Generando...' : 'Generar Rutina' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template> 