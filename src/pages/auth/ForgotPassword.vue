<script>
import BaseButton from '../../components/BaseButton.vue';
import BaseHeading1 from '../../components/BaseHeading1.vue';
import Loader from '../../components/Loader.vue';
import FormError from '../../components/FormError.vue';
import { resetPassword } from '../../services/auth';

export default {
    name: 'ForgotPassword',
    components: { BaseHeading1, BaseButton, Loader, FormError },
    data() {
        return {
            email: '',
            loading: false,
            error: null,
            emailSent: false
        };
    },
    methods: {
        // Validaciones
        validateForm() {
            if (!this.email) {
                this.error = 'Por favor, ingresá tu email';
                return false;
            }
            return true;
        },

        // Enviar formulario
        async handleSubmit() {
            if(this.loading) return;
            
            this.error = null;
            
            if (!this.validateForm()) return;

            this.loading = true;

            try {
                await resetPassword(this.email);
                this.emailSent = true;
            } catch (error) {
                this.error = error.message;
            }

            this.loading = false;
        }
    }
}
</script>

<template>
    <div class="relative min-h-screen">

        <!-- Background  -->
        <div class="fixed top-0 left-0 w-full h-screen -z-10">
            <div 
                class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/hombre_espalda-banner.webp')"
                role="presentation"
                aria-hidden="true"
            ></div>
            <div 
                class="absolute inset-0 backdrop-blur-[2px] bg-black/20"
                role="presentation"
                aria-hidden="true"
            ></div>
        </div>

        <!-- Formulario -->
        <div class="max-w-4xl mx-auto px-4 py-8">
            <div class="flex items-center gap-4 mb-8">
                <button 
                    @click="$router.back()"
                    class="text-white hover:text-celeste transition-colors"
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <BaseHeading1>Recuperar Contraseña</BaseHeading1>
            </div>

            <div class="bg-black/40 backdrop-blur-md rounded-xl p-6">
                <div v-if="!emailSent" class="max-w-xl mx-auto">
                    <p class="text-white mb-6">
                        Ingresá tu email y te enviaremos las instrucciones para recuperar tu contraseña.
                    </p>

                    <form 
                        @submit.prevent="handleSubmit"
                        class="space-y-6"
                    >
                        <FormError 
                            v-if="error"
                            :message="error"
                        />

                        <div>
                            <label class="block mb-2 text-white" for="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                v-model="email"
                                class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors read-only:bg-white/5"
                                :readonly="loading"
                                placeholder="tucorreo@ejemplo.com"
                                required
                            >
                        </div>

                        <BaseButton 
                            class="w-full py-3 rounded-lg transition-all"
                            :disabled="loading"
                        >
                            <span v-if="!loading">Enviar Instrucciones</span>
                            <Loader v-else />
                        </BaseButton>
                    </form>
                </div>

                <div v-else class="max-w-xl mx-auto text-center">
                    <div class="text-celeste mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                    </div>
                    <p class="text-white mb-6">
                        Te hemos enviado un email con las instrucciones para recuperar tu contraseña. Por favor, revisá tu bandeja de entrada.
                    </p>
                    <router-link 
                        to="/iniciar-sesion"
                        class="text-celeste hover:brightness-125 transition-colors"
                    >
                        Volver al inicio de sesión
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template> 