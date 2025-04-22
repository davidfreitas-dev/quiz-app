<script setup>
import Avatar from '@/components/Avatar.vue';

const props = defineProps({
  topThree: {
    type: Array,
    required: true
  },
  splitUserName: {
    type: Function,
    required: true
  }
});
</script>

<template>
  <div v-if="topThree.length === 3" class="bg-primary text-white w-full flex justify-center items-end px-5">
    <!-- 2º lugar -->
    <div class="flex flex-col items-center w-full">
      <Avatar :image="topThree[1].image" class="w-16 h-16 border-4 border-white" />
      <p class="text-sm mt-2 font-semibold text-center">
        {{ splitUserName(topThree[1].name) }}
      </p>
      <div class="text-xs mt-1 mb-3 px-4 py-1.5 rounded-lg bg-[#aea7ed] text-white font-bold">
        {{ topThree[1].score }} XP
      </div>
      <div class="bg-[#aea7ed] text-white px-3 py-1 mt-2 font-medium w-full text-center h-[70px]">
        <div class="flex flex-col justify-center h-full">
          <span class="text-3xl font-bold">2</span>
        </div>
      </div>
    </div>

    <!-- 1º lugar -->
    <div class="flex flex-col items-center w-full">
      <Avatar :image="topThree[0].image" class="w-20 h-20 border-4 border-yellow-400" />
      <p class="text-sm mt-2 font-bold text-center">
        {{ splitUserName(topThree[0].name) }}
      </p>
      <div class="text-xs mt-1 mb-3 px-4 py-1.5 rounded-lg bg-[#aea7ed] text-white font-bold">
        {{ topThree[0].score }} XP
      </div>
      <div class="bg-[#9a90e6] text-white px-3 py-1 mt-2 font-semibold w-full text-center h-[90px]">
        <div class="flex flex-col justify-center h-full">
          <span class="text-3xl font-bold">1</span>
        </div>
      </div>
    </div>

    <!-- 3º lugar -->
    <div class="flex flex-col items-center w-full">
      <Avatar :image="topThree[2].image" class="w-16 h-16 border-4 border-white" />
      <p class="text-sm mt-2 font-semibold text-center">
        {{ splitUserName(topThree[2].name) }}
      </p>
      <div class="text-xs mt-1 mb-3 px-4 py-1.5 rounded-lg bg-[#aea7ed] text-white font-bold">
        {{ topThree[2].score }} XP
      </div>
      <div class="bg-[#aea7ed] text-white px-3 py-1 mt-2 font-medium w-full text-center h-[55px]">
        <div class="flex flex-col justify-center h-full">
          <span class="text-3xl font-bold">3</span>
        </div>
      </div>
    </div>
  </div>
</template>
