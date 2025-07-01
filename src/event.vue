<!-- <template>
    <input @input="onInput" />
    <input @change="onChange" />
    <input @focus="onFocus" />
    <button @click="onClick">Klik Aku</button>
  </template>
  
  <script setup>
  function onInput(e) {
    console.log('Input berubah:', e.target.value)
  }
  
  function onChange(e) {
    console.log('Input selesai diganti:', e.target.value)
  }
  
  function onFocus() {
    console.log('Input sedang difokuskan')
  }
  
  function onClick() {
    console.log('Tombol diklik')
  }
  </script>
   -->


   <template>
    <form @submit.prevent="submitForm">
      <input type="text" v-model="name" @focus="onFocus" @blur="onBlur" />
      <button @click="sayHello">Say Hello</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const name = ref('')
  
  function submitForm() {
    alert('Form dikirim dengan nama: ' + name.value)
  }
  function sayHello() {
    alert('Halo ' + name.value)
  }
  function onFocus() {
    console.log('Input difokuskan')
  }
  function onBlur() {
    console.log('Input kehilangan fokus')
  }
  </script>
  