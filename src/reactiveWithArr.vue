<script setup>
  import  {reactive} from 'vue'

  const todos = reactive([
  { id: 1, task: 'Learn Vue' },
  { id: 2, task: 'Build App' }
])

</script>

<template>
    <p v-for="(todo, index) in todos" :key="index">
        {{ todo.id }} - {{ todo.task }}</p>
</template>