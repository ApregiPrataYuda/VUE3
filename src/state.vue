<script setup>
import { ref } from 'vue'
 const numbers = ref(0);
  function clickers() {
    numbers.value++;
  }
</script>

<template>
  <p>Counters: {{ numbers }}</p>
  <button @click="clickers">tekan saya</button>
</template>

<style scope>
</style>