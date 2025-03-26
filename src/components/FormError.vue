<script>
export default {
    name: 'FormError',
    props: {
        message: {
            type: String,
            required: true
        }
    }
}
</script>

<template>
    <div class="bg-red-500/20 border-l-4 border-red-500 text-white p-3 rounded-lg text-sm">
        {{ message }}
    </div>
</template> 