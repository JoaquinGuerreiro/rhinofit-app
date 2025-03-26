<script>
export default {
  name: 'ExerciseDetailsModal',
  props: {
    exercise: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'save'],
  
  data() {
    return {
      localExercise: {
        ...this.exercise,
        reps: this.parseInitialReps(this.exercise.reps)
      },
      countType: this.detectInitialCountType(this.exercise.reps)
    };
  },

  methods: {
    detectInitialCountType(reps) {
      if (typeof reps === 'string' && reps.toLowerCase().includes('seg')) {
        return 'seconds';
      }
      return 'reps';
    },

    parseInitialReps(reps) {
      if (typeof reps === 'number') return reps;
      if (typeof reps === 'string') {
        if (reps.toLowerCase().includes('seg')) {
          return parseInt(reps);
        }
        if (reps.includes('-')) {
          return parseInt(reps.split('-')[0]);
        }
      }
      return 8;
    },

    saveChanges() {
      const value = parseInt(this.localExercise.reps);
      const updatedExercise = {
        ...this.localExercise,
        reps: this.countType === 'seconds' ? `${value} segundos` : value
      };
      this.$emit('save', updatedExercise);
    }
  }
};
</script> 

<template>
  <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
    <div class="bg-black/80 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-md w-full relative border border-celeste/30">
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-celeste hover:brightness-125 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 class="text-3xl font-bold text-celeste mb-6">{{ exercise.name }}</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-white mb-2">Series</label>
          <input 
            v-model.number="localExercise.sets"
            type="number"
            min="1"
            class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-2"
          >
        </div>

        <div>
          <label class="block text-white mb-2">Tipo de conteo</label>
          <select
            v-model="countType"
            class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-2"
          >
            <option value="reps">Repeticiones</option>
            <option value="seconds">Segundos</option>
          </select>
        </div>

        <div>
          <label class="block text-white mb-2">{{ countType === 'seconds' ? 'Segundos' : 'Repeticiones' }}</label>
          <input 
            v-model.number="localExercise.reps"
            type="number"
            min="1"
            class="w-full bg-black/40 text-white border border-celeste/30 rounded-xl px-4 py-2"
          >
        </div>

        <button
          @click="saveChanges"
          class="w-full bg-celeste text-azul font-bold px-6 py-3 rounded-xl hover:brightness-125 transition-all transform hover:scale-105"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>