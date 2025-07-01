<script setup>
 import {ref, onMounted} from 'vue'
 const titles = ref('LIST USER')
 const users = ref([])
 onMounted(async () => {
      const dataPengguna = await fetch('https://dummyjson.com/users')
      const exstract = await dataPengguna.json();
      users.value = exstract.users.slice(0, 5)
 })

</script>

<template>
    <p class="h2">{{ titles }}</p>
    <table class="table table-bordered">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">First</th>
        <th scope="col">Last</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(user, index) in users" :key="index">
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ user.firstName }}</td>
        <td>{{ user.lastName }}</td>
      </tr>
    </tbody>
  </table>
</template>