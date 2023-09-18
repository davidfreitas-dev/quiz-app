<script setup>
const props = defineProps({
  size: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <span
    :class="{
      'text-lg': size === 'sm',
      'text-xl': size === 'md',
      'text-2xl': size === 'lg',
    }"
    class="text-primary-font font-bold font-sans"
  >
    {{ text }}
  </span>
</template>