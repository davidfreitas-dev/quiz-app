<script setup>
const props = defineProps({
  progress: {
    type: [ String, Number ],
    required: true,
    validator: (value) => value >= 0 && value <= 100
  }
});
</script>

<template>
  <div class="relative w-full bg-gray-200 rounded">
    <div
      :style="{ width: progress + '%' }"
      class="progress-bar w-full h-2 rounded-full bg-primary transition-width duration-500"
    />
  </div>
</template>