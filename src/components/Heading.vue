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
      'text-xl': size === 'md',
      'text-2xl': size === 'lg',
    }"
    class="font-bold font-sans"
  >
    {{ text }}
  </span>
</template>