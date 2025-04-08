<script setup>
import { computed } from 'vue';
import Heading from '@/components/Heading.vue';
import Avatar from '@/components/Avatar.vue';
import Text from '@/components/Text.vue';

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
  <div class="flex justify-between items-center w-full mb-5">
    <div class="flex flex-col items-start">
      <Heading
        size="lg"
        :text="`👋 Olá ${userName},`"
      />
      <Text
        text="É bom vê-lo novamente!"
        class="text-center mt-1"
      />
    </div>

    <Avatar :image="props.user?.image" />
  </div>
</template>
