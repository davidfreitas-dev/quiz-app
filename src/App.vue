<script setup>
import { RouterView } from 'vue-router';
import { useToast } from '@/use/useToast';
import Toast from '@/components/Toast.vue';

const { toast, toastData } = useToast();
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition
      appear
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <component :is="Component" />
    </Transition>
  </RouterView>
  
  <Toast ref="toast" :toast-data="toastData" />
</template>
