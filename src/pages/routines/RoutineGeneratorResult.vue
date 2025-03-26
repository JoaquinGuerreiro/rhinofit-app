<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import ExerciseInfoModal from '../../components/ExerciseInfoModal.vue';
import FeedbackMessage from '../../components/FeedbackMessage.vue';
import { getGeneratedRoutine, findMatchingRoutines } from '../../services/generated-routines-service';
import { createRoutine } from '../../services/routines-service';
import { subscribeToAuth } from '../../services/auth';
import exercisesData from '../../data/exercises.json';

export default {
  name: 'RoutineGeneratorResult',
  components: { 
    BaseHeading1,
    ExerciseInfoModal,
    FeedbackMessage
  },

  data() {
    return {
      userId: null,
      routine: null,
      loading: true,
      selectedExercise: null,
      matchingRoutines: [],
      currentRoutineIndex: 0,
      showFeedback: false,
      feedbackMessage: ''
    };
  },

  created() {
    subscribeToAuth(user => {
      this.userId = user?.id || null;
      if (this.userId) {
        this.loadGeneratedRoutine();
      }
    });
  },

  methods: {
    capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    async loadGeneratedRoutine() {
      try {
        this.loading = true;
        const routineId = this.$route.params.routineId;
        this.routine = await getGeneratedRoutine(routineId);
        
        const preferences = {
          equipment: this.routine.characteristics.equipment,
          difficulty: this.routine.characteristics.difficulty,
          trainingType: this.routine.characteristics.trainingType,
          duration: this.routine.characteristics.duration
        };
        
        this.matchingRoutines = await findMatchingRoutines(preferences);
        this.matchingRoutines = this.matchingRoutines.filter(r => r.id !== routineId);
      } catch (error) {
        console.error('Error al cargar la rutina:', error);
      } finally {
        this.loading = false;
      }
    },

    tryAnotherRoutine() {
      if (this.matchingRoutines.length === 0) {
        this.$router.push('/generador/formulario');
        return;
      }

      this.currentRoutineIndex = (this.currentRoutineIndex + 1) % this.matchingRoutines.length;
      this.routine = this.matchingRoutines[this.currentRoutineIndex];
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      this.showFeedback = true;
      this.feedbackMessage = '¡Nueva variante generada!';
    },

    async acceptRoutine() {
      if (!this.userId || !this.routine) return;

      try {
        await createRoutine(this.userId, {
          name: this.routine.name,
          description: this.routine.description,
          days: this.routine.days,
          isGenerated: true
        });

        this.$router.push('/rutinas?edit=create');
      } catch (error) {
        console.error('Error al guardar la rutina:', error);
      }
    },

    showExerciseDetails(exerciseFromRoutine) {
      const fullExercise = exercisesData.exercises.find(e => e.id === exerciseFromRoutine.id);
      if (fullExercise) {
        this.selectedExercise = {
          ...fullExercise,
          sets: exerciseFromRoutine.sets,
          reps: exerciseFromRoutine.reps
        };
      }
    },

    translateDay(day) {
      const translations = {
        'monday': 'Lunes',
        'tuesday': 'Martes',
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado',
        'sunday': 'Domingo'
      };
      return translations[day];
    }
  },

  computed: {
    orderedDays() {
      const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const orderedDays = {};
      dayOrder.forEach(day => {
        if (this.routine.days[day]) {
          orderedDays[day] = this.routine.days[day];
        }
      });
      return orderedDays;
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
        style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/generador-banner.webp')"
      ></div>
      <div class="absolute inset-0 backdrop-blur-[2px] bg-black/20"></div>
    </div>
    
    <div class="relative pt-10 px-4 md:px-8 text-white">
      <div class="max-w-4xl mx-auto">
        <BaseHeading1 class="text-center mb-6">Rutina Generada</BaseHeading1>

        <div v-if="loading" class="text-center">
          <p class="text-celeste">Cargando rutina...</p>
        </div>

        <div v-else-if="routine" class="bg-black/40 backdrop-blur-md rounded-xl p-8">
          <h2 class="text-2xl font-bold text-celeste mb-2">{{ routine.name }}</h2>
          <p class="text-white/80 mb-6">{{ routine.description }}</p>

          <!-- Características -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-black/40 p-4 rounded-xl">
              <p class="text-celeste font-medium">Equipamiento</p>
              <p class="text-white">{{ capitalize(routine.characteristics.equipment) }}</p>
            </div>
            <div class="bg-black/40 p-4 rounded-xl">
              <p class="text-celeste font-medium">Dificultad</p>
              <p class="text-white">{{ capitalize(routine.characteristics.difficulty) }}</p>
            </div>
            <div class="bg-black/40 p-4 rounded-xl">
              <p class="text-celeste font-medium">Tipo</p>
              <p class="text-white">{{ capitalize(routine.characteristics.trainingType) }}</p>
            </div>
            <div class="bg-black/40 p-4 rounded-xl">
              <p class="text-celeste font-medium">Duración</p>
              <p class="text-white">{{ capitalize(routine.characteristics.duration) }}</p>
            </div>
          </div>

          <!-- Días de entrenamiento -->
          <div class="space-y-6 mb-8">
            <template v-for="(day, dayName) in orderedDays" :key="dayName">
              <div v-if="day.exercises && day.exercises.length > 0">
                <h3 class="text-xl font-bold text-celeste mb-4">{{ translateDay(dayName) }}</h3>
                
                <div class="space-y-4">
                  <div 
                    v-for="exercise in day.exercises" 
                    :key="exercise.id"
                    class="flex justify-between items-center bg-black/40 p-4 rounded-xl hover:bg-black/60 transition cursor-pointer"
                    @click="showExerciseDetails(exercise)"
                  >
                    <div>
                      <p class="font-medium">{{ exercise.name }}</p>
                      <p class="text-sm text-white/60">{{ exercise.sets }} series x {{ 
                        typeof exercise.reps === 'string' && exercise.reps.toLowerCase().includes('seg')
                        ? exercise.reps
                        : `${exercise.reps} repeticiones`
                      }}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-celeste" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              @click="$router.push('/generador/formulario')"
              class="px-6 py-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition"
            >
              Completar Nuevo Formulario
            </button>
            <button
              @click="tryAnotherRoutine"
              class="px-6 py-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition"
            >
              Probar Otra Rutina
            </button>
            <button
              @click="acceptRoutine"
              class="bg-celeste text-azul px-6 py-3 rounded-xl font-bold hover:brightness-125 transition-all transform hover:scale-105"
            >
              Aceptar Esta Rutina
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del ejercicio -->
    <ExerciseInfoModal
      v-if="selectedExercise"
      :exercise="selectedExercise"
      :showSelectButton="false"
      @close="selectedExercise = null"
    />

    <FeedbackMessage
      v-if="showFeedback"
      :message="feedbackMessage"
      @close="showFeedback = false"
    />
  </div>
</template> 