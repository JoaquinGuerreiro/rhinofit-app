<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import ProfileData from '../../components/profile/ProfileData.vue';
import SkeletonLoader from '../../components/SkeletonLoader.vue';
import FeedbackMessage from '../../components/FeedbackMessage.vue';
import { subscribeToAuth, logout } from '../../services/auth';
import DeleteAccountModal from '../../components/DeleteAccountModal.vue';

let unsubscribeFromAuth = () => {};

export default {
    name: 'MyProfile',
    components: { BaseHeading1, SkeletonLoader, ProfileData, FeedbackMessage, DeleteAccountModal },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                bio: null,
                training: null,
                photoURL: null,
                fullProfileLoaded: false,
                type: null,
                premiumExpiresAt: null,
            },
            showFeedback: false,
            feedbackMessage: '',
            showDeleteModal: false,
        }
    },
    mounted() {
        unsubscribeFromAuth = subscribeToAuth(newUserData => this.loggedUser = newUserData);
        this.handleFeedback();
    },
    watch: {
        '$route'() {
            this.handleFeedback();
        }
    },
    unmounted() {
        unsubscribeFromAuth();
    },
    methods: {
        async handleLogout() {
            try {
                await logout();
                this.$router.push('/iniciar-sesion');
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        },
        handleFeedback() {
            const editType = this.$route.query.edit;
            if (editType) {
                this.showFeedback = true;
                this.feedbackMessage = editType === 'profile' 
                    ? '¡Tu perfil ha sido actualizado!' 
                    : editType === 'photo'
                        ? '¡Tu foto de perfil ha sido actualizada!'
                        : '¡Tu contraseña ha sido actualizada!';
                
                this.$router.replace({ 
                    path: this.$route.path,
                    query: {} 
                });
            }
        },
        handleAccountDeleted() {
            this.$router.push('/');
        }
    }
}
</script>

<template>
    <div class="relative h-full pb-20 md:pb-0">

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

        <!-- Contenido de mi perfil -->
        <div class="max-w-4xl mx-auto px-4 py-8">
            <!-- Contenedor principal -->
            <div>
                <!-- Contenedor -->
                <div class="w-full md:w-fit mx-auto">
                    <BaseHeading1 class="mb-8 text-center md:text-left">Mi Perfil</BaseHeading1>

                    <div class="flex flex-wrap gap-4 mb-8 justify-center md:justify-start">
                        <router-link
                            class="text-celeste transition brightness-125 hover:brightness-100 font-semibold"
                            to="/mi-perfil/editar"
                        >Editar Perfil</router-link>
                        <router-link
                            class="text-celeste transition brightness-125 hover:brightness-100 font-semibold"
                            to="/mi-perfil/editar/foto"
                        >Editar mi Foto</router-link>
                        <router-link
                            class="text-celeste transition brightness-125 hover:brightness-100 font-semibold"
                            to="/mi-perfil/cambiar-password"
                        >Cambiar Contraseña</router-link>
                    </div>

                    <!-- Contenedor del perfil y separador -->
                    <div class="flex flex-col items-center">
                        <!-- Card del perfil -->
                        <div class="bg-black/40 backdrop-blur-md rounded-xl p-6 w-full md:w-fit max-w-full">
                            <div class="flex flex-col lg:flex-row gap-6 items-center ">
                                <!-- Foto de perfil -->
                                <div class="w-full lg:w-auto flex justify-center shrink-0">
                                    <div class="aspect-square w-full max-w-[240px] min-w-[200px] overflow-hidden rounded-xl">
                                        <template v-if="!loggedUser.fullProfileLoaded">
                                            <SkeletonLoader class="w-full h-full" />
                                        </template>
                                        <template v-else>
                                            <img 
                                                v-if="loggedUser.photoURL" 
                                                :src="loggedUser.photoURL" 
                                                :alt="loggedUser.displayName"
                                                class="w-full h-full object-cover"
                                            >
                                            <div 
                                                v-else 
                                                class="w-full h-full bg-white/10 flex items-center justify-center text-white/50"
                                            >
                                                Sin foto
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <!-- Información del perfil -->
                                <div class="w-full lg:w-auto lg:min-w-[300px] text-white break-words">
                                    <template v-if="!loggedUser.fullProfileLoaded">
                                        <div class="space-y-4">
                                            <SkeletonLoader class="h-8 w-3/4" />
                                            <div class="space-y-2">
                                                <SkeletonLoader class="h-6 w-1/4" />
                                                <SkeletonLoader class="h-6 w-1/2" />
                                            </div>
                                            <div class="space-y-2">
                                                <SkeletonLoader class="h-6 w-1/4" />
                                                <SkeletonLoader class="h-6 w-3/4" />
                                            </div>
                                            <div class="space-y-2">
                                                <SkeletonLoader class="h-6 w-1/4" />
                                                <SkeletonLoader class="h-6 w-2/3" />
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <h2 class="text-2xl font-bold mb-3 break-words">{{ loggedUser.displayName }}</h2>
                                        <div class="space-y-4">
                                            <div>
                                                <h3 class="text-celeste font-semibold mb-1">Email</h3>
                                                <p class="break-words">{{ loggedUser.email }}</p>
                                            </div>
                                            <div>
                                                <h3 class="text-celeste font-semibold mb-1">Biografía</h3>
                                                <p class="break-words">{{ loggedUser.bio || 'Sin biografía' }}</p>
                                            </div>
                                            <div>
                                                <h3 class="text-celeste font-semibold mb-1">Entrenamiento</h3>
                                                <p class="break-words">{{ loggedUser.training || 'Sin información de entrenamiento' }}</p>
                                            </div>
                                            <div>
                                                <h3 class="text-celeste font-semibold mb-1">Membresía</h3>
                                                <p class="break-words">
                                                    <template v-if="loggedUser.type === 'entrenador'">
                                                        Entrenador
                                                    </template>
                                                    <template v-else>
                                                        {{ loggedUser.type === 'premium' ? 'Premium' : 'Básico' }}
                                                        <span v-if="loggedUser.type === 'premium' && loggedUser.premiumExpiresAt" class="text-white/60">
                                                            hasta el {{ new Date(loggedUser.premiumExpiresAt).toLocaleDateString('es-AR', {
                                                                day: 'numeric',
                                                                month: 'numeric',
                                                                year: 'numeric'
                                                            }) }}
                                                        </span>
                                                    </template>
                                                </p>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- Botones de acción con el mismo ancho que la card -->
                        <div class="w-full mt-8 pt-8 border-t border-white/10">
                            <div class="flex flex-col xs:flex-row gap-4">
                                <button
                                    @click="handleLogout"
                                    class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Cerrar Sesión
                                </button>

                                <button
                                    @click="showDeleteModal = true"
                                    class="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar Cuenta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <FeedbackMessage
            v-if="showFeedback"
            :message="feedbackMessage"
            @close="showFeedback = false"
        />

        <DeleteAccountModal 
            v-if="showDeleteModal"
            @close="showDeleteModal = false"
            @account-deleted="handleAccountDeleted"
        />
    </div>
</template>

<style scoped>
/* Aseguramos que todo el texto largo se rompa correctamente */
.break-words {
    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
}
</style>