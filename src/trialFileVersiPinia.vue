<script setup>
import { onMounted, watch } from 'vue'
import { useUserDataStore } from './store/userDataStore'

const userStore = useUserDataStore()

onMounted(() => {
  userStore.fetchUsers(userStore.buildUrl())
})

watch(() => userStore.search, (val) => {
  userStore.searchWithDelay(val)
})

</script>


<template>
  <div class="row justify-content-center">
    <div class="col-md-10">
      <p class="h2">{{ userStore.title || 'LIST USER BY API' }}</p>

      <button class="btn btn-secondary mb-1" @click="userStore.resetFilters">
        <i class="fa fa-refresh mr-1"></i> Reset Filter
      </button>

      <button @click="userStore.exportToExcel" class="btn btn-success mb-1">
        <i class="fa fa-download mr-2 ml-2"> Export ke Excel Per Page</i>
      </button>

      <div class="d-flex justify-content-between align-items-center mb-2">
        <button @click="show = true" class="btn btn-success">Add User</button>

        <div class="form-inline">
          <label class="mr-2">Urutkan:</label>
          <select class="form-control mr-2" v-model="userStore.sort.column" @change="userStore.changeSorting">
            <option value="name">Nama</option>
            <option value="created_at">Tanggal Dibuat</option>
          </select>

          <select class="form-control" v-model="userStore.sort.direction" @change="userStore.changeSorting">
            <option value="asc">Naik</option>
            <option value="desc">Turun</option>
          </select>
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="form-inline">
          <label class="mr-2">Tampilkan:</label>
          <select class="form-control" v-model="userStore.pagination.per_page" @change="userStore.changePageSize">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="ml-2">data per halaman</span>
        </div>

        <form class="form-inline">
          <div class="form-group mx-sm-3 mb-1 w-100">
            <input
              type="text"
              class="form-control col-md-11"
              placeholder="Search users..."
              v-model="userStore.search"
            />
          </div>
        </form>
      </div>

      <table class="table table-bordered">
        <thead>
          <tr>
            <th style="width: 2%">#</th>
            <th @click="userStore.toggleSort('name')" style="cursor:pointer">
              <i :class="userStore.sortDirectionIcon('name')" class="ml-0" title="Klik untuk urutkan"></i>
              Nama
            </th>
            <th>Email</th>
            <th>Role</th>
            <th>Projects</th>
            <th @click="userStore.toggleSort('created_at')" style="cursor:pointer">
              <i :class="userStore.sortDirectionIcon('created_at')" class="ml-0" title="Klik untuk urutkan"></i>
              Created AT
            </th>
            <th>Last Updated</th>
            <th style="width: 9%">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="userStore.loading">
            <td colspan="8" class="text-center">
              <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
            </td>
          </tr>

          <tr v-else-if="userStore.users.length === 0">
            <td colspan="8" class="text-center">
              <div class="d-flex flex-column align-items-center justify-content-center">
                <img
                  src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                  alt="No data found"
                  style="max-width: 300px; height: auto;"
                  class="mb-3"
                />
                <p class="text-danger font-weight-bold h5">
                  <i class="fa fa-exclamation-circle mr-1"></i>
                  Data tidak ditemukan.
                </p>
              </div>
            </td>
          </tr>

          <tr v-else v-for="(u, index) in userStore.users" :key="u.id || index">
            <td>{{ index + 1 + (userStore.pagination.per_page * (userStore.pagination.current_page - 1)) }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.role }}</td>
            <td>{{ u.projects ? u.projects.join(', ') : '-' }}</td>
            <td>{{ userStore.formatDate(u.created_at) }}</td>
            <td>{{ userStore.formatDate(u.updated_at) }}</td>
            <td>
              <button class="btn btn-sm btn-outline-warning mr-2">
                <i class="fa fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger">
                <i class="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-1 d-flex justify-content-between align-items-center">
        <button
          class="btn btn-danger"
          :disabled="!userStore.pagination.prev_page_url || userStore.loading"
          @click="userStore.fetchUsers(userStore.pagination.prev_page_url)"
        >
          <i class="fa-solid fa-circle-chevron-left"></i> Previous
        </button>

        <span class="text-muted">
          Page {{ userStore.pagination.current_page }} of {{ userStore.pagination.last_page }}
        </span>

        <button
          class="btn btn-primary"
          :disabled="!userStore.pagination.next_page_url || userStore.loading"
          @click="userStore.fetchUsers(userStore.pagination.next_page_url)"
        >
          Next <i class="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div>

      <p class="text-muted text-center mt-2">
        Menampilkan {{ userStore.users.length }} data pada halaman ke-{{ userStore.pagination.current_page }} dari total {{ userStore.pagination.total }} data
      </p>
    </div>
  </div>
</template>
