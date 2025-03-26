<script>
import { getExerciseCategories, getExercises, getExercisesByCategory } from '../services/exercise-service';
import ExerciseInfoModal from './ExerciseInfoModal.vue';

export default {
  name: 'ExercisePickerModal',
  components: {
    ExerciseInfoModal
  },
  emits: ['close', 'select'],
  
  data() {
    return {
      categories: [],
      exercises: [],
      selectedCategory: '',
      loading: true,
      selectedExerciseForDetail: null
    };
  },

  //Filtra los ejercicios por categoría
  computed: {
    filteredExercises() {
      if (!this.selectedCategory) return this.exercises;
      return this.exercises.filter(ex => ex.muscleGroup === this.selectedCategory);
    }
  },

  //Actualiza los ejercicios
  watch: {
    async selectedCategory(newCategory) {
      try {
        this.loading = true;
        if (newCategory) {
          this.exercises = await getExercisesByCategory(newCategory);
        } else {
          this.exercises = await getExercises();
        }
      } catch (error) {
        console.error('Error al cargar ejercicios:', error);
      } finally {
        this.loading = false;
      }
    }
  },

  methods: {
    //Cargar las categorías y ejercicios desde la base de datos
    async loadData() {
      try {
        this.loading = true;
        const [categoriesData, exercisesData] = await Promise.all([
          getExerciseCategories(),
          getExercises()
        ]);
        this.categories = categoriesData;
        this.exercises = exercisesData;
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        this.loading = false;
      }
    },

    //Emitir el ejercicio
    selectExercise(exercise) {
      this.$emit('select', {
        exerciseId: exercise.id,
        name: exercise.name,
        sets: 3,
        reps: 12
      });
    },

    showExerciseDetail(exercise) {
      this.selectedExerciseForDetail = exercise;
    }
  },

  mounted() {
    this.loadData();
  }
};
</script> 


<template>
  <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
    <div class="bg-black/80 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-4xl w-full relative border border-celeste/30 max-h-[90vh] overflow-y-auto">
      <!-- Botón de cerrar -->
      <div class="sticky -top-4 -right-4 -mt-4 -mr-4 flex justify-end z-[51]">
        <button 
          @click="$emit('close')" 
          class="text-celeste hover:brightness-125 transition bg-black/80 p-2 rounded-full border border-celeste/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h2 class="text-3xl font-bold text-celeste mb-6">Agregar Ejercicio</h2>

      <!-- Filtros -->
      <div class="mb-6">
        <select 
          v-model="selectedCategory"
          class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-2"
        >
          <option value="">Todos los grupos musculares</option>
          <option 
            v-for="category in categories" 
            :key="category.id" 
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Lista de ejercicios modificada -->
      <div class="grid gap-4">
        <div 
          v-for="exercise in filteredExercises" 
          :key="exercise.id"
          class="bg-black/40 p-4 rounded-xl border border-celeste/20 hover:border-celeste/40 transition cursor-pointer relative"
          @click="selectExercise(exercise)"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-xl font-semibold text-white mb-2">{{ exercise.name }}</h3>
              <p class="text-white/80 text-sm">{{ exercise.description }}</p>
            </div>
            <button 
              @click.stop="showExerciseDetail(exercise)"
              class="text-celeste hover:brightness-125 transition p-2"
              title="Más información"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading" class="text-center py-8">
        <p class="text-celeste">Cargando ejercicios...</p>
      </div>
    </div>
  </div>

  <!-- Modal de detalles -->
  <ExerciseInfoModal
    v-if="selectedExerciseForDetail"
    :exercise="selectedExerciseForDetail"
    @close="selectedExerciseForDetail = null"
    @select="selectExercise"
  />
</template>