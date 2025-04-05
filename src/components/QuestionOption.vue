<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import { RadioGroupLabel, RadioGroupDescription } from '@headlessui/vue';

const props = defineProps({
  option: {
    type: Object,
    default: () => ({}),
  },
  checked: {
    type: Boolean,
    default: false,
  },
  isQuizDone: {
    type: Boolean,
    default: false,
  },
  correctAnswer: {
    type: String,
    default: '',
  },
  getOptionClass: {
    type: Function,
    default: () => () => '',
  },
});
</script>

<template>
  <div :class="getOptionClass(option, checked)">
    <CheckCircleIcon
      v-if="checked"
      class="h-6 w-6"
    />

    <span
      v-else
      class="h-5 w-5 mr-1 border-2 border-secondary-light rounded-full"
      :class="{
        'border-success border-opacity-20':
          isQuizDone && option.option === correctAnswer,
      }"
    />

    <div class="ml-2">
      <RadioGroupLabel class="text-sm font-semibold">
        {{ option.desc }}
      </RadioGroupLabel>

      <RadioGroupDescription
        v-if="option.description"
        class="text-xs text-gray-500"
      >
        {{ option.description }}
      </RadioGroupDescription>
    </div>
  </div>
</template>
