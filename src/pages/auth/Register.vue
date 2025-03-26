<script>
import BaseButton from '../../components/BaseButton.vue';
import BaseHeading1 from '../../components/BaseHeading1.vue';
import Loader from '../../components/Loader.vue';
import FormError from '../../components/FormError.vue';
import { register } from '../../services/auth';

export default {
    name: 'Register',
    components: { BaseHeading1, BaseButton, Loader, FormError },
    data() {
        return {
            user: {
                email: '',
                password: '',
                confirmPassword: '',
                displayName: '',
            },
            loading: false,
            error: null
        };
    },
    methods: {
        // Validaciones
        validateForm() {
            if (!this.user.displayName) {
                this.error = 'Por favor, ingresá tu nombre';
                return false;
            }
            if (this.user.displayName.length < 2) {
                this.error = 'El nombre debe tener al menos 2 caracteres';
                return false;
            }
            if (!this.user.email) {
                this.error = 'Por favor, ingresá tu email';
                return false;
            }
            if (!this.user.password) {
                this.error = 'Por favor, ingresá una contraseña';
                return false;
            }
            if (this.user.password.length < 6) {
                this.error = 'La contraseña debe tener al menos 6 caracteres';
                return false;
            }
            if (this.user.password !== this.user.confirmPassword) {
                this.error = 'Las contraseñas no coinciden';
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
                await register({
                    ...this.user,
                });
                this.$router.push('/');
            } catch (error) {
                this.error = error.message;
            }

            this.loading = false;
        }
    }
}
</script>

<template>
    <div class="relative min-h-screen flex items-center justify-center py-20">
        
        <!-- Background  -->
        <div class="fixed top-0 left-0 w-full h-screen -z-10">
            <div 
                class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/hombre_bici-register.webp')"
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
        <div class="w-full max-w-md mx-auto px-4">
            <div class="bg-black/40 backdrop-blur-md p-8 rounded-xl">
                <BaseHeading1 class="text-center mb-8">Crear tu Cuenta</BaseHeading1>

                <form 
                    action="#"
                    @submit.prevent="handleSubmit"
                    class="space-y-6"
                >
                    <FormError 
                        v-if="error"
                        :message="error"
                    />

                    <div>
                        <label class="block mb-2 text-white" for="displayName">Nombre</label>
                        <input
                            type="text"
                            id="displayName"
                            class="w-full p-3 border bg-white/10 border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors"
                            :readonly="loading"
                            v-model="user.displayName"
                            placeholder="Tu nombre"
                            required
                        >
                    </div>
                    <div>
                        <label class="block mb-2 text-white" for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            class="w-full p-3 border bg-white/10 border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors"
                            :readonly="loading"
                            v-model="user.email"
                            placeholder="tucorreo@ejemplo.com"
                            required
                        >
                    </div>
                    <div>
                        <label class="block mb-2 text-white" for="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            class="w-full p-3 border bg-white/10 border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors"
                            :readonly="loading"
                            v-model="user.password"
                            placeholder="••••••••"
                        >
                    </div>
                    <div>
                        <label class="block mb-2 text-white" for="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            class="w-full p-3 border bg-white/10 border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors"
                            :readonly="loading"
                            v-model="user.confirmPassword"
                            placeholder="••••••••"
                        >
                    </div>
                    <BaseButton 
                        class="w-full py-3 rounded-lg transition-all"
                        :disabled="loading"
                    >
                        <span v-if="!loading">
                            Crear Cuenta
                        </span>
                        <Loader v-else />
                    </BaseButton>
                </form>

                <div class="mt-6 text-center text-white">
                    <p>¿Ya tenés una cuenta? 
                        <router-link 
                            to="/iniciar-sesion" 
                            class="text-celeste hover:brightness-125 transition-colors"
                        >
                            Ingresá
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>