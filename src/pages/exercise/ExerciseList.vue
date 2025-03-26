<template>
  <div class="relative min-h-screen">
    <!-- Banner fijo -->
    <div class="fixed top-0 left-0 w-full h-screen -z-10">
      <div 
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/hombre_mujer-banner.webp')"
          role="presentation"
          aria-hidden="true"
      ></div>
      <div 
          class="absolute inset-0 backdrop-blur-[2px] bg-black/20"
          role="presentation"
          aria-hidden="true"
      ></div>
    </div>

    <div class="relative pt-20 px-4 md:px-8 text-white">
      <div class="max-w-6xl mx-auto">
        <BaseHeading1 class="text-center mb-6">Lista de Ejercicios</BaseHeading1>

        <!-- Botones para filtrar por grupo muscular -->
        <div v-if="categories.length" class="category-buttons mb-6">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="fetchExercisesByCategory(category.id)"
            class="category-button"
          >
            {{ category.name }}
          </button>
        </div>

        <!-- Lista de ejercicios -->
        <div v-if="exercises.length" class="exercise-items bg-black/40 backdrop-blur-md rounded-xl p-6">
          <div v-for="exercise in exercises" :key="exercise.id" class="exercise-item bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 class="font-semibold text-celeste">{{ exercise.name }}</h3>
            <p>{{ stripHtml(exercise.description) }}</p> 
          </div>
        </div>
        <p v-else class="loading-text">Cargando ejercicios...</p>
      </div>
    </div>
  </div>
</template>

<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import { getExercises, getExerciseCategories } from '../../services/exercise-service';

export default {
  data() {
    return {
      exercises: [],
      categories: []
    };
  },

  components: { BaseHeading1 },

  methods: {
    stripHtml(html) {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    },
    async fetchExercisesByCategory(categoryId) {
      this.exercises = await getExercises(categoryId);
    }
  },

  async created() {
    // Cargar categorías y todos los ejercicios al inicio
    this.categories = await getExerciseCategories();
    this.exercises = await getExercises();
  }
};
</script>

<style scoped>


.category-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 20px;
}

.exercise-items {
  display: flex;
  flex-direction: column;
  gap: 15px; 
}



.exercise-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); 
}

.category-button {
  margin: 5px;
  padding: 10px 15px;
  background-color: #007BFF; 
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.category-button:hover {
  background-color: #0056b3; 
}

.loading-text {
  text-align: center;
  color: #666; 
}
</style>
