<script>
import BaseButton from '../../components/BaseButton.vue';
import BaseHeading1 from '../../components/BaseHeading1.vue';
import Loader from '../../components/Loader.vue';
import FormError from '../../components/FormError.vue';
import { login } from '../../services/auth';

export default {
    name: 'Login',
    components: { BaseHeading1, BaseButton, Loader, FormError },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
            error: null
        };
    },
    methods: {
        // Validaciones
        validateForm() {
            if (!this.user.email) {
                this.error = 'Por favor, ingresá tu email';
                return false;
            }
            if (!this.user.password) {
                this.error = 'Por favor, ingresá tu contraseña';
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
                await login({
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

        <!-- Background con blur -->
        <div class="fixed top-0 left-0 w-full h-screen -z-10">
            <div 
                class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/mujer_dorsalera-login.webp')"
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
                <BaseHeading1 class="text-center mb-8">Ingresar a tu Cuenta</BaseHeading1>

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
                        <label class="block mb-2 text-white" for="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            class="w-full p-3 border bg-white/10 border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors"
                            :readonly="loading"
                            v-model="user.email"
                            placeholder="tucorreo@ejemplo.com"
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
                    <BaseButton 
                        class="w-full py-3 rounded-lg transition-all"
                        :disabled="loading"
                    >
                        <span v-if="!loading">
                            Ingresar
                        </span>
                        <Loader v-else />
                    </BaseButton>
                </form>

                <div class="mt-6 text-center text-white space-y-4">
                    <p>¿No tenés una cuenta? 
                        <router-link 
                            to="/registro" 
                            class="text-celeste hover:brightness-125 transition-colors"
                        >
                            Registrate
                        </router-link>
                    </p>
                    <p>
                        <router-link 
                            to="/recuperar-password" 
                            class="text-celeste hover:brightness-125 transition-colors"
                        >
                            ¿Olvidaste tu contraseña?
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>