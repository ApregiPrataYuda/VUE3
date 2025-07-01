<script setup>
import { reactive } from 'vue'
const profile = reactive({
  users: [
  {
    name: 'amarks',
    skills: ['Vue', 'Laravel','Golang','Java']
  },
  {
    name: 'jhons',
    skills: ['Vue', 'Laravel','Golang','React']
  },
  {
    name: 'bogeng',
    skills: ['Vue', 'Laravel','Golang','PHP']
  },
  {
    name: 'moses',
    skills: ['Vue', 'Laravel','PHP']
  },
  ]
})
</script>

<template>

  <table border="1">
    <tr>
      <th>Nama</th>
      <th>skill</th>
    </tr>
    <tbody>
         <tr v-for="(user, index) in profile.users" :key="index">
          <td>{{ user.name }}</td>
          <td>
          <ul>
            <li v-for="(skill, sIndex) in user.skills" :key="sIndex">{{ skill }}</li>
          </ul>
        </td>
         </tr>
    </tbody>
  </table>
</template>

<style scoped>
p {
  color: #eb1e1e;
}
ul {
  padding-left: 1.2rem;
}
</style>
