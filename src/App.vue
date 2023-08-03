<script setup lang="ts">
import AuthenticationInitial from 'src/pages/authenticationInitial/AuthenticationInitial.vue'
import { ref } from 'vue';

const roles = localStorage.getItem('roles')
const create = ref(false)
setTimeout(() => {
  if (roles?.length > 0) {
    create.value = true
  }
}, 1500)
</script>

<template>
  <AuthenticationInitial>
    <router-view v-if="create" />
  </AuthenticationInitial>
</template>
