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
  <p
    :class="{
      'text-sm': size === 'sm',
      'text-md': size === 'md',
      'text-lg': size === 'lg',
      'font-bold': weight === 'bold',
      'font-semibold': weight === 'semibold',
    }"
    class="text-secondary font-sans leading-tight select-none"
  >
    {{ text }}
  </p>
</template>