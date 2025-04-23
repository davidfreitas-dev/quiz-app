<script setup>
import Heading from '@/components/Heading.vue';
import BackButton from '@/components/BackButton.vue';

const props = defineProps({
  showBackButton: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'Title',
  },
  route: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <nav class="relative flex justify-center p-5">
    <div class="w-full max-w-2xl relative flex items-center">
      <BackButton
        v-if="showBackButton"
        :route="route"
        class="absolute left-0 md:px-5"
      />
      <Heading
        size="lg"
        :text="title"
        class="text-white mx-auto"
      />
    </div>
  </nav>
</template>
