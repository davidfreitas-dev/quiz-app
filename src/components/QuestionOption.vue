<script setup>
import { computed } from 'vue';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid';
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
  showResultIcons: {
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

const iconToShow = computed(() => {
  const { showResultIcons, checked, option, correctAnswer } = props;

  const isCorrectAnswer = option.option === correctAnswer;

  if (showResultIcons) {
    if (isCorrectAnswer) {
      return {
        icon: CheckCircleIcon,
        class: 'text-success',
      };
    }

    if (checked && !isCorrectAnswer) {
      return {
        icon: XCircleIcon,
        class: 'text-red-400',
      };
    }

    return null;
  }

  if (checked) {
    return {
      icon: CheckCircleIcon,
      class: '',
    };
  }

  return null;
});
</script>

<template>
  <div :class="getOptionClass(option, checked)">
    <div class="w-[90%] ml-2">
      <RadioGroupLabel class="text-sm font-semibold">
        {{ option.option }}. {{ option.desc }}
      </RadioGroupLabel>
    </div>

    <component
      v-if="iconToShow"
      :is="iconToShow.icon"
      :class="iconToShow.class"
      class="w-6 h-6"
    />
  </div>
</template>
