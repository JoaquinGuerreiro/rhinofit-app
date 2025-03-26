<script>
export default {
  name: "ModalPremiumAlert",
  emits: ['close', 'upgrade']
};
</script>

<template>
  <div 
    class="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
    style="backdrop-filter: none" 
  >
    <div class="bg-black/60 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-md w-full text-center relative border border-celeste/30">
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-celeste hover:brightness-125 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 class="text-3xl font-bold text-celeste mb-6">¡Contenido exclusivo!</h2>
      <p class="text-white/80 mb-8 text-lg">
        Esta funcionalidad es solo para usuarios premium. ¡Actualiza tu plan para acceder a entrenadores!
      </p>
      <button
        @click="$emit('upgrade')"
        class="bg-celeste text-azul font-bold px-8 py-4 rounded-xl hover:brightness-125 transition-all transform hover:scale-105 w-full"
      >
        Mejorar a Premium
      </button>
    </div>
  </div>
</template>


