<script>
export default {
  name: 'PaymentFailure'
}
</script> 

<template>
  <div class="relative min-h-screen flex items-center justify-center">
    <!-- Fondo -->
    <div 
      class="fixed top-0 left-0 w-full h-screen -z-10 pointer-events-none"
      aria-hidden="true"
    >
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/entrenadora-trainers.webp')"
      ></div>
    </div>

    <div class="bg-black/40 backdrop-blur-md rounded-xl p-8 max-w-md w-full text-center border border-celeste/30">
      <div class="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-celeste mb-4">Error en el Pago</h2>
      <p class="text-white/80 mb-6">Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
      <router-link 
        to="/entrenadores" 
        class="bg-celeste text-azul font-bold px-6 py-3 rounded-xl inline-block hover:brightness-125 transition-all"
      >
        Volver a Intentar
      </router-link>
    </div>
  </div>
</template>

