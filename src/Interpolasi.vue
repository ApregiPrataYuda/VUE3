<script setup>
import { ref } from 'vue'
 const interpolation = ref('sdsdsdsds')
</script>

<template>
  <p>This is Interpolation: {{ interpolation }}</p>
 
</template>

<style scope>
  p {
    color: blueviolet;
  }
</style>