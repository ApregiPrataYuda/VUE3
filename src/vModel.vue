<script setup>
import { ref } from 'vue'

const responseResult = ref(true)
const fullnames = ref('')
</script>

<template>
  <div>
      <div class="row">
        <label for="">fullnames</label>
        <input type="text" v-model="fullnames" class="form-control">
        <p>ini Hasilnya: {{ fullnames }}</p>
      </div>
    
    <label>
      <input type="checkbox" v-model="responseResult" />
      Aktifkan
    </label>
    <p>Status: {{ responseResult ? '✔ Aktif' : '✘ Tidak Aktif' }}</p>
  </div>
</template>
