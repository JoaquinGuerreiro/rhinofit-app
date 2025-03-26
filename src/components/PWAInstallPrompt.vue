<script>
export default {
  name: 'PWAInstallPrompt',
  data() {
    return {
      deferredPrompt: null,
      showInstallButton: false,
      isStandalone: false,
      isCompact: false,
      isMobile: false
    }
  },
  mounted() {
    // Verificar si es dispositivo móvil
    this.checkMobileStatus();

    window.addEventListener('resize', this.handleResize);

    // Verificar si está instalada
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone || 
                        document.referrer.includes('android-app://');

    console.log('PWA Status:', {
      isStandalone: this.isStandalone,
      isPWASupported: 'serviceWorker' in navigator
    });

    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt triggered');
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton = true;
      
      // Temporizador
      this.startCompactTimer();
    });

    // Escuchar si la PWA ya está instalada
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalada exitosamente');
      this.showInstallButton = false;
      this.deferredPrompt = null;
      this.isStandalone = true;
    });
  },
  methods: {
    async installPWA() {
      if (!this.deferredPrompt) {
        console.log('No hay prompt de instalación disponible');
        return;
      }

      try {
        // Mostrar el prompt de instalación
        this.deferredPrompt.prompt();

        // Esperar la respuesta
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);

        // Limpiar el prompt
        this.deferredPrompt = null;
        this.showInstallButton = false;
      } catch (error) {
        console.error('Error al intentar instalar la PWA:', error);
      }
    },
    checkMobileStatus() {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth < 768;
      
      if (!this.isMobile && wasMobile) {
        this.isCompact = false;
      }
      else if (this.isMobile && !wasMobile && this.showInstallButton) {
        this.startCompactTimer();
      }
    },
    startCompactTimer() {
      if (this.isMobile) {
        setTimeout(() => {
          this.isCompact = true;
        }, 5000);
      }
    },
    handleResize() {
      this.checkMobileStatus();
    }
  },
  unmounted() {
    // Limpiar el event listener
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<template>
  <div 
    v-if="showInstallButton" 
    :class="[
      'fixed z-50 transition-all duration-500',
      isMobile && isCompact ? 'top-3 right-3' : 'bottom-20 left-1/2 transform -translate-x-1/2'
    ]"
  >
    <button
      @click="installPWA"
      :class="[
        'bg-celeste text-azul font-bold rounded-full shadow-lg flex items-center gap-2 hover:brightness-125 transition',
        isMobile && isCompact ? 'p-2' : 'px-6 py-3'
      ]"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span v-if="!(isMobile && isCompact)">Instalar RhinoFit</span>
    </button>
  </div>
</template> 