<script setup>
import { reactive, ref, onMounted, watch, computed} from 'vue'
import axios from 'axios'
// untuk mencegah user spam di pagination (bahaya klo user spam di pagination karena laravel ga bisa menampung limit rate gede)
import debounce from 'lodash/debounce'

//untuk export data metode client-side
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

//ini hanya untuk title
const title = ref('LIST USER BY API')

//ini ref untuk search
const search = ref('')

// 🔗 URL utama API
const mainUrl = "http://laravapp.localhost/api"
const finalUrl = mainUrl + "/Users-Data"

// 🧑‍🤝‍🧑 Data pengguna
const users = reactive([])

//untuk sort
const sort = reactive({
  column: 'name',      // default kolom
  direction: 'asc'     // default arah
})

// 📄 Data pagination old
// const pagination = reactive({
//   current_page: 1,
//   per_page: 10,
//   prev_page_url: null,
//   next_page_url: null
// })

// Data pagination new
const pagination = reactive({
  current_page: 1,
  per_page: 10,
  prev_page_url: null,
  next_page_url: null,
  last_page: 1,
  total: 0
})


// 🔄 Loading state
const loading = ref(false)

// ini untuk select all
const selectedUsers = ref([])


// ✅ Fungsi untuk fetch data
const fetchData = async (url = finalUrl) => {
  try {
    loading.value = true
    const response = await axios.get(url)
    const result = response.data

    // Cek format data
    const dataArray = Array.isArray(result.data)
      ? result.data
      : result.data?.data ?? []

    users.splice(0, users.length, ...dataArray)

    const pag = result.pagination ?? result.data?.pagination
    if (pag) {
    //   pagination.current_page = pag.current_page
    //   pagination.per_page = pag.per_page
    //   pagination.prev_page_url = pag.prev_page_url
    //   pagination.next_page_url = pag.next_page_url
    pagination.current_page = pag.current_page
    pagination.per_page = pag.per_page
    pagination.prev_page_url = pag.prev_page_url
    pagination.next_page_url = pag.next_page_url
    pagination.last_page = pag.last_page
    pagination.total = pag.total
    }
  } catch (error) {
    console.error('Gagal memuat data:', error)
  } finally {
    loading.value = false
  }
}

// ⏳ Debounce agar tidak spam request(cara biasa sebelum di terapkan di seraching dan paginftionn di bawah)
// const getData = debounce(fetchData, 500)


// ✅ Live search dengan Debounce agar tidak spam request di pagination dan search
// const getData = debounce((url = finalUrl) => {
//   const final = search.value
//     ? `${url}${url.includes('?') ? '&' : '?'}search=${encodeURIComponent(search.value)}`
//     : url

//   fetchData(final)
// }, 500)

// ✅ Live search dengan Debounce agar tidak spam request di pagination dan search lebih over power ini
// const getData = debounce((url = finalUrl) => {
//   let final = url

//   // Tambah search jika ada
//   if (search.value) {
//     final += (final.includes('?') ? '&' : '?') + `search=${encodeURIComponent(search.value)}`
//   }

//   // Tambah per_page jika belum ada
//   final += (final.includes('?') ? '&' : '?') + `per_page=${pagination.per_page}`

//   fetchData(final)
// }, 500)

//✅ Live search dengan Debounce agar tidak spam request di pagination dan search lebih over power ini
const getData = debounce((url = finalUrl) => {
  let final = url

  const params = new URLSearchParams()

  if (search.value) {
    params.append('search', search.value)
  }

  if (pagination.per_page) {
    params.append('per_page', pagination.per_page)
  }

  if (sort.column) {
    params.append('sort_by', sort.column)
    params.append('sort_dir', sort.direction)
  }

  if (final.includes('?')) {
    final += '&' + params.toString()
  } else {
    final += '?' + params.toString()
  }

  fetchData(final)
}, 500)




// 🔍 Trigger pencarian ketika mengetik
watch(search, (newVal) => {
  const searchUrl = `${finalUrl}?search=${encodeURIComponent(newVal)}`
  getData(searchUrl)
})

//untuk waktu
const formatDate = (dateStr) => {
  const options = { year: 'numeric', month: 'long', day: '2-digit' }
  return new Date(dateStr).toLocaleDateString('id-ID', options)
}


//untuk  pilih tampilkan data 10/50/100
const changePageSize = () => {
  pagination.current_page = 1 // reset ke halaman awal
  const url = `${finalUrl}?page=1&per_page=${pagination.per_page}`
  getData(url)
}



// code untuk sort dengan inputan
const changeSorting = () => {
  pagination.current_page = 1
  const url = `${finalUrl}?page=1`
  getData(url)
}

// code reset all filters
const resetFilters = () => {
  search.value = ''
  pagination.per_page = 10
  pagination.current_page = 1
  sort.column = 'name'
  sort.direction = 'asc'
  getData(finalUrl)
}

//untuk sort data di TH mirip jquery ini bagian icon
const sortDirectionIcon = (col) => {
  if (sort.column !== col) return 'fas fa-sort'
  return sort.direction === 'asc' ? 'fas fa-arrow-up-wide-short' : 'fas fa-arrow-down-wide-short'
}

//untuk sort data di TH mirip jquery ini bagian logic
const toggleSort = (col) => {
  if (sort.column === col) {
    sort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sort.column = col
    sort.direction = 'asc'
  }
  changeSorting()
}

//ini untuk membuat export excel metode client 
const exportToExcel = () => {
  const data = users.map((user, index) => ({
    No: index + 1 + (pagination.per_page * (pagination.current_page - 1)),
    Nama: user.name,
    Email: user.email,
    Role: user.role,
    Projects: user.projects?.join(', ') || '-',
    'Tanggal Dibuat': formatDate(user.created_at),
    'Tanggal Update': formatDate(user.updated_at)
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
  saveAs(blob, `users-page-${pagination.current_page}.xlsx`)
}


//ini untuk select
const allSelected = computed(() => {
  return users.length > 0 && users.every(user => selectedUsers.value.includes(user.id))
})

const isAllSelected = computed(() => {
  return users.length > 0 && selectedUsers.value.length === users.length
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    // Uncheck semua user di halaman ini
    users.forEach(user => {
      const index = selectedUsers.value.indexOf(user.id)
      if (index !== -1) {
        selectedUsers.value.splice(index, 1)
      }
    })
  } else {
    // Tambahkan semua user di halaman ini
    users.forEach(user => {
      if (!selectedUsers.value.includes(user.id)) {
        selectedUsers.value.push(user.id)
      }
    })
  }
}


const toggleSelectUser = (id) => {
  const idx = selectedUsers.value.indexOf(id)
  if (idx !== -1) {
    selectedUsers.value.splice(idx, 1)
  } else {
    selectedUsers.value.push(id)
  }
}

//kode delete multiple
const deleteSelectedUsers = () => {
  if (confirm(`Yakin ingin menghapus user?`)) {
    // this your api logic
  }
}



// 🧠 Auto-load saat mount
onMounted(() => {
  getData()
})
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-10">
      <p class="h2">{{ title }}</p>

       <!-- Reset button  -->
      <button class="btn btn-secondary mb-1" @click="resetFilters">
       <i class="fa fa-refresh mr-1"></i> Reset Filter
      </button>

       <!-- export excel button -->
      <button @click="exportToExcel" class="btn btn-success mb-1 ml-1">
          <i class="fa fa-download mr-2 ml-2">  Export ke Excel Per Page</i> 
        </button>

        <!-- hapus select metode  button -->
        <button
          class="btn btn-danger mb-2 ml-1"
          :disabled="selectedUsers.length === 0"
          @click="deleteSelectedUsers"
        >
        <i class="fa fa-trash mr-2 ml-2"></i>  Hapus yang dipilih ({{ selectedUsers.length }})
        </button>

      <div class="d-flex justify-content-between align-items-center mb-2">
        <button @click="show = true" class="btn btn-success">Add User</button>
        
      <!-- Sorting -->
        <div class="form-inline">
        <label class="mr-2">Urutkan:</label>
        <select class="form-control mr-2" v-model="sort.column" @change="changeSorting">
            <option value="name">Nama</option>
            <option value="created_at">Tanggal Dibuat</option>
        </select>

        <select class="form-control" v-model="sort.direction" @change="changeSorting">
            <option value="asc">Naik</option>
            <option value="desc">Turun</option>
        </select>
        </div>
        </div>



     <!-- Selector Per Page -->
    <div class="d-flex justify-content-between align-items-center mb-2">
    <div class="form-inline">
        <label class="mr-2">Tampilkan:</label>
        <select class="form-control" v-model="pagination.per_page" @change="changePageSize">
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
        </select>
        <span class="ml-2">data per halaman</span>
    </div>

    <form class="form-inline ">
            <div class="form-group mx-sm-3 mb-1 w-100">
                <input
                type="text"
                class="form-control col-md-11"
                placeholder="Search users..."
                v-model="search"
                />
            </div>
      </form>
    </div>


      <table class="table table-bordered">
        <thead>
          <tr>
            <th style="width: 2%">#</th>
            <th style="width: 2%">
              <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll">
            </th>
            <!-- dengan sort mirip jquery -->
            <th 
            @click="toggleSort('name')" 
            style="cursor:pointer">
              <i :class="sortDirectionIcon('name')" class="ml-0"
               title="Klik untuk urutkan">
              </i>
              Nama 
             </th>
            <th>Email</th>
            <th>Role</th>
            <th>Projects</th>
            <th 
            @click="toggleSort('created_at')" 
            style="cursor:pointer">
              <i :class="sortDirectionIcon('created_at')" class="ml-0"
               title="Klik untuk urutkan">
              </i>
              Created AT 
             </th>
            <th>Last Updated</th>
            <th style="width: 9%">Handle</th>
          </tr>
        </thead>
        <tbody>

          <!-- <tr v-if="loading"> manual loading
            <td colspan="4" class="text-center">Loading data...</td>
          </tr> -->

          <!-- mengunakan loading bagus -->
          <!-- <tr v-if="loading">
            <td colspan="4" class="text-center">
                <div class="d-flex justify-content-center align-items-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <span class="ml-2">Loading data...</span>
                </div>
            </td>
          </tr> -->

          <tr v-if="loading">
            <td colspan="8" class="text-center">
            <!-- <div class="d-flex justify-content-center align-items-center">
                <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
                </div>
                <span class="ml-2">Loading data...</span>
            </div> -->
            <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
                <div class="spinner-border text-primary" role="status"></div>
            </div>
            </td>
        </tr>

              <!-- Saat tidak ada data -->
              <!-- <tr v-if="!loading && users.length === 0">
                    <td colspan="4" class="text-center">
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
                    </tr> -->

                    <tr v-else-if="users.length === 0">
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



          <!-- <tr v-else v-for="(u, index) in users" :key="u.id || index">
            <td>{{ index + 1 + (pagination.per_page * (pagination.current_page - 1)) }}</td>
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td>
              <button class="btn btn-sm btn-outline-warning mr-2"> <i class="fa fa-edit"></i></button>
              <button class="btn btn-sm btn-outline-danger"> <i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody> -->

        <!-- Saat data tersedia -->
        <tr v-else v-for="(u, index) in users" :key="u.id || index">
            <td>{{ index + 1 + (pagination.per_page * (pagination.current_page - 1)) }}</td>
            <td>
            <input
              type="checkbox"
              :value="u.id"
              :checked="selectedUsers.includes(u.id)"
              @change="toggleSelectUser(u.id)"
            />
            </td>
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.role }}</td>
            <td>{{ u.projects ? u.projects.join(', ') : '-' }}</td>
            <td>{{ formatDate(u.created_at) }}</td>
            <td>{{ formatDate(u.updated_at) }}</td>
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

      <!-- Pagination Buttons old code-->
      <!-- <div class="mt-1 d-flex justify-content-between">
        <button
          class="btn btn-danger"
          :disabled="!pagination.prev_page_url || loading"
          @click="getData(pagination.prev_page_url)"
        >
          Previous
        </button>

        <p class="text-muted text-center mt-2">
        Menampilkan halaman {{ pagination.current_page }} dari {{ pagination.last_page }} halaman
        (Total: {{ pagination.total }} data)
        </p>


        <button
          class="btn btn-primary"
          :disabled="!pagination.next_page_url || loading"
          @click="getData(pagination.next_page_url)"
        >
          Next
        </button>

      </div> -->

      <div class="mt-1 d-flex justify-content-between align-items-center">
            <button
                class="btn btn-danger"
                :disabled="!pagination.prev_page_url || loading"
                @click="getData(pagination.prev_page_url)"
            >
            <i class="fa-solid fa-circle-chevron-left"></i> Previous
            </button>

            <span class="text-muted">
                Page {{ pagination.current_page }} of {{ pagination.last_page }}
            </span>

            <button
                class="btn btn-primary"
                :disabled="!pagination.next_page_url || loading"
                @click="getData(pagination.next_page_url)"
            >
            Next <i class="fa-solid fa-circle-chevron-right"></i> 
            </button>
            </div>

            <p class="text-muted text-center mt-2">
            Menampilkan {{ users.length }} data pada halaman ke-{{ pagination.current_page }} dari total {{ pagination.total }} data
            </p>
    </div>
  </div>

</template>
