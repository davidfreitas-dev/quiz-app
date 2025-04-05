<script setup>
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid';
import Button from '@/components/Button.vue';

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
    <Button
      class="w-1/2 justify-between"
      color="outline"
      @click="emit('onHandleLeft')"
    >
      <ChevronLeftIcon class="h-5 w-5" />

      {{ textLeft }}

      <span class="h-5 w-5" />
    </Button>

    <Button
      class="w-1/2 justify-between"
      color="primary"
      @click="emit('onHandleRight')"
    >
      <span class="h-5 w-5" />

      {{ textRight }}

      <ChevronRightIcon class="h-5 w-5" />
    </Button>
  </div>
</template>
