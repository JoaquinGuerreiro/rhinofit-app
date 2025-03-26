<script>
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../services/firebase';
import BaseButton from '../../components/BaseButton.vue';
import BaseHeading1 from '../../components/BaseHeading1.vue';
import Loader from '../../components/Loader.vue';
import FormError from '../../components/FormError.vue';

export default {
    name: 'NewPassword',
    components: { BaseHeading1, BaseButton, Loader, FormError },
    props: {
        mode: String,
        oobCode: String,
        apiKey: String
    },
    data() {
        return {
            newPassword: '',
            confirmPassword: '',
            loading: false,
            error: null,
            success: false
        };
    },
    methods: {
        async handleResetPassword() {
            if (this.newPassword !== this.confirmPassword) {
                this.error = 'Las contraseñas no coinciden';
                return;
            }

            this.loading = true;
            this.error = null;

            try {
                await confirmPasswordReset(auth, this.oobCode, this.newPassword);
                this.success = true;
                setTimeout(() => {
                    this.$router.push('/iniciar-sesion');
                }, 3000);
            } catch (error) {
                console.error('Error al restablecer contraseña:', error);
                this.error = 'Error al restablecer la contraseña. Por favor, solicita un nuevo enlace.';
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<template>
    <div class="relative min-h-screen">

        <div 
            class="fixed top-0 left-0 w-full h-screen -z-10 bg-cover bg-center bg-no-repeat"
            style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/hombre_espalda-banner.webp')"
            role="presentation"
            aria-hidden="true"
        ></div>
        
        <div class="max-w-4xl mx-auto px-4 py-8">
            <div class="bg-black/40 backdrop-blur-md rounded-xl p-6">
                <div class="max-w-xl mx-auto">
                    <BaseHeading1 class="text-center mb-8">
                        Restablecer Contraseña
                    </BaseHeading1>

                    <form v-if="!success" @submit.prevent="handleResetPassword" class="space-y-6">
                        <div>
                            <input
                                v-model="newPassword"
                                type="password"
                                class="w-full bg-black/40 text-white border border-celeste rounded-lg px-4 py-2"
                                :readonly="loading"
                                placeholder="Nueva contraseña"
                                required
                            >
                        </div>

                        <div>
                            <input
                                v-model="confirmPassword"
                                type="password"
                                class="w-full bg-black/40 text-white border border-celeste rounded-lg px-4 py-2"
                                :readonly="loading"
                                placeholder="Confirmar nueva contraseña"
                                required
                            >
                        </div>

                        <FormError v-if="error" :message="error" />

                        <BaseButton
                            type="submit"
                            :loading="loading"
                            class="w-full"
                        >
                            Cambiar Contraseña
                        </BaseButton>
                    </form>

                    <div v-else class="text-center text-white">
                        <p class="mb-4">¡Contraseña actualizada exitosamente!</p>
                        <p>Serás redirigido al inicio de sesión...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template> 