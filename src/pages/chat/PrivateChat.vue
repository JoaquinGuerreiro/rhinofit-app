<template>
    <div class="fixed inset-0 flex">
        <!-- Chat List - Desktop -->
        <div class="hidden md:block w-[320px] h-full">
            <ChatList 
                :chats="chats"
                :selectedUserId="user?.id"
                @select-chat="handleChatSelect"
            />
        </div>

        <!-- Chat List - Mobile -->
        <div v-if="showMobileList" 
            class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 md:hidden">
            <div class="h-20 p-4 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-around">
                <h2 class="text-lg font-semibold text-celeste">Chats</h2>
                <button 
                    @click="showMobileList = false"
                    class="text-celeste/60 hover:text-celeste transition-colors">
                    <span class="sr-only">Cerrar</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="overflow-y-auto h-[calc(100vh-80px)] overscroll-contain">
                <ChatList 
                    :chats="chats"
                    :selectedUserId="user?.id"
                    @select-chat="handleMobileChatSelect"
                />
            </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col h-full ">
            <!-- Background -->
            <div class="absolute inset-0 -z-10">
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

            <!-- Chat Header -->
            <div class="h-[72px] md:h-20 flex items-center gap-4 p-4 bg-black/90 text-white z-10">
                <button 
                    @click="showMobileList = true"
                    class="md:hidden text-celeste hover:brightness-125 transition-colors">
                    <span class="sr-only">Menu</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                
                <!-- Flecha atrás -->
                <button 
                    @click="goBack"
                    class="text-celeste hover:brightness-125 transition-colors"
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>

                <!-- Contenedor de foto y nombre -->
                <button 
                    @click="goToUserProfile"
                    class="flex items-center gap-3"
                    type="button"
                >
                    <!-- Foto de perfil -->
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-white/10">
                        <template v-if="userLoading">
                            <div class="w-full h-full bg-gray-200 animate-pulse"></div>
                        </template>
                        <template v-else-if="user?.photoURL">
                            <img 
                                :src="user.photoURL" 
                                :alt="user.displayName || ''"
                                class="w-full h-full object-cover"
                            >
                        </template>
                        <template v-else>
                            <div class="w-full h-full bg-gray-300 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </template>
                    </div>

                    <!-- Nombre y estado -->
                    <div>
                        <h2 class="font-semibold text-celeste text-lg text-left">
                            <template v-if="userLoading">
                                <div class="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                            </template>
                            <template v-else>
                                {{ user?.displayName || 'Usuario' }}
                            </template>
                        </h2>
                        <p class="text-sm text-celeste brightness-125">
                            <template v-if="userLoading">
                                <div class="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
                            </template>
                            <template v-else>
                                {{ user?.type === 'entrenador' ? 'Entrenador' : 'Usuario Premium' }}
                            </template>
                        </p>
                    </div>
                </button>
            </div>

            <!-- Mensajes de la conversación -->
            <div class="flex-1 overflow-y-auto" ref="messagesContainer">
                <div class="p-4">
                    <ul class="flex flex-col items-start gap-4">
                        <template v-if="messagesLoading">
                            <SkeletonLoader class="h-10 w-full mb-2" v-for="n in 5" :key="n" />
                        </template>
                        <template v-else>
                            <li 
                                v-for="message in messages"
                                :key="message.id"
                                class="p-4 font-medium max-w-[70%] overflow-hidden"
                                :class="{
                                    'bg-gray-200': message.user_id !== loggedUser.id,
                                    'bg-blue-600': message.user_id === loggedUser.id,
                                    'text-white': message.user_id === loggedUser.id,
                                    'self-end': message.user_id === loggedUser.id,
                                    'rounded-l-2xl': message.user_id === loggedUser.id,
                                    'rounded-br-2xl': message.user_id === loggedUser.id,
                                    'rounded-r-2xl': message.user_id !== loggedUser.id,
                                    'rounded-bl-2xl': message.user_id !== loggedUser.id,
                                }"
                            >
                                <div class="chat-message">{{ message.text }}</div>
                                <div 
                                    class="text-sm text-gray-700 font-normal mt-1"
                                    :class="{
                                        'text-gray-300/70': message.user_id === loggedUser.id,
                                    }"    
                                >
                                    {{ formatDate(message.created_at) || "Enviando..." }} 
                                </div>
                            </li>
                        </template>
                    </ul>
                    <div ref="messagesEnd"></div>
                </div>
            </div>

            <!-- Formulario para enviar mensajes -->
            <form 
                action="#"
                class="h-[72px] flex gap-4 p-4 border-t border-white/10 bg-black/80 backdrop-blur-md items-center"
                @submit.prevent="handleSubmit"
            >
                <label class="sr-only" for="text">Mensaje</label>
                <textarea
                    placeholder="Escribe un mensaje..."
                    id="text"
                    class="w-full p-2 border rounded bg-black/90 text-white resize-none"
                    v-model="newMessage.text"
                    @keydown.enter.prevent="handleKeyDown"
                    rows="1"
                ></textarea>
                <BaseButton class="hover:bg-celeste/80 flex items-center">
                    Enviar
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </BaseButton>
            </form>
        </div>
    </div>
</template>

<script>
import BaseButton from '../../components/BaseButton.vue';
import BaseHeading1 from '../../components/BaseHeading1.vue';
import SkeletonLoader from '../../components/SkeletonLoader.vue';
import ChatList from '../../components/ChatList.vue';
import { subscribeToAuth } from '../../services/auth';
import { savePrivateChatMessage, subscribeToPrivateChatMessages, subscribeToUserChats, getPrivateChatDoc, markMessagesAsRead, clearCurrentChat } from '../../services/private-chat';
import { getUserProfileById } from '../../services/user-profiles';

let unsubscribeFromAuth = () => {}
let unsubscribeFromChats = () => {}
let unsubscribeFromMessages = null

export default {
    name: 'PrivateChat',
    components: { BaseHeading1, BaseButton, SkeletonLoader, ChatList },
    data() {
        return {
            loggedUser: null,
            user: null,
            messages: [],
            newMessage: { text: '' },
            chats: [],
            userLoading: true,
            messagesLoading: false,
            showMobileList: false,
            error: null,
            unsubscribeFromMessages: null
        }
    },
    methods: {
        async handleSubmit() {
            if (this.newMessage.text.trim() === '') return;
            try {
                await savePrivateChatMessage(
                    this.loggedUser.id,
                    this.user.id,
                    this.newMessage.text,
                );
                this.newMessage.text = '';
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
            }
        },
        
        async loadChat() {
            try {
                if (!this.loggedUser?.id || !this.$route.params.id) {
                    console.log('Esperando datos necesarios...');
                    return;
                }

                this.messagesLoading = true;
                this.userLoading = true;
                
                // Primero cargar los datos del usuario
                try {
                    this.user = await getUserProfileById(this.$route.params.id);
                    console.log('Usuario cargado:', this.user);
                } catch (error) {
                    console.error('Error al cargar usuario:', error);
                    this.error = 'Error al cargar el usuario';
                    return;
                }

                console.log('Cargando chat para:', this.user);
                
                // Limpiar chat actual antes de cargar uno nuevo
                clearCurrentChat();
                
                // Desuscribir de mensajes anteriores si existen
                if (this.unsubscribeFromMessages) {
                    this.unsubscribeFromMessages();
                }
                
                // Suscribirse a los mensajes
                this.unsubscribeFromMessages = await subscribeToPrivateChatMessages(
                    this.loggedUser.id,
                    this.$route.params.id,
                    (messages) => {
                        console.log('Mensajes recibidos en callback:', messages.length);
                        this.messages = messages;
                        this.messagesLoading = false;
                    }
                );
            } catch (error) {
                console.error('Error al cargar chat:', error);
                this.error = 'Error al cargar los mensajes';
            } finally {
                this.userLoading = false;
                this.messagesLoading = false;
            }
        },
        
        formatDate(date) {
            if (!date) return null;

            const formatter = new Intl.DateTimeFormat('es-AR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            return formatter.format(date).replace(',', '');
        },

        scrollToBottom() {
            this.$nextTick(() => {
                const messagesContainer = this.$refs.messagesContainer;
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            });
        },
        async handleChatSelect(userId) {
            this.showMobileList = false;
            if (userId !== this.$route.params.id) {
                // Buscar el usuario en la lista de chats para determinar su tipo
                const chatUser = this.chats.find(chat => chat.userId === userId);
                if (chatUser) {
                    // Si el usuario logueado es entrenador, siempre va a /usuarios-premium
                    if (this.loggedUser?.type === 'entrenador') {
                        this.$router.push(`/usuarios-premium/${userId}/chat`);
                    } else {
                        // Si el usuario logueado es premium, siempre va a /entrenadores
                        this.$router.push(`/entrenadores/${userId}/chat`);
                    }
                }
            }
            const chatDoc = await getPrivateChatDoc(this.loggedUser.id, userId);
            if (chatDoc) {
                await markMessagesAsRead(chatDoc.id, this.loggedUser.id);
            }
        },
        async handleMobileChatSelect(userId) {
            this.showMobileList = false;
            if (userId !== this.$route.params.id) {
                // Buscar el usuario en la lista de chats para determinar su tipo
                const chatUser = this.chats.find(chat => chat.userId === userId);
                if (chatUser) {
                    // Si el usuario logueado es entrenador, siempre va a /usuarios-premium
                    if (this.loggedUser?.type === 'entrenador') {
                        this.$router.push(`/usuarios-premium/${userId}/chat`);
                    } else {
                        // Si el usuario logueado es premium, siempre va a /entrenadores
                        this.$router.push(`/entrenadores/${userId}/chat`);
                    }
                }
            }
            const chatDoc = await getPrivateChatDoc(this.loggedUser.id, userId);
            if (chatDoc) {
                await markMessagesAsRead(chatDoc.id, this.loggedUser.id);
            }
        },
        goBack() {
            // Si el usuario logueado es entrenador, va a la lista de usuarios premium
            if (this.loggedUser.type === 'entrenador') {
                this.$router.push({ name: 'premium-user-list' });
            } 
            // Si el usuario es premium, va a la lista de entrenadores
            else {
                this.$router.push({ name: 'trainer-list' });
            }
        },
        goToUserProfile() {
            // Si el usuario logueado es entrenador, va al perfil del usuario premium
            if (this.loggedUser.type === 'entrenador') {
                this.$router.push({ 
                    name: 'premium-user-profile',
                    params: { id: this.$route.params.id }
                });
            } 
            // Si el usuario es premium, va al perfil del entrenador
            else {
                this.$router.push({ 
                    name: 'trainer.profile',
                    params: { id: this.$route.params.id }
                });
            }
        },
        handleKeyDown(e) {
            // Enviar con Enter, pero nueva línea con Shift+Enter
            if (!e.shiftKey) {
                this.handleSubmit();
            }
        }
    },
    mounted() {
        console.log('PrivateChat mounted, esperando auth...');
        unsubscribeFromAuth = subscribeToAuth(newUserData => {
            console.log('Auth data recibida:', newUserData);
            this.loggedUser = newUserData;
            
            // Subscribe to user chats when logged in
            if (newUserData?.id) {
                console.log('Suscribiendo a chats para usuario:', newUserData.id);
                unsubscribeFromChats = subscribeToUserChats(
                    newUserData.id,
                    newChats => {
                        console.log('Chats recibidos:', newChats);
                        this.chats = newChats;
                    }
                );
            }
        });
    },
    unmounted() {
        if (typeof unsubscribeFromAuth === 'function') {
            unsubscribeFromAuth();
        }
        if (typeof unsubscribeFromChats === 'function') {
            unsubscribeFromChats();
        }
        if (typeof unsubscribeFromMessages === 'function') {
            unsubscribeFromMessages();
        }
    },
    watch: {
        messages: {
            handler() {
                this.scrollToBottom();
            },
            deep: true
        },
        '$route.params.id': {
            immediate: true,
            handler(newId) {
                if (this.loggedUser?.id && newId) {
                    this.loadChat();
                }
            }
        },
        'loggedUser.id': {
            immediate: true,
            handler(newId) {
                if (newId && this.$route.params.id) {
                    this.loadChat();
                }
            }
        }
    },
    beforeUnmount() {
        if (this.unsubscribeFromMessages) {
            this.unsubscribeFromMessages();
        }
        clearCurrentChat();
        if (typeof unsubscribeFromAuth === 'function') {
            unsubscribeFromAuth();
        }
        if (typeof unsubscribeFromChats === 'function') {
            unsubscribeFromChats();
        }
    }
}
</script>