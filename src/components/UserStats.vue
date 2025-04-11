<script setup>
import { DocumentIcon, StarIcon, TrophyIcon } from '@heroicons/vue/24/outline';

defineProps({
  quizzes: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  ranking: {
    type: Number,
    default: 0
  },
});
</script>

<template>
  <div class="flex justify-between items-center bg-white text-gray-800 pt-4 w-full">
    <div class="flex-1 flex flex-col items-center text-center">
      <DocumentIcon class="w-5 h-5 text-primary mb-1" />
      <div class="text-lg font-bold">
        {{ quizzes }}
      </div>
      <div class="text-xs text-secondary uppercase font-medium">
        Provas
      </div>
    </div>

    <div class="w-px h-14 bg-gray-200 mx-2" />

    <div class="flex-1 flex flex-col items-center text-center">
      <TrophyIcon class="w-5 h-5 text-primary mb-1" />
      <div class="text-lg font-bold">
        {{ ranking }}
      </div>
      <div class="text-xs text-secondary uppercase font-medium">
        Ranking
      </div>
    </div>

    <div class="w-px h-14 bg-gray-200 mx-2" />

    <div class="flex-1 flex flex-col items-center text-center">
      <StarIcon class="w-5 h-5 text-primary mb-1" />
      <div class="text-lg font-bold">
        {{ points }}
      </div>
      <div class="text-xs text-secondary uppercase font-medium">
        Pontos
      </div>
    </div>
  </div>
</template>
