<script>
import BaseButton from '../../components/BaseButton.vue';
import BaseHeading1 from '../../components/BaseHeading1.vue';
import Loader from '../../components/Loader.vue';
import { editMyProfilePhoto } from '../../services/auth';

export default {
    name: 'MyProfileEditPhoto',
    components: { BaseHeading1, BaseButton, Loader },
    data() {
        return {
            editing: false,
            editData: {
                photo: null,
                photoPreview: null,
            }
        }
    },
    methods: {
        async handleSubmit() {
            if (!this.editData.photo) return;
            
            this.editing = true;

            try {
                await editMyProfilePhoto(this.editData.photo);
                this.$router.push('/mi-perfil?edit=photo');
            } catch (error) {
                console.error('[MyProfileEditPhoto handleSubmit] Error al actualizar la foto: ', error);
            }

            this.editing = false;
        },


        handleFileSelection(ev) {
            this.editData.photo = ev.target.files[0];

            const reader = new FileReader();

            reader.addEventListener('load', () => {
                this.editData.photoPreview = reader.result;
            });

            reader.readAsDataURL(this.editData.photo);
        },
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

        <!-- Contenido de editar foto de perfil -->
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
                <BaseHeading1>Editar mi Foto de Perfil</BaseHeading1>
            </div>

            <div class="bg-black/40 backdrop-blur-md rounded-xl p-6">
                <div class="flex flex-col md:flex-row gap-8">
                    <form 
                        class="w-full md:w-1/2"
                        action="#"
                        @submit.prevent="handleSubmit"
                    >
                        <div class="mb-6">
                            <label class="block mb-2 text-white" for="photo">Nueva Foto</label>
                            <input
                                type="file"
                                id="photo"
                                accept="image/*"
                                class="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-celeste file:text-white hover:file:brightness-125 file:transition-all"
                                @change="handleFileSelection"
                            >
                        </div>
                        <BaseButton 
                            class="w-full py-3 rounded-lg transition-all"
                        >
                            <span v-if="!editing">Actualizar mi Foto</span>
                            <Loader v-else />
                        </BaseButton>
                    </form>

                    <div class="w-full md:w-1/2">
                        <h2 class="text-xl text-white mb-4">Previsualización</h2>
                        <div class="aspect-square bg-white/10 rounded-xl overflow-hidden">
                            <img
                                v-if="editData.photoPreview"
                                :src="editData.photoPreview"
                                alt=""
                                class="w-full h-full object-cover"
                            >
                            <div 
                                v-else
                                class="w-full h-full flex items-center justify-center text-white/50"
                            >
                                Selecciona una imagen para ver la previsualización
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>