<script>
export default {
    name: 'BaseButton',
    props: {
        color: {
            type: String,
            default: 'blue',
        },
    },
}
</script>

<template>
    <button 
        type="submit" 
        class="h-[46px] transition py-2 px-4 rounded bg-celeste text-azul hover:brightness-125 font-bold"
    >
        <slot>Enviar</slot>
    </button>
</template>