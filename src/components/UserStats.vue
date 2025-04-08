<script setup>
import { StarIcon, TrophyIcon } from '@heroicons/vue/24/solid';

defineProps({
  points: {
    type: Number,
    default: 0
  },
  ranking: {
    type: Number,
    default: 0
  }
});
</script>

<template>
  <div class="flex items-center justify-between w-full max-w-sm bg-white text-gray-800 py-1 rounded-2xl shadow-lg">
    <div class="flex flex-1 items-center justify-start p-5 gap-3">
      <div class="bg-primary/10 rounded-full p-3">
        <StarIcon class="w-6 h-6 text-primary" />
      </div>
      <div class="text-sm leading-tight">
        <div class="text-lg font-bold">
          {{ points }}
        </div>
        <div class="text-xs text-gray-500">
          XP
        </div>
      </div>
    </div>

    <div class="w-px h-10 bg-gray-200" />

    <div class="flex flex-1 items-center justify-start p-5 gap-3">
      <div class="bg-primary/10 rounded-full p-3">
        <TrophyIcon class="w-6 h-6 text-primary" />
      </div>
      <div class="text-sm leading-tight">
        <div class="text-lg font-bold">
          {{ ranking }}
        </div>
        <div class="text-xs text-gray-500">
          Ranking
        </div>
      </div>
    </div>
  </div>
</template>
