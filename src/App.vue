<script setup>
import { RouterView } from 'vue-router';
import { useToast } from '@/use/useToast';
import Toast from '@/components/Toast.vue';

const { toast, toastData } = useToast();
</script>

<template>
  <RouterView />
  <Toast ref="toast" :toast-data="toastData" />
</template>