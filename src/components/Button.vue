<script setup>
import Loader from '@/components/Loader.vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Text Button'
  },
  color: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <button
    :class="{ 
      'w-full': size === 'block',
      'bg-primary': color === 'primary'
    }"
    class="inline-flex justify-center items-center text-white text-sm text-center font-semibold border-none rounded-xl transition-all duration-200 ease-in active:scale-95 active:opacity-80 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 select-none py-3 px-6 h-12"
  >
    <Loader v-if="isLoading" />

    <span v-else>{{ text }}</span>
  </button>
</template>