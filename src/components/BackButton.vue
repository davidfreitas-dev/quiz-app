<script setup>
import { useRouter } from 'vue-router';
import { ArrowLeftIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  route: {
    type: String,
    default: '',
  },
});

const router = useRouter();

const handleBack = () => {
  if (!props.route) {
    router.go(-1);
  } else {
    router.push(props.route);
  }
};
</script>

<template>
  <button @click="handleBack" class="text-white hover:text-white/80">
    <ArrowLeftIcon class="w-6 h-6" />
  </button>
</template>
