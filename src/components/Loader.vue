<script>
export default {
    name: 'Loader',
}
</script>

<template>
    <div class="lds-dual-ring h-6 flex items-center justify-center"></div>
</template>

<style>
.lds-dual-ring,
.lds-dual-ring:after {
  box-sizing: border-box;
}
.lds-dual-ring {
  display: inline-block;
  width: 24px;
  height: 24px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 20px;
  height: 20px;
  margin: 2px;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-color: currentColor transparent currentColor transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>