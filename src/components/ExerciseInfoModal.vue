<script>
export default {
  name: 'ExerciseInfoModal',
  props: {
    exercise: {
      type: Object,
      required: true
    },
    showSelectButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'select'],
};
</script>

<template>
  <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-[60] p-4">
    <div class="bg-black/80 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-2xl w-full relative border border-celeste/30 max-h-[90vh] overflow-y-auto">
      <!-- Contenedor para el botón de cerrar -->
      <div class="sticky -top-4 -right-4 -mt-4 -mr-4 flex justify-end z-[61]">
        <button 
          @click="$emit('close')" 
          class="text-celeste hover:brightness-200 transition bg-black/80 p-2 rounded-full border border-celeste/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h2 class="text-3xl font-bold text-celeste mb-6">{{ exercise.name }}</h2>

      <!-- Imagen del ejercicio -->
      <img :src="exercise.image" :alt="exercise.name" class="w-auto max-h-60 m-auto rounded-lg mb-6">

      <!-- Descripción -->
      <div class="space-y-4 text-white">
        <p class="text-lg">{{ exercise.description }}</p>

        <!-- Músculos específicos -->
        <div>
          <h3 class="text-sky-300 font-semibold mb-1 mt-4">Músculos trabajados:</h3>
          <p>{{ exercise.specificMuscles.join(', ') }}</p>
        </div>

        <!-- Equipamiento -->
        <div>
          <h3 class="text-sky-300 font-semibold mb-1 mt-4">Equipamiento necesario:</h3>
          <p>{{ exercise.equipment.join(', ') }}</p>
        </div>

        <!-- Información adicional -->
        <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-4 gap-2">
          <div>
            <h3 class="text-sky-300 font-semibold mb-1">Dificultad:</h3>
            <p class="capitalize">{{ exercise.difficulty }}</p>
          </div>
          <div>
            <h3 class="text-sky-300 font-semibold mb-1">Tipo de entrenamiento:</h3>
            <p class="capitalize">{{ exercise.trainingType.join(', ') }}</p>
          </div>
          <div>
            <h3 class="text-sky-300 font-semibold mb-1">Duración estimada:</h3>
            <p>{{ exercise.estimatedDuration }}</p>
          </div>
          <div>
            <h3 class="text-sky-300 font-semibold mb-1">Series recomendadas:</h3>
            <p>{{ exercise.recommendedSets }}</p>
          </div>
        </div>

        <!-- Repeticiones recomendadas -->
        <div>
          <h3 class="text-sky-300 font-semibold mb-1 mt-4">Repeticiones recomendadas:</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 sm:gap-4 gap-2">
            <div>
              <p class="font-medium text-blue-200">Principiante:</p>
              <p>{{ exercise.recommendedReps.beginner }}</p>
            </div>
            <div>
              <p class="font-medium text-blue-200">Intermedio:</p>
              <p>{{ exercise.recommendedReps.intermediate }}</p>
            </div>
            <div>
              <p class="font-medium text-blue-200">Avanzado:</p>
              <p>{{ exercise.recommendedReps.advanced }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón seleccionar -->
      <button
        v-if="showSelectButton"
        @click="$emit('select', exercise)"
        class="w-full bg-celeste text-azul font-bold px-6 py-3 rounded-xl hover:brightness-125 transition-all transform hover:scale-105 mt-8"
      >
        Seleccionar Ejercicio
      </button>
    </div>
  </div>
</template> 