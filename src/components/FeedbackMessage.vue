<script>
export default {
    name: 'FeedbackMessage',
    props: {
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'success',
            validator: value => ['success', 'error'].includes(value)
        },
        autoClose: {
            type: Boolean,
            default: true
        }
    },
    emits: ['close'],
    mounted() {
        if (this.autoClose) {
            setTimeout(() => {
                this.$emit('close');
            }, 5000);
        }
    }
}
</script>

<template>
    <div 
        class="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-sm w-[calc(100%-2rem)] bg-cyan-300/20 backdrop-blur-md text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
        :class="{
            'border-l-4 border-green-500': type === 'success',
            'border-l-4 border-red-500': type === 'error'
        }"
    >
        <!-- Icono de éxito -->
        <svg 
            v-if="type === 'success'"
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6 text-green-500 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>

        <span class="flex-1 text-center">{{ message }}</span>

        <button 
            @click="$emit('close')"
            class="flex-shrink-0 text-white/60 hover:text-white transition-colors"
            aria-label="Cerrar mensaje"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template> 