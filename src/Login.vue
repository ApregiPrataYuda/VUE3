<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function handleSubmit() {
   
}
</script>

<template>
  <div class="row">
    <div class="card p-3">
      <form @submit.prevent="handleSubmit">
        <div class="form-group mb-2">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            v-model="email"
          >
        </div>
        <div class="form-group mb-3">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            v-model="password"
          >
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
</template>
