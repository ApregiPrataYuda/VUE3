<script setup>
import { reactive } from 'vue'

const profile = reactive({
  user: {
    name: 'Dian',
    skills: ['Vue', 'Laravel','Golang']
  },
  
})
</script>

<template>
  <h3>Profil User</h3>
  <p>Nama: {{ profile.user.name }}</p>
  <p>Skill:</p>
  <ul>
    <li v-for="(skill, index) in profile.user.skills" :key="index">
      {{ skill }}
    </li>
  </ul>
</template>

<style scoped>
h3 {
  color: #333;
}
ul {
  padding-left: 1.2rem;
}
</style>
