<script>
import { updateUserType, subscribeToAuth } from '../../services/auth';
import { verifyPaymentToken } from '../../services/payments';
import { useRouter } from 'vue-router';

export default {
  name: 'PaymentSuccess',
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      verifying: true,
      error: false,
      unsubscribeFromAuth: null,
      expirationDate: ''
    };
  },
  async mounted() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      console.log('Token recibido:', token);
      console.log('Status del pago:', urlParams.get('status'));
      console.log('Collection status:', urlParams.get('collection_status'));

      if (!token) {
        console.error('No se encontró token en la URL');
        this.error = true;
        setTimeout(() => this.router.push('/entrenadores'), 3000);
        return;
      }

      const isValid = await verifyPaymentToken(token);
      console.log('Resultado de verificación del token:', isValid);

      if (!isValid) {
        console.error('Token inválido');
        this.error = true;
        setTimeout(() => this.router.push('/entrenadores'), 3000);
        return;
      }

      await updateUserType('premium');
      
      // Fecha de expiración
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + 1);
      this.expirationDate = expDate.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      // Esperar a que el estado se actualice
      await new Promise((resolve) => {
        this.unsubscribeFromAuth = subscribeToAuth((user) => {
          console.log('Auth actualizada, nuevo tipo:', user.type);
          if (user.type === 'premium') {
            if (this.unsubscribeFromAuth) {
              this.unsubscribeFromAuth();
            }
            resolve();
          }
        });
      });

      this.verifying = false;
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      this.error = true;
      setTimeout(() => this.router.push('/entrenadores'), 3000);
    }
  },
  unmounted() {
    if (this.unsubscribeFromAuth) {
      this.unsubscribeFromAuth();
    }
  }
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
      <!-- Estado de verificación -->
      <div v-if="verifying && !error" class="text-celeste mb-4">
        <svg class="animate-spin h-10 w-10 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Verificando pago...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="text-red-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-red-500 mb-4">Error de Verificación</h2>
        <p class="text-white/80 mb-6">No se pudo verificar el pago. Serás redirigido...</p>
      </div>

      <!-- Éxito -->
      <div v-if="!verifying && !error">
        <div class="text-green-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-celeste mb-4">¡Pago Exitoso!</h2>
        <p class="text-white/80 mb-2">Tu cuenta ha sido actualizada a Premium</p>
        <p class="text-white/60 text-sm mb-6">
          Tu membresía premium estará activa hasta el {{ expirationDate }}
        </p>
        <router-link 
          to="/entrenadores" 
          class="bg-celeste text-azul font-bold px-6 py-3 rounded-xl inline-block hover:brightness-125 transition-all"
        >
          Ver Entrenadores
        </router-link>
      </div>
    </div>
  </div>
</template>

