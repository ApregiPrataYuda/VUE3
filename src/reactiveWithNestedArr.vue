<script setup>
import { reactive, onMounted } from 'vue'

// Reactive array of nested objects
const todos = reactive([
  {
    id: 1,
    task: 'Learn Vue',
    done: false,
    tags: ['javascript', 'vue'],
    assigned: {
      name: 'Budi',
      role: 'Developer'
    }
  },
  {
    id: 2,
    task: 'Build App',
    done: true,
    tags: ['frontend'],
    assigned: {
      name: 'Sari',
      role: 'Designer'
    }
  }
])

// Simulasi update nested saat komponen dimount
onMounted(() => {
  setTimeout(() => {
    todos[0].done = true                 // update properti langsung
    todos[1].assigned.name = 'Agus'      // nested update
    todos.push({
      id: 3,
      task: 'Test App',
      done: false,
      tags: ['qa'],
      assigned: { name: 'Rina', role: 'QA' }
    })                                  // tambah todo
  }, 2000)
})
</script>

<template>
  <h2>Todo List</h2>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <p><strong>{{ todo.task }}</strong> - {{ todo.done ? '✅ Done' : '⏳ In Progress' }}</p>
      <p>Assigned to: {{ todo.assigned.name }} ({{ todo.assigned.role }})</p>
      <p>Tags: {{ todo.tags.join(', ') }}</p>
      <hr>
    </li>
  </ul>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 1rem;
}
</style>
