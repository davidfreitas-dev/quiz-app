<script setup>
import { computed } from 'vue';
import Avatar from '@/components/Avatar.vue';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  }
});

const userName = computed(() => {
  return props.user?.name?.split(' ')[0] || 'Visitante';
});
</script>

<template>
  <div class="relative w-full">
    <div class="bg-primary text-white p-5 pb-[70px] mb-5 flex justify-between items-center">
      <div class="flex flex-col">
        <h1 class="text-2xl font-bold mt-1 leading-1">
          Olá, {{ userName }}! 👋 
        </h1>
        <p class="text-sm opacity-90">
          É bom te ver novamente
        </p>
      </div>

      <div class="w-12 h-12 rounded-full bg-white shadow-md">
        <Avatar :image="props.user?.image" />
      </div>
    </div>
    
    <div class="absolute left-1/2 -bottom-12 transform -translate-x-1/2 w-[90%]">
      <slot name="user-stats" />
    </div>
  </div>
</template>
