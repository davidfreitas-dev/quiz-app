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
  <div class="flex items-center justify-between w-full max-w-sm bg-primary text-white py-1 rounded-2xl shadow-lg">
    <!-- Experience Points -->
    <div class="flex flex-1 items-center justify-start p-5 gap-3">
      <div class="bg-white/20 rounded-full p-3">
        <StarIcon class="w-6 h-6 text-white" />
      </div>
      <div class="text-sm leading-tight">
        <div class="text-lg font-bold">
          {{ points }}
        </div>
        <div class="text-xs">
          Points
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="w-px h-10 bg-white/40" />

    <!-- Ranking -->
    <div class="flex flex-1 items-center justify-start p-5 gap-3">
      <div class="bg-white/20 rounded-full p-3">
        <TrophyIcon class="w-6 h-6 text-white" />
      </div>
      <div class="text-sm leading-tight">
        <div class="text-lg font-bold">
          {{ ranking }}
        </div>
        <div class="text-xs">
          Ranking
        </div>
      </div>
    </div>
  </div>
</template>
