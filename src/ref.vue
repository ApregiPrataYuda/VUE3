<script setup>
import { ref, onMounted } from 'vue'
 const refs = ref('this is using ref in vue');

 
</script>

<template>
  <p>This is ref example: {{ refs }}</p>
</template>

<style scope>
</style>