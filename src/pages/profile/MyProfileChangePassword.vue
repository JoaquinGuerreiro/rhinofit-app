<script>
import BaseButton from '../../components/BaseButton.vue';
import BaseHeading1 from '../../components/BaseHeading1.vue';
import Loader from '../../components/Loader.vue';
import FormError from '../../components/FormError.vue';
import { changePassword } from '../../services/auth';

export default {
    name: 'ChangePassword',
    components: { BaseHeading1, BaseButton, Loader, FormError },
    data() {
        return {
            passwords: {
                current: '',
                new: '',
                confirm: ''
            },
            loading: false,
            error: null
        };
    },
    methods: {
        validateForm() {
            if (!this.passwords.current) {
                this.error = 'Por favor, ingresá tu contraseña actual';
                return false;
            }
            if (!this.passwords.new) {
                this.error = 'Por favor, ingresá la nueva contraseña';
                return false;
            }
            if (this.passwords.new.length < 6) {
                this.error = 'La contraseña debe tener al menos 6 caracteres';
                return false;
            }
            if (this.passwords.new !== this.passwords.confirm) {
                this.error = 'Las contraseñas no coinciden';
                return false;
            }
            return true;
        },
        async handleSubmit() {
            if(this.loading) return;
            
            this.error = null;
            
            if (!this.validateForm()) return;

            this.loading = true;

            try {
                await changePassword(this.passwords.current, this.passwords.new);
                this.$router.push('/mi-perfil?edit=password');
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

        <!-- Background -->
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

        <!-- Contenido de cambiar contraseña -->
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
                <BaseHeading1>Cambiar Contraseña</BaseHeading1>
            </div>

            <div class="bg-black/40 backdrop-blur-md rounded-xl p-6">
                <form 
                    @submit.prevent="handleSubmit"
                    class="space-y-6 max-w-xl mx-auto"
                >
                    <FormError 
                        v-if="error"
                        :message="error"
                    />

                    <div>
                        <label class="block mb-2 text-white" for="current">Contraseña Actual</label>
                        <input
                            type="password"
                            id="current"
                            v-model="passwords.current"
                            class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors read-only:bg-white/5"
                            :readonly="loading"
                            placeholder="••••••••"
                            required
                        >
                    </div>

                    <div>
                        <label class="block mb-2 text-white" for="new">Nueva Contraseña</label>
                        <input
                            type="password"
                            id="new"
                            v-model="passwords.new"
                            class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors read-only:bg-white/5"
                            :readonly="loading"
                            placeholder="••••••••"
                            required
                        >
                    </div>

                    <div>
                        <label class="block mb-2 text-white" for="confirm">Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            id="confirm"
                            v-model="passwords.confirm"
                            class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors read-only:bg-white/5"
                            :readonly="loading"
                            placeholder="••••••••"
                            required
                        >
                    </div>

                    <BaseButton 
                        class="w-full py-3 rounded-lg transition-all"
                        :disabled="loading"
                    >
                        <span v-if="!loading">Cambiar Contraseña</span>
                        <Loader v-else />
                    </BaseButton>
                </form>
            </div>
        </div>
    </div>
</template> 