// stores/userDataStore.js
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import axios from 'axios'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export const useUserDataStore = defineStore('userData', () => {
  const mainUrl = 'http://laravapp.localhost/api'
  const finalUrl = mainUrl + '/Users-Data'

  const users = reactive([])
  const search = ref('')
  const sort = reactive({
    column: 'name',
    direction: 'asc'
  })

  const pagination = reactive({
    current_page: 1,
    per_page: 10,
    prev_page_url: null,
    next_page_url: null,
    last_page: 1,
    total: 0
  })

  const loading = ref(false)
  let searchTimeout = null

  const fetchUsers = async (url = finalUrl) => {
    try {
      loading.value = true
      const response = await axios.get(url)
      const result = response.data

      const dataArray = Array.isArray(result.data)
        ? result.data
        : result.data?.data ?? []

      users.splice(0, users.length, ...dataArray)

      const pag = result.pagination ?? result.data?.pagination
      if (pag) {
        pagination.current_page = pag.current_page
        pagination.per_page = pag.per_page
        pagination.prev_page_url = pag.prev_page_url
        pagination.next_page_url = pag.next_page_url
        pagination.last_page = pag.last_page
        pagination.total = pag.total
      }
    } catch (error) {
      console.error('Gagal fetch:', error)
    } finally {
      loading.value = false
    }
  }

  const buildUrl = () => {
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

    return `${finalUrl}?${params.toString()}`
  }

  const changePageSize = () => {
    pagination.current_page = 1
    fetchUsers(buildUrl())
  }

  const changeSorting = () => {
    pagination.current_page = 1
    fetchUsers(buildUrl())
  }

  const toggleSort = (col) => {
    if (sort.column === col) {
      sort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
    } else {
      sort.column = col
      sort.direction = 'asc'
    }
    changeSorting()
  }

  const resetFilters = () => {
    search.value = ''
    pagination.per_page = 10
    pagination.current_page = 1
    sort.column = 'name'
    sort.direction = 'asc'
    fetchUsers(buildUrl())
  }

  const searchWithDelay = (val) => {
    clearTimeout(searchTimeout)
    search.value = val
    searchTimeout = setTimeout(() => {
      fetchUsers(buildUrl())
    }, 500)
  }

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit' }
    return new Date(dateStr).toLocaleDateString('id-ID', options)
  }

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

  const sortDirectionIcon = (col) => {
    if (sort.column !== col) return 'fas fa-sort'
    return sort.direction === 'asc' ? 'fas fa-arrow-up-wide-short' : 'fas fa-arrow-down-wide-short'
  }

  return {
    users,
    search,
    sort,
    pagination,
    loading,
    fetchUsers,
    buildUrl,
    changePageSize,
    changeSorting,
    toggleSort,
    resetFilters,
    searchWithDelay,
    exportToExcel,
    formatDate,
    sortDirectionIcon
  }
})
