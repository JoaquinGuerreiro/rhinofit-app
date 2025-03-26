<script>
import { updateUserType } from '../services/auth';
import { initMercadoPago, createPreference } from '../services/payments';

export default {
  name: "ModalCheckout",
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      error: null
    }
  },
  emits: ['close', 'upgraded'],
  async mounted() {
    try {
      this.loading = true;
      this.error = null;
      
      const mp = await initMercadoPago();
      const preference = await createPreference();
      
      const bricksBuilder = mp.bricks();
      await bricksBuilder.create("wallet", "wallet_container", {
        initialization: {
          preferenceId: preference.id
        },
        callbacks: {
          onSubmit: this.handlePayment,
          onError: (error) => {
            console.error('Error en el pago:', error);
            this.error = 'Hubo un error al procesar el pago. Por favor, intenta nuevamente.';
          }
        }
      });
    } catch (error) {
      console.error('Error al inicializar el checkout:', error);
      this.error = 'Error al cargar el método de pago. Por favor, intenta nuevamente.';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async handlePayment() {
      try {
        this.$emit('close');
      } catch (error) {
        console.error('Error:', error);
        this.error = 'Error al procesar el pago. Por favor, intenta nuevamente.';
      }
    }
  }
};
</script> 

<template>
  <div 
    class="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
    style="backdrop-filter: none" 
  >
    <div class="bg-black/50 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-md w-full text-center relative border border-celeste/30">
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-celeste hover:brightness-125 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 class="text-3xl font-bold text-celeste mb-6">Mejora a Premium</h2>
      <div class="bg-black/40 p-6 rounded-xl mb-8 border border-celeste/20">
        <h3 class="text-2xl font-semibold text-white mb-3">Plan Premium</h3>
        <p class="text-white/80 mb-6">Accede a todos nuestros entrenadores y funcionalidades exclusivas</p>
        <p class="text-3xl font-bold text-celeste">$49.999/mes</p>
      </div>
      
      <!-- Contenedor para el botón de Mercado Pago -->
      <div id="wallet_container"></div>

      <!-- Mensaje de error -->
      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>

      <!-- Loading  -->
      <div v-if="loading" class="text-celeste mt-4">
        Cargando método de pago...
      </div>
    </div>
  </div>
</template>

