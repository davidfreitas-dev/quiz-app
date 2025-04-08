<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import { RadioGroupLabel } from '@headlessui/vue';

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
  checked: {
    type: Boolean,
    default: false,
  },
  getOptionClass: {
    type: Function,
    default: () => () => '',
  },
});
</script>

<template>
  <div :class="getOptionClass(option, checked)">
    <div class="ml-2">
      <RadioGroupLabel class="text-sm font-semibold">
        {{ option.option }}. {{ option.desc }}
      </RadioGroupLabel>
    </div>
      
    <CheckCircleIcon
      v-if="checked"
      class="h-6 w-6"
    />
  </div>
</template>
