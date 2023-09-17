<script setup>
const props = defineProps({
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
    class="inline-flex justify-center items-center text-white text-base text-center font-medium border-none rounded-xl transition-all duration-200 ease-in active:scale-95 active:opacity-80 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 py-3 px-6"
  >
    {{ text }}
  </button>
</template>