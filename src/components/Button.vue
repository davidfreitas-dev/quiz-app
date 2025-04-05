<script setup>
const props = defineProps({
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
    :class="[
      'inline-flex justify-center items-center text-sm text-center font-semibold border rounded-xl transition-all duration-200 ease-in active:scale-95 active:opacity-80 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 select-none py-3 px-6 h-12',
      {
        'w-full': size === 'block',
        'bg-primary text-white border-none': color === 'primary',
        'bg-transparent text-primary border-2 border-primary': color === 'outline'
      }
    ]"
  >
    <slot />
  </button>
</template>
