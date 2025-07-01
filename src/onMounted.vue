<script setup>
import { ref, onMounted } from 'vue'
 const strings = ref('call string with load');

 onMounted(async () => {
        await new Promise(resolve => setTimeout(resolve, 3000))
  strings.value = 'Updated after mount'
 })
 
</script>

<template>
  <p>This is Interpolation: {{ strings }}</p>
</template>

<style scope>
</style>