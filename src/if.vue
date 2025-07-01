<script setup>
import {ref} from 'vue'
const respoonseResult = ref(false);
</script>


<template>
    <div>
        <p v-if="respoonseResult">Aktif</p>
        <p v-else>NonAktif</p>
    </div>
</template>

