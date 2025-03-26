<script>
import Home from './pages/HomeLogged.vue';
import { logout, subscribeToAuth } from './services/auth';
import { subscribeToUnreadMessages } from './services/notifications';
import { initializePushNotifications } from './services/push-notifications';
import PWAInstallPrompt from './components/PWAInstallPrompt.vue'

export default {
    name: 'App',
    components: { Home, PWAInstallPrompt },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
            },
            isDropdownOpen: false,
            chatView: false,
            showMenu: false,
            unreadCount: 0,
            unsubscribeFromUnread: null
        };
    },
    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        handleLogout() {
            this.isDropdownOpen = false;
            logout();
            this.$router.push('/iniciar-sesion');
        }
    },
    mounted() {
        console.log('App mounted, suscribiendo a auth...');
        subscribeToAuth(async newUserData => {
            console.log('Auth data recibida:', newUserData);
            this.loggedUser = newUserData;
            
            // Suscribirse a mensajes no leídos cuando el usuario está autenticado
            if (newUserData?.id) {
                console.log('Suscribiendo a notificaciones para usuario:', newUserData.id);
                
                // Inicializar notificaciones push
                await initializePushNotifications(newUserData.id);
                
                if (this.unsubscribeFromUnread) {
                    this.unsubscribeFromUnread();
                }
                this.unsubscribeFromUnread = subscribeToUnreadMessages(
                    newUserData.id,
                    ({ total }) => {
                        console.log('Notificaciones recibidas:', total);
                        this.unreadCount = total;
                    }
                );
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.relative')) {
                this.isDropdownOpen = false;
            }
        });
    },
    unmounted() {
        if (this.unsubscribeFromUnread) {
            console.log('Desuscribiendo de notificaciones');
            this.unsubscribeFromUnread();
        }
    },
    watch: {
        '$route'(to) {
            // Verificar si estamos en la ruta de chat para ocultar el nav
            this.chatView = to.name === 'trainer.profile.chat' || to.name === 'premium-user-profile.chat';
        }
    }
}
</script>

<template>
    <div class="min-h-screen">
        <!-- Header principal que contiene toda la navegación, para ocultarla en la vista de chat -->
        <header v-if="!chatView">

            <!-- Imagotipo de RhinoFit -->
            <div class="md:hidden fixed top-0 w-full h-14 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <router-link 
                    :to="{name: 'home'}" 
                    class="w-64 h-12 bg-contain bg-no-repeat bg-center"
                    style="background-image: url('/imgs/imagotipo_celeste.png')"
                >
                    <span class="sr-only">RhinoFit</span>
                </router-link>
            </div>

            <!-- Nav para desktop -->
            <nav class="hidden md:flex justify-between items-center p-4 bg-black/80 backdrop-blur-sm fixed w-full top-0 z-50">
                <router-link 
                    :to="{name: 'home'}" 
                    class="w-72 h-14 bg-contain bg-no-repeat bg-center hover:brightness-125 transition-all"
                    style="background-image: url('/imgs/imagotipo_celeste.png')"
                >
                    <span class="sr-only">RhinoFit</span>
                </router-link>

                <ul class="flex items-center gap-4 text-celeste font-semibold">
                    <li>
                        <router-link 
                            class="px-4 py-2 hover:brightness-125 transition-colors"
                            :class="{ 'brightness-200': $route.name && ['home', 'home.logged', 'home.not-logged'].includes($route.name) }"
                            :to="loggedUser.id !== null ? { name: 'home.logged' } : { name: 'home.not-logged' }"
                        >Home</router-link>
                    </li>

                    <!-- Navegación para usuarios logueados -->
                    <template v-if="loggedUser.id !== null">
                        <li>
                            <router-link 
                                class="px-4 py-2 hover:brightness-125 transition-colors"
                                :class="{ 'brightness-200': $route.path.includes('/generador') }"
                                to="/generador"
                            >Generador</router-link>
                        </li>

                        <li>
                            <router-link 
                                class="px-4 py-2 hover:brightness-125 transition-colors"
                                :class="{ 'brightness-200': $route.path.includes('/rutinas') }"
                                to="/rutinas"
                            >Mis Rutinas</router-link>
                        </li>

                        <!-- Navegación para entrenadores / usuarios -->
                        <li v-if="loggedUser.type !== 'entrenador'">
                            <router-link 
                                to="/entrenadores"
                                class="px-4 py-2 hover:brightness-125 transition-colors relative"
                                :class="{ 'brightness-200': $route.path.includes('/entrenadores') }"
                            >
                                Entrenadores
                                <span 
                                    v-if="unreadCount > 0"
                                    class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                                >
                                    {{ unreadCount }}
                                </span>
                            </router-link>
                        </li>
                        <li v-if="loggedUser.type === 'entrenador'">
                            <router-link 
                                to="/usuarios-premium"
                                class="px-4 py-2 hover:brightness-125 transition-colors relative"
                                :class="{ 'brightness-200': $route.path.includes('/usuarios-premium') }"
                            >
                                Alumnos
                                <span 
                                    v-if="unreadCount > 0"
                                    class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                                >
                                    {{ unreadCount }}
                                </span>
                            </router-link>
                        </li>

                        <!-- Dropdown -->
                        <li class="relative">
                            <button
                                @click="toggleDropdown"
                                class="flex items-center px-4 py-2 hover:brightness-125 transition-colors"
                                type="button"
                            >
                                {{ loggedUser.displayName }}
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke-width="1.5" 
                                    stroke="currentColor" 
                                    class="w-4 h-4 ml-1 transition-transform duration-200"
                                    :class="{ 'rotate-180': isDropdownOpen }"
                                    aria-hidden="true"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            <div 
                                v-show="isDropdownOpen"
                                class="absolute right-0 mt-2 w-48 bg-black/70 rounded-lg shadow-lg py-1"
                            >
                                <router-link 
                                    to="/mi-perfil"
                                    class="block px-4 py-2 text-sm hover:bg-black text-celeste brightness-110 hover:brightness-200 transition-colors"
                                >
                                    Mi Perfil
                                </router-link>
                                <button
                                    @click="handleLogout"
                                    class="block w-full text-left px-4 py-2 text-sm hover:bg-black/50 text-rose-400 hover:brightness-150 transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </li>
                    </template>

                    <!-- Navegación para usuarios no logueados -->
                    <template v-else>
                        <li>
                            <router-link 
                                to="/iniciar-sesion"
                                class="px-4 py-2 hover:brightness-125 transition-colors"
                                :class="{ 'brightness-200': $route.path.includes('/iniciar-sesion') }"
                            >
                                Iniciar Sesión
                            </router-link>
                        </li>
                        <li>
                            <router-link 
                                to="/registro"
                                class="px-6 py-2 bg-celeste text-azul rounded-lg hover:brightness-125 transition-all"
                                :class="{ 'brightness-200': $route.path.includes('/registro') }"
                            >
                                Registrarse
                            </router-link>
                        </li>
                    </template>
                </ul>
            </nav>

            <!-- Nav para móvil / tablet -->
            <nav class="md:hidden fixed bottom-0 w-full bg-black/80 backdrop-blur-sm border-t border-gray-800 z-50">
                <ul class="flex justify-around py-2">
                    <li>
                        <router-link 
                            :to="loggedUser.id !== null ? { name: 'home.logged' } : { name: 'home.not-logged' }"
                            class="flex flex-col items-center text-celeste transition-colors p-1 xs:px-4"
                            :class="{ 'text-celeste brightness-200': $route.name && ['home', 'home.logged', 'home.not-logged'].includes($route.name) }"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span class="text-xs mt-0.5 hidden xs:block">Home</span>
                        </router-link>
                    </li>

                    <!-- Navegación para usuarios logueados -->
                    <template v-if="loggedUser.id !== null">
                        <li>
                            <router-link 
                                to="/generador"
                                class="flex flex-col items-center text-celeste transition-colors p-1 xs:px-4"
                                :class="{ 'text-celeste brightness-200': $route.path.includes('/generador') }"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span class="text-xs mt-0.5 hidden xs:block">Generador</span>
                            </router-link>
                        </li>

                        <li>
                            <router-link 
                                to="/rutinas"
                                class="flex flex-col items-center text-celeste transition-colors p-1 xs:px-4"
                                :class="{ 'text-celeste brightness-200': $route.path.includes('/rutinas') }"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span class="text-xs mt-0.5 hidden xs:block">Tus Rutinas</span>
                            </router-link>
                        </li>

                        <!-- Navegación para entrenadores / usuarios -->
                        <li v-if="loggedUser.type !== 'entrenador'">
                            <router-link 
                                to="/entrenadores"
                                class="flex flex-col items-center text-celeste transition-colors p-1 xs:px-4 relative"
                                :class="{ 'text-celeste brightness-200': $route.path.includes('/entrenadores') }"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span class="text-xs mt-0.5 hidden xs:block">Entrenadores</span>
                                <span 
                                    v-if="unreadCount > 0"
                                    class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                                >
                                    {{ unreadCount }}
                                </span>
                            </router-link>
                        </li>
                        <li v-if="loggedUser.type === 'entrenador'">
                            <router-link 
                                to="/usuarios-premium"
                                class="flex flex-col items-center text-celeste transition-colors p-1 xs:px-4 relative"
                                :class="{ 'text-celeste brightness-200': $route.path.includes('/usuarios-premium') }"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span class="text-xs mt-0.5 hidden xs:block">Alumnos</span>
                                <span 
                                    v-if="unreadCount > 0"
                                    class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                                >
                                    {{ unreadCount }}
                                </span>
                            </router-link>
                        </li>

                        <li>
                            <router-link 
                                to="/mi-perfil"
                                class="flex flex-col items-center text-celeste transition-colors p-1 xs:px-4"
                                :class="{ 'text-celeste brightness-200': $route.path.includes('/mi-perfil') }"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span class="text-xs mt-0.5 hidden xs:block">Perfil</span>
                            </router-link>
                        </li>
                    </template>

                    <!-- Navegación para usuarios no logueados -->
                    <template v-else>
                        <li>
                            <router-link 
                                to="/iniciar-sesion"
                                class="flex flex-col items-center text-celeste transition-colors p-1 xs:px-4"
                                :class="{ 'text-celeste brightness-200': $route.path.includes('/iniciar-sesion') }"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                <span class="text-xs mt-0.5 hidden xs:block">Ingresar</span>
                            </router-link> 
                        </li>
                        <li>
                            <router-link 
                                to="/registro"
                                class="flex flex-col items-center text-celeste transition-colors p-1 xs:px-4"
                                :class="{ 'text-celeste brightness-200': $route.path.includes('/registro') }"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                <span class="text-xs mt-0.5 hidden xs:block">Registro</span>
                            </router-link>
                        </li>
                    </template>
                </ul>
            </nav>

            <!-- Menú Mobile -->
            <div v-if="showMenu" class="md:hidden fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
                <nav class="flex flex-col items-center gap-8 pt-24 text-xl text-white/80">
                    <!-- ... otros links ... -->
                    
                    <router-link 
                        v-if="loggedUser?.type === 'premium' || loggedUser?.type === 'basico'"
                        to="/entrenadores" 
                        class="relative hover:text-white transition-colors"
                        @click="showMenu = false"
                    >
                        Entrenadores
                        <span 
                            v-if="unreadCount > 0"
                            class="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                        >
                            {{ unreadCount }}
                        </span>
                    </router-link>

                    <router-link 
                        v-if="loggedUser?.type === 'entrenador'"
                        to="/usuarios-premium" 
                        class="relative hover:text-white transition-colors"
                        @click="showMenu = false"
                    >
                        Alumnos
                        <span 
                            v-if="unreadCount > 0"
                            class="absolute -top-3 -right-3 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                        >
                            {{ unreadCount }}
                        </span>
                    </router-link>

                    <!-- ... otros links ... -->
                </nav>
            </div>
        </header>

        <!-- Contenido principal -->
        <main class="md:pt-20 pt-14 pb-20 md:pb-0">
            <router-view></router-view>
        </main>
        <PWAInstallPrompt />
        
    </div>
</template>