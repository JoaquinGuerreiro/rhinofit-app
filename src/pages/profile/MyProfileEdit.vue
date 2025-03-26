<script>
import { readonly } from 'vue';
import BaseButton from '../../components/BaseButton.vue';
import BaseHeading1 from '../../components/BaseHeading1.vue';
import Loader from '../../components/Loader.vue';
import { editMyProfile, subscribeToAuth } from '../../services/auth';

let unsubscribeFromAuth = () => {};

export default {
    name: 'MyProfileEdit',
    components: { BaseHeading1, BaseButton, Loader },
    data() {
        return {
            editData: {
                displayName: '',
                bio: '',
                training: '',
            },
            editing: false,
            showFeedback: false
        }
    },
    methods: {
        async handleSubmit() {
            if(this.editing) return;

            this.editing = true;

            try {
                await editMyProfile({...this.editData});
                this.$router.push('/mi-perfil?edit=profile');
            } catch (error) {
                console.error('[MyProfileEdit handleSubmit] Error al editar el perfil: ', error);
            }

            this.editing = false;
        }
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuth(userData => this.editData = {
            displayName: userData.displayName || '',
            bio: userData.bio || '',
            training: userData.training || '',
        });
    },
    unmounted() {
        unsubscribeFromAuth();
    },
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

        <!-- Contenido de editar perfil -->
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
                <BaseHeading1>Editar mi Perfil</BaseHeading1>
            </div>

            <div class="bg-black/40 backdrop-blur-md rounded-xl p-6">
                <form 
                    action="#"
                    @submit.prevent="handleSubmit"
                    class="space-y-6"
                >
                    <div>
                        <label class="block mb-2 text-white" for="displayName">Nombre de Usuario</label>
                        <input
                            type="text"
                            id="displayName"
                            class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors read-only:bg-white/5"
                            :readonly="editing"
                            v-model="editData.displayName"
                            required
                        >
                    </div>

                    <div>
                        <label class="block mb-2 text-white" for="bio">Biografía</label>
                        <textarea
                            id="bio"
                            class="w-full min-h-[120px] p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors read-only:bg-white/5"
                            :readonly="editing"
                            v-model="editData.bio"
                            maxlength="300"
                        ></textarea>
                    </div>

                    <div>
                        <label class="block mb-2 text-white" for="training">Entrenamiento</label>
                        <input
                            type="text"
                            id="training"
                            class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-celeste transition-colors read-only:bg-white/5"
                            :readonly="editing"
                            v-model="editData.training"
                        >
                    </div>

                    <BaseButton 
                        class="w-full py-3 rounded-lg transition-all"
                    >
                        <span v-if="!editing">Actualizar mi Perfil</span>
                        <Loader v-else />
                    </BaseButton>
                </form>
            </div>
        </div>
    </div>
</template>