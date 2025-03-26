<script>
import SkeletonLoader from '../SkeletonLoader.vue';

export default {
    name: 'ProfileData',
    components: { SkeletonLoader },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        user: {
            type: Object,
            required: true,
        }
    }
}
</script>

<template>
    <div class="flex gap-4 items-start">
        <div class="w-1/6">
            <img
                :src="user.photoURL || '/imgs/no-image.jpg'"
                alt=""
            >

        </div>
        <div>
            <div class="mb-4">
                <span v-if="!loading">{{ user.bio || 'Acá va mi biografía...' }}</span>
                <SkeletonLoader class="w-96 h-5" v-else />
            </div>

            <dl>
                <dt class="font-bold text-blue-800">Email</dt>
                <dd class="mb-3">{{ user.email }}</dd>
                <dt class="font-bold text-blue-800">Nombre de Usuario</dt>
                <dd class="mb-3">
                    <span v-if="!loading">{{ user.displayName || 'No especificado...' }}</span>
                    <SkeletonLoader class="w-96 h-5" v-else />
                </dd>
                <dt class="font-bold text-blue-800">Entrenamiento</dt>
                <dd class="mb-3">
                    <span v-if="!loading">{{ user.training || 'No especificada...' }}</span>
                    <SkeletonLoader class="w-96 h-5" v-else />
                </dd>
            </dl>
        </div>
    </div>
</template>