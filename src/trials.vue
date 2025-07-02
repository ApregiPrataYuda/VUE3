<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'

// State
const loading = ref(false)
const search = ref('')
const users = ref([])
const filteredUsers = computed(() => {
  if (!search.value) return users.value
  return users.value.filter(u =>
    u.name.toLowerCase().includes(search.value.toLowerCase()) ||
    u.email.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Pagination
const pagination = reactive({
  page: 1,
  perPage: 5,
})
const paginatedUsers = computed(() => {
  const start = (pagination.page - 1) * pagination.perPage
  return filteredUsers.value.slice(start, start + pagination.perPage)
})
const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / pagination.perPage)
)

// Fetch data
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get('https://jsonplaceholder.typicode.com/users')
    users.value = res.data
  } catch (e) {
    console.error('Error fetching users', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl mb-4">User Table (Like DataTables)</h2>

    <div class="mb-3">
      <input v-model="search" type="text" placeholder="Search name or email" class="form-control" />
    </div>

    <div v-if="loading" class="text-center my-4">
      <img src="" alt="Loading..." width="50" />
      <p>Loading data...</p>
    </div>

    <table v-else class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, i) in paginatedUsers" :key="user.id">
          <td>{{ i + 1 + (pagination.page - 1) * pagination.perPage }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
        <tr v-if="paginatedUsers.length === 0">
          <td colspan="3" class="text-center">No data found</td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex justify-content-between mt-3">
      <button class="btn btn-secondary" :disabled="pagination.page === 1" @click="pagination.page--">
        Previous
      </button>
      <span>Page {{ pagination.page }} of {{ totalPages }}</span>
      <button class="btn btn-secondary" :disabled="pagination.page === totalPages" @click="pagination.page++">
        Next
      </button>
    </div>
  </div>
</template>
