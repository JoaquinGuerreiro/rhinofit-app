<script>
import BaseHeading1 from '../components/BaseHeading1.vue';
import { subscribeToAuth } from '../services/auth';

export default {
    name: 'HomeLogged',
    components: { BaseHeading1 },
    data() {
        return {
            loggedUser: {
                id: null,
                email: null,
                displayName: null,
                bio: null,
                training: null,
            },
            unsubscribe: null,
        };
    },
    mounted() {
        // Suscripción a los cambios de autenticación
        this.unsubscribe = subscribeToAuth(userData => {
            this.loggedUser = userData;
        });
    },
    beforeDestroy() {
        // Desuscripción al desmontar el componente
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}
</script>

<template>
    <div class="relative min-h-screen">
        <!-- Banner fijo -->
        <div class="fixed top-0 left-0 w-full h-screen -z-10">
            <div 
                class="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/hombre_mujer-banner.webp')"
                role="presentation"
                aria-hidden="true"
            ></div>
            <div 
                class="absolute inset-0 backdrop-blur-[2px] bg-black/20"
                role="presentation"
                aria-hidden="true"
            ></div>
        </div>


        <!-- ------------------------------ Home para usuarios ------------------------------ -->
        <div v-if="loggedUser.type !== 'entrenador'" class="relative pt-20 px-4 md:px-8 text-white">
            <div class="max-w-6xl mx-auto">

                <!-- Sección de Bienvenida -->
                <div class="text-center mb-20">
                    <BaseHeading1 class="text-4xl md:text-6xl mb-6">¡Hola {{ loggedUser.displayName }}!</BaseHeading1>
                    <p class="text-xl md:text-2xl mb-4 max-w-3xl mx-auto">
                        Es momento de comenzar tu transformación.
                    </p>
                    <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        ¿Qué te gustaría hacer hoy?
                    </p>
                </div>

                <!-- Opciones Principales -->
                <div class="grid md:grid-cols-3 gap-6 mb-20">
                    <router-link 
                        to="/generador"
                        class="bg-celeste/10 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition group"
                    >
                        <div class="text-celeste mb-4 group-hover:brightness-125">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold mb-4 text-celeste group-hover:brightness-125">Generador de Rutinas</h2>
                        <p>Recibí un plan de entrenamiento personalizado basado en tus características y objetivos.</p>
                    </router-link>

                    <router-link 
                        to="/rutinas"
                        class="bg-celeste/10 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition group"
                    >
                        <div class="text-celeste mb-4 group-hover:brightness-125">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold mb-4 text-celeste group-hover:brightness-125">Crear tu Rutina</h2>
                        <p>Diseñá tu propio plan de entrenamiento seleccionando ejercicios, series y repeticiones para cada día.</p>
                    </router-link>

                    <router-link 
                        to="/entrenadores"
                        class="bg-celeste/10 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition group"
                    >
                        <div class="text-celeste mb-4 group-hover:brightness-125">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold mb-4 text-celeste group-hover:brightness-125">Chat con Entrenadores</h2>
                        <p>Obtené asesoramiento personalizado y correcciones de profesionales expertos.</p>
                    </router-link>
                </div>

                <!-- Separador -->
                <div class="border-t border-white/10 mb-20"></div>

                <!-- Sección Motivacional -->
                <div class="bg-white/10 backdrop-blur-sm p-8 rounded-xl mb-20">
                    <h2 class="text-3xl font-bold mb-6 text-center text-celeste">Tu Transformación Comienza Ahora</h2>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-xl font-bold mb-4">Disciplina y Constancia</h3>
                            <p class="mb-4">En RhinoFit creemos en el poder de la disciplina y la constancia. Cada entrenamiento te acerca más a tus objetivos, transformando no solo tu cuerpo sino también tu mente.</p>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-4">Acompañamiento Personalizado</h3>
                            <p class="mb-4">Estamos comprometidos con tu progreso. Te acompañamos en cada paso del camino, asegurando un entrenamiento efectivo, seguro y sostenible en el tiempo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <!-- ------------------------------ Home para entrenadores ------------------------------- -->
        <div v-if="loggedUser.type === 'entrenador'" class="relative pt-20 px-4 md:px-8 text-white">
            <div class="max-w-6xl mx-auto">
                
                <!-- Sección de Bienvenida -->
                <div class="text-center mb-20">
                    <BaseHeading1 class="text-4xl md:text-6xl mb-6">¡Hola {{ loggedUser.displayName }}!</BaseHeading1>
                    <p class="text-xl md:text-2xl mb-4 max-w-3xl mx-auto">
                        Gestioná tus entrenamientos o los de tus alumnos.
                    </p>
                    <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        ¿Qué te gustaría hacer hoy?
                    </p>
                </div>

                <!-- Opciones Principales -->
                <div class="grid md:grid-cols-3 gap-6 mb-20">
                    <router-link 
                        to="/generador"
                        class="bg-celeste/10 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition group"
                    >
                        <div class="text-celeste mb-4 group-hover:brightness-125">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold mb-4 text-celeste group-hover:brightness-125">Generador de Rutinas</h2>
                        <p>Recibí un plan de entrenamiento personalizado para tus alumnos o para vos, basado en las características y objetivos de cada uno.</p>
                    </router-link>
                    <router-link 
                        to="/rutinas"
                        class="bg-celeste/10 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition group"
                    >
                        <div class="text-celeste mb-4 group-hover:brightness-125">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold mb-4 text-celeste group-hover:brightness-125">Crear tu Rutina</h2>
                        <p>Diseñá tu plan de entrenamiento tanto para vos, como para tus alumnos. Seleccioná ejercicios, series y repeticiones para cada día.</p>
                    </router-link>


                    <router-link 
                        to="/usuarios-premium"
                        class="bg-celeste/10 backdrop-blur-sm p-8 rounded-xl hover:transform hover:scale-105 transition group"
                    >
                        <div class="text-celeste mb-4 group-hover:brightness-125">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h2 class="text-2xl font-bold mb-4 text-celeste group-hover:brightness-125">Chat con tus Alumnos</h2>
                        <p>Accedé a la lista de usuarios premium de la App, y chateá con tus alumnos para asesorarlos.</p>
                    </router-link>
                </div>

                <!-- Separador -->
                <div class="border-t border-white/10 mb-20"></div>

                <!-- Sección Motivacional -->
                <div class="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                    <h2 class="text-3xl font-bold mb-6 text-center text-celeste">El Proceso Comienza Ahora</h2>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-xl font-bold mb-4">Disciplina y Constancia</h3>
                            <p class="mb-4">Inculcá en tus alumnos la disciplina y constancia que te caracteriza tanto a vos, como a la filosofía de RhinoFit. Cada entrenamiento acerca a tus alumnos cada vez más a sus objetivos, para que transformen tanto su cuerpo como su mente.</p>                           
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-4">Acompañamiento Personalizado</h3>
                            <p class="mb-4">Acompañá a tus alumnos en cada paso del camino, y asegurales un entrenamiento efectivo, seguro y sostenible en el tiempo, para que no bajen los brazos y persigan sus metas.</p>
                        </div>
                    </div>
                </div>
                <div class="h-20"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.backdrop-blur-sm {
    backdrop-filter: blur(8px);
}
</style>