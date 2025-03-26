<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import ExercisePickerModal from '../../components/ExercisePickerModal.vue';
import ExerciseDetailsModal from '../../components/ExerciseDetailsModal.vue';
import ExerciseInfoModal from '../../components/ExerciseInfoModal.vue';
import { createRoutine, updateRoutine, getUserRoutines } from '../../services/routines-service';
import { subscribeToAuth } from '../../services/auth';
import exercisesData from '../../data/exercises.json';

export default {
  name: 'RoutineEdit',
  components: { 
    BaseHeading1,
    ExercisePickerModal,
    ExerciseDetailsModal,
    ExerciseInfoModal
  },

  data() {
    return {
      userId: null,
      routine: {
        name: '',
        description: '',
        days: {
          monday: { exercises: [] },
          tuesday: { exercises: [] },
          wednesday: { exercises: [] },
          thursday: { exercises: [] },
          friday: { exercises: [] },
          saturday: { exercises: [] },
          sunday: { exercises: [] }
        }
      },
      days: {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
      },
      showExercisePicker: false,
      selectedDay: null,
      exerciseToEdit: null,
      editingExerciseDay: null,
      editingExerciseIndex: null,
      maxNameLength: 50,
      maxDescriptionLength: 200,
      selectedExerciseInfo: null
    };
  },

  computed: {
    isEditing() {
      return !!this.$route.params.id;
    }
  },

  methods: {
    openExercisePicker(day) {
      this.selectedDay = day;
      this.showExercisePicker = true;
    },

    handleExerciseSelected(exercise) {
      if (!this.routine.days[this.selectedDay].exercises) {
        this.routine.days[this.selectedDay].exercises = [];
      }
      this.routine.days[this.selectedDay].exercises.push(exercise);
      this.showExercisePicker = false;
    },

    editExercise(day, exercise, index) {
      this.editingExerciseDay = day;
      this.editingExerciseIndex = index;
      this.exerciseToEdit = { ...exercise };
    },

    handleExerciseUpdated(updatedExercise) {
      const exercises = this.routine.days[this.editingExerciseDay].exercises;
      exercises[this.editingExerciseIndex] = {
        ...exercises[this.editingExerciseIndex],
        ...updatedExercise
      };
      this.exerciseToEdit = null;
    },

    removeExercise(day, exercise) {
      const exercises = this.routine.days[day].exercises;
      const index = exercises.findIndex(e => e.exerciseId === exercise.exerciseId);
      if (index !== -1) {
        exercises.splice(index, 1);
      }
    },

    //Funciones para guardar la rutina
    async saveRoutine() {
      if (!this.userId) return;

      try {
        if (this.isEditing) {
          await updateRoutine(this.userId, this.$route.params.id, {
            name: this.routine.name,
            description: this.routine.description,
            days: this.routine.days
          });
          this.$router.push('/rutinas?edit=update');
        } else {
          await createRoutine(this.userId, {
            name: this.routine.name,
            description: this.routine.description,
            days: this.routine.days
          });
          this.$router.push('/rutinas?edit=create');
        }
      } catch (error) {
        console.error('Error al guardar rutina:', error);
      }
    },

    //Carga la rutina existente desde la base de datos
    async loadExistingRoutine() {
      try {
        const routines = await getUserRoutines(this.userId);
        const currentRoutine = routines.find(r => r.id === this.$route.params.id);
        if (currentRoutine) {
          const days = {
            monday: { exercises: [] },
            tuesday: { exercises: [] },
            wednesday: { exercises: [] },
            thursday: { exercises: [] },
            friday: { exercises: [] },
            saturday: { exercises: [] },
            sunday: { exercises: [] },
            ...currentRoutine.days
          };
          
          this.routine = {
            name: currentRoutine.name,
            description: currentRoutine.description,
            days
          };
        }
      } catch (error) {
        console.error('Error al cargar la rutina:', error);
      }
    },

    showExerciseInfo(exercise) {
      const fullExercise = exercisesData.exercises.find(e => 
        e.id === exercise.id || e.id === exercise.exerciseId
      );

      if (fullExercise) {
        this.selectedExerciseInfo = {
          ...fullExercise,
          sets: exercise.sets,
          reps: exercise.reps
        };
      }
    }
  },

  mounted() {
    subscribeToAuth((user) => {
      if (user) {
        this.userId = user.id;
        // Cargar rutina existente
        if (this.isEditing) {
          this.loadExistingRoutine();
        }
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
        style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/rutinas-banner.webp')"
      ></div>
    </div>

    <!-- Contenido -->
    <div class="relative pt-10 px-4 md:px-8 text-white">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <BaseHeading1>{{ isEditing ? 'Editar Rutina' : 'Nueva Rutina' }}</BaseHeading1>
        </div>

        <!-- Formulario principal -->
        <div class="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-8">
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-white mb-2">
                Nombre de la rutina 
                <span class="text-white/60 text-sm">
                  ({{ routine.name.length }}/75 caracteres)
                </span>
              </label>
              <input 
                v-model="routine.name"
                type="text"
                class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-2"
                placeholder="Ej: Rutina de fuerza"
                maxlength="75"
              >
            </div>

            <div>
              <label class="block text-white mb-2">
                Descripción (opcional)
                <span class="text-white/60 text-sm">
                  ({{ routine.description.length }}/200 caracteres)
                </span>
              </label>
              <textarea 
                v-model="routine.description"
                class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-2"
                rows="3"
                placeholder="Describe tu rutina..."
                maxlength="200"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Días de la semana -->
        <div class="space-y-6 mb-28">
          <div 
            v-for="(dayName, dayKey) in days" 
            :key="dayKey"
            class="bg-black/40 backdrop-blur-md rounded-xl p-6"
          >
            <h2 class="text-2xl font-bold text-celeste mb-4">{{ dayName }}</h2>

            <!-- Lista de ejercicios del día -->
            <div class="space-y-4 mb-6">
              <div 
                v-for="(exercise, index) in routine.days[dayKey].exercises" 
                :key="index"
                class="bg-black/60 rounded-xl p-4"
              >
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div 
                    class="cursor-pointer hover:brightness-125 transition"
                    @click="showExerciseInfo(exercise)"
                  >
                    <h3 class="text-lg font-semibold text-white">{{ exercise.name }}</h3>
                    <p class="text-white/60">
                      {{ exercise.sets }} series x {{ 
                        typeof exercise.reps === 'string' && exercise.reps.toLowerCase().includes('seg')
                        ? exercise.reps
                        : `${exercise.reps} repeticiones`
                      }}
                    </p>
                  </div>

                  <!-- Botones de acción -->
                  <div class="flex items-center gap-4">
                    <!-- Botón de información -->
                    <button 
                      @click="showExerciseInfo(exercise)"
                      class="flex items-center gap-2 bg-celeste/20 text-celeste px-4 py-2 rounded-lg hover:bg-celeste/30 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>

                    <!-- Botón de editar  -->
                    <button 
                      @click.stop="editExercise(dayKey, exercise, index)"
                      class="flex items-center gap-2 bg-celeste/20 text-celeste px-4 py-2 rounded-lg hover:bg-celeste/30 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span class="hidden sm:inline">Editar</span>
                    </button>

                    <!-- Botón de eliminar -->
                    <button 
                      @click.stop="removeExercise(dayKey, exercise)"
                      class="flex items-center gap-2 bg-red-500/20 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/30 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span class="hidden sm:inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón agregar ejercicio -->
            <button
              @click="openExercisePicker(dayKey)"
              class="bg-celeste/20 text-celeste px-4 py-2 rounded-xl hover:bg-celeste/30 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Agregar ejercicio
            </button>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="fixed bottom-20 md:bottom-6 right-6 flex gap-4">
          <button
            @click="$router.push('/rutinas')"
            class="bg-gray-500/80 text-white px-6 py-3 rounded-xl hover:bg-gray-500/90 transition"
          >
            Cancelar
          </button>
          <button
            @click="saveRoutine"
            class="bg-celeste text-azul font-bold px-6 py-3 rounded-xl hover:brightness-125 transition-all transform hover:scale-105"
          >
            Guardar Rutina
          </button>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <ExercisePickerModal
      v-if="showExercisePicker"
      @close="showExercisePicker = false"
      @select="handleExerciseSelected"
    />

    <ExerciseDetailsModal
      v-if="exerciseToEdit"
      :exercise="exerciseToEdit"
      @close="exerciseToEdit = null"
      @save="handleExerciseUpdated"
    />

    <ExerciseInfoModal
      v-if="selectedExerciseInfo"
      :exercise="selectedExerciseInfo"
      :showSelectButton="false"
      @close="selectedExerciseInfo = null"
    />
  </div>
</template>
