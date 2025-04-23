<script setup>
import { ref, watch, computed } from 'vue';
import { TransitionRoot } from '@headlessui/vue';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  toastData: {
    type: Object,
    default: () => ({})
  }
});

const isShowing = ref(false);

const showToast = () => {
  isShowing.value = true;
};

watch(isShowing, (newIsShowing) => {
  if (newIsShowing) {
    setTimeout(() => {
      isShowing.value = false;
    }, 2500);
  }
});

defineExpose({ showToast });

// Computa o ícone com base no tipo
const ToastIcon = computed(() => {
  switch (props.toastData.type) {
  case 'success':
    return CheckCircleIcon;
  case 'error':
    return ExclamationCircleIcon;
  case 'info':
  default:
    return InformationCircleIcon;
  }
});
</script>    

<template>
  <TransitionRoot
    :show="isShowing"
    enter="transition-opacity duration-75"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transition-opacity duration-150"
    leave-from="opacity-100"
    leave-to="opacity-0"
  >
    <div
      id="toast"
      role="alert"
      class="toast"
      :class="{
        'bg-success text-white': props.toastData.type === 'success',
        'bg-red-400 text-white': props.toastData.type === 'error',
        'bg-yellow-400 text-white': props.toastData.type === 'info'
      }"
    >
      <!-- Ícone -->
      <component :is="ToastIcon" class="w-5 h-5" />

      <!-- Mensagem -->
      <div class="toast-content">
        {{ props.toastData.message }}
      </div>
    </div>
  </TransitionRoot>
</template>
  
<style scoped>
.toast {
  @apply fixed top-5 -translate-x-1/2 left-1/2 flex items-center p-4 mb-4 w-[90%] max-w-sm rounded-lg shadow-md gap-2;
}
.toast-content {
  @apply font-normal text-sm;
}
</style>
