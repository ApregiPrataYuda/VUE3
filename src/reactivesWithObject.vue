<script setup>
     import {onMounted, reactive} from 'vue'
 
     const obj = reactive({
        name:'joks marens',
        age:24
     })

     onMounted(async () => {
        await new Promise(resolve => setTimeout(resolve, 3000))
        obj.name = 'bobs marks'
        obj.age = 25
     })
</script>
       

<template>
 <p>value name and age auto change in 3 seconds</p>
 <p>name: {{ obj.name }}</p>
 <p>age: {{ obj.age }}</p>
</template>

<style scope>
</style>