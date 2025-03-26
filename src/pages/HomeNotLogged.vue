<script>
import BaseHeading1 from '../components/BaseHeading1.vue';

export default {
    name: 'HomeNotLogged',
    components: { BaseHeading1 },
}
</script>

<template>
    <div class="relative min-h-screen">
        <div 
            class="fixed top-0 left-0 w-full h-screen -z-10 bg-cover bg-center bg-no-repeat"
            style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('/imgs/hombre_espalda-banner.webp')"
            role="presentation"
            aria-hidden="true"
        ></div>

        <div class="relative pt-20 px-4 md:px-8 text-white">
            <div class="max-w-6xl mx-auto">
                
                <!-- Sección Intro -->
                <div class="text-center mb-20">
                    <BaseHeading1 class="text-4xl md:text-6xl mb-6">Transformá tu vida con R<span class="text-3xl md:text-5xl">HINO</span>F<span class="text-3xl md:text-5xl">IT</span></BaseHeading1>
                    <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        Tu camino hacia una mejor versión de vos mismo empieza ahora. Entrená de manera inteligente, personalizada y efectiva.
                    </p>
                    <div class="flex gap-4 justify-center">
                        <router-link 
                            to="/registro"
                            class="px-8 py-4 bg-celeste text-azul rounded-lg font-semibold hover:brightness-125 transition transform hover:scale-105"
                        >
                            Empezar Gratis
                        </router-link>
                        <router-link 
                            to="/iniciar-sesion"
                            class="px-8 py-4 bg-azul backdrop-blur-sm text-celeste rounded-lg font-semibold hover:brightness-125 transition transform hover:scale-105"
                        >
                            Iniciar Sesión
                        </router-link>
                    </div>
                </div>

                <!-- Características Principales -->
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:transform hover:scale-105 transition">
                        <div class="text-blue-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Rutinas Personalizadas</h3>
                        <p>Creá tu propia rutina o recibí un plan personalizado basado en tus objetivos, características y necesidades específicas.</p>
                    </div>

                    <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:transform hover:scale-105 transition">
                        <div class="text-blue-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Asesoría Premium</h3>
                        <p>Accedé a entrenadores reales mediante chat para obtener consejos personalizados y correcciones específicas.</p>
                    </div>

                    <div class="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:transform hover:scale-105 transition">
                        <div class="text-blue-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-bold mb-2">Seguimiento de Progreso</h3>
                        <p>Llevá un seguimiento de tus rutinas y visualizá tu evolución día a día.</p>
                    </div>
                </div>

                <!-- Sección de Motivación -->
                <div class="bg-white/10 backdrop-blur-sm p-8 rounded-xl mb-20">
                    <h2 class="text-3xl font-bold mb-6 text-center text-celeste">Más que un gimnasio virtual</h2>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 class="text-xl font-bold mb-4">Transformación Integral</h3>
                            <p class="mb-4">En RhinoFit creemos que las bases del entrenamiento están en la disciplina, el esfuerzo y la constancia. Buscamos una verdadera transformación, tanto física como mental.</p>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold mb-4">Acompañamiento Continuo</h3>
                            <p class="mb-4">Te acompañamos en cada paso del camino, fomentando tu constancia y garantizando un entrenamiento seguro, saludable y sostenible en el tiempo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.backdrop-blur-sm {
    backdrop-filter: blur(8px);
}
</style>