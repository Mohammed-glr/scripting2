<script setup lang="ts">
const { data: page, pending, error } = await useFetch('/api/hello')
</script>

<template>
  <h1 v-if="pending">Loading...</h1>
  <h1 v-else-if="error">Failed to load.</h1>
  <h1 v-else>{{ page?.message }}</h1>
</template>



