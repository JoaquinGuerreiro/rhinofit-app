<script>
import BaseHeading1 from '../../components/BaseHeading1.vue';
import ProfileData from '../../components/profile/ProfileData.vue';
import SkeletonLoader from '../../components/SkeletonLoader.vue';
import { getUserProfileById } from '../../services/user-profiles';
import { subscribeToUnreadMessagesByUser } from '../../services/notifications';
import { subscribeToAuth } from '../../services/auth';

export default {
    name: 'PremiumUserProfile',
    components: { BaseHeading1, SkeletonLoader, ProfileData },
    data() {
        return {
            user: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null,
                bio: null,
                training: null,
            },
            loading: true,
            unreadMessages: {},
            unsubscribeFromUnread: null
        }
    },
    methods: {
        async fetchUser() {
            this.user = await getUserProfileById(this.$route.params.id);
            this.loading = false;
        }
    },
    async mounted() {
        this.user = await getUserProfileById(this.$route.params.id);
        this.loading = false;
        subscribeToAuth((userData) => {
            if (userData?.id) {
                this.unsubscribeFromUnread = subscribeToUnreadMessagesByUser(
                    userData.id,
                    (unreadByUser) => {
                        this.unreadMessages = unreadByUser;
                    }
                );
            }
        });
    },
    unmounted() {
        if (this.unsubscribeFromUnread) {
            this.unsubscribeFromUnread();
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
                style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/entrenadora-trainers.webp')"
                role="presentation"
                aria-hidden="true"
            ></div>
            <div 
                class="absolute inset-0 backdrop-blur-[2px] bg-black/20"
                role="presentation"
                aria-hidden="true"
            ></div>
        </div>

        <!-- Contenido del perfil -->
        <div class="max-w-4xl mx-auto px-1 md:px-4 py-8">
            <div>
                <div class="w-full md:w-fit mx-auto">
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
                        <BaseHeading1>Perfil de {{ user.displayName }}</BaseHeading1>
                    </div>

                    <div class="bg-black/40 backdrop-blur-md rounded-xl p-6 w-full md:w-fit max-w-full">
                        <div class="flex flex-col md:flex-row gap-6 items-start">
                            <!-- Foto de perfil -->
                            <div class="w-full md:w-auto">
                                <div class="aspect-square w-full max-w-[240px] mx-auto overflow-hidden rounded-xl">
                                    <template v-if="loading">
                                        <SkeletonLoader class="w-full h-full" />
                                    </template>
                                    <template v-else>
                                        <img 
                                            v-if="user.photoURL" 
                                            :src="user.photoURL" 
                                            :alt="user.displayName"
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
                            <div class="w-full md:w-auto min-w-[300px] text-white">
                                <template v-if="loading">
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
                                    </div>
                                </template>
                                <template v-else>
                                    <h2 class="text-2xl font-bold mb-3">{{ user.displayName }}</h2>
                                    <div class="space-y-4">
                                        <div>
                                            <h3 class="text-celeste font-semibold mb-1">Biografía</h3>
                                            <p>{{ user.bio || 'Sin biografía' }}</p>
                                        </div>
                                        <div>
                                            <h3 class="text-celeste font-semibold mb-1">Entrenamiento</h3>
                                            <p>{{ user.training || 'Sin información de entrenamiento' }}</p>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 pt-8 border-t border-white/10">
                        <router-link 
                            class="relative inline-flex"
                            :to="`/usuarios-premium/${user.id}/chat`"
                        >
                        <button class="w-full text-celeste font-semibold transition brightness-125 hover:brightness-100 bg-celeste/10 rounded-lg py-2 px-4 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chatear con {{ user.displayName }}
                        </button>
                            <span 
                                v-if="unreadMessages[user.id]"
                                class="bg-red-500 text-white text-sm font-semibold rounded-full min-w-[24px] h-6 flex items-center justify-center px-1 shadow-lg shadow-red-500/20 animate-pulse"
                            >
                                {{ unreadMessages[user.id] }}
                            </span>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
