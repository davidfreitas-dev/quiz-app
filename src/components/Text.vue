<script setup>
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'sm'
  },
  weight: {
    type: String,
    default: ''
  },
});
</script>

<template>
  <span
    :class="{
      'text-sm': size === 'sm',
      'text-md': size === 'md',
      'text-lg': size === 'lg',
      'text-2xl': size === 'xl',
      'font-bold': weight === 'bold',
      'font-semibold': weight === 'semibold',
    }"
    class="text-font font-sans leading-tight select-none"
  >
    {{ text }}
  </span>
</template>