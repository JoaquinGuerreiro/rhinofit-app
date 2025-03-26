<script>
import { deleteUserCompletely } from '../services/auth';

export default {
    name: 'DeleteAccountModal',
    emits: ['close', 'accountDeleted'],
    data() {
        return {
            deletePassword: '',
            deleteError: ''
        }
    },
    methods: {
        closeModal() {
            this.deletePassword = '';
            this.deleteError = '';
            this.$emit('close');
        },
        async handleDeleteAccount() {
            try {
                if (!this.deletePassword) {
                    this.deleteError = 'Por favor, ingresa tu contraseña';
                    return;
                }

                await deleteUserCompletely(this.deletePassword);
                this.$emit('accountDeleted');
            } catch (error) {
                console.error('Error al eliminar la cuenta:', error);
                this.deleteError = error.message || 'Error al eliminar la cuenta';
            }
        }
    }
}
</script>

<template>
    <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
        <div class="bg-black/80 backdrop-blur-md rounded-xl shadow-lg p-8 max-w-md w-full relative border border-celeste/30">
            <h2 class="text-2xl font-bold text-celeste mb-4">Eliminar Cuenta</h2>
            
            <p class="text-white mb-6">
                ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y perderás todos tus datos.
            </p>

            <!-- Campo de contraseña -->
            <div class="mb-6">
                <label class="block text-white mb-2">Ingresa tu contraseña para confirmar:</label>
                <input 
                    v-model="deletePassword"
                    type="password"
                    class="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-celeste focus:outline-none"
                    placeholder="Contraseña"
                />
                <p v-if="deleteError" class="text-red-500 mt-2 text-sm">{{ deleteError }}</p>
            </div>

            <div class="flex justify-end gap-4">
                <button
                    @click="closeModal"
                    class="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition"
                >
                    Cancelar
                </button>
                <button
                    @click="handleDeleteAccount"
                    class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                    Eliminar Cuenta
                </button>
            </div>
        </div>
    </div>
</template>