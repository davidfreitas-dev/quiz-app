<script setup>
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid';

const emit = defineEmits(['onHandleLeft', 'onHandleRight']);

const props = defineProps({
  textLeft: {
    type: String,
    default: 'Left'
  },
  textRight: {
    type: String,
    default: 'Right'
  }
});
</script>

<template>
  <div class="actions flex justify-between items-center gap-5 w-full">
    <button
      type="button"
      class="p-3 w-1/2 text-sm font-semibold text-primary inline-flex items-center justify-between bg-white border-2 border-primary focus:outline-none rounded-xl text-center transition-all duration-200 ease-in active:scale-95 active:opacity-80 cursor-pointer disabled:cursor-not-allowed"
      @click="emit('onHandleLeft')"
    >
      <ChevronLeftIcon class="h-5 w-5" />

      {{ textLeft }}

      <span class="h-5 w-5" />
    </button>

    <button
      type="button"
      class="p-3 w-1/2 text-sm font-semibold text-white inline-flex items-center justify-between bg-primary border-2 border-primary focus:outline-none rounded-xl text-center transition-all duration-200 ease-in active:scale-95 active:opacity-80 cursor-pointer disabled:cursor-not-allowed"
      @click="emit('onHandleRight')"
    >
      <span class="h-5 w-5" />

      {{ textRight }}
      
      <ChevronRightIcon class="h-5 w-5" />
    </button>
  </div>
</template>