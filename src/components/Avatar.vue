<script setup>
import { computed } from 'vue';

const props = defineProps({
  image: {
    type: String,
    default: ''
  },
});

const imageSrc = computed(() => props.image || new URL('../assets/user.png', import.meta.url).href);
</script>

<template>
  <router-link
    to="/profile"
    class="block w-12 h-12 rounded-full overflow-hidden"
  >
    <img
      :src="imageSrc"
      alt="Avatar"
      class="w-full h-full object-cover rounded-full"
    >
  </router-link>
</template>
