<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';
import Container from '@/components/Container.vue';
import Heading from '@/components/Heading.vue';
import BackButton from '@/components/BackButton.vue';
import Avatar from '@/components/Avatar.vue';

const quizStore = useQuizStore();
const { usersResults, isLoading } = storeToRefs(quizStore);

const topThree = computed(() => {
  return Array.isArray(usersResults.value)
    ? usersResults.value.slice(0, 3)
    : [];
});

const others = computed(() => {
  return Array.isArray(usersResults.value)
    ? usersResults.value.slice(3)
    : [];
});

const currentUserIndex = computed(() => {
  return usersResults.value.findIndex(u => u.email === 'seu@email.com'); // <- Substitua pelo usuário atual
});

const currentPercentile = computed(() => {
  if (usersResults.value.length === 0 || currentUserIndex.value === -1) return 0;
  return Math.floor(((usersResults.value.length - currentUserIndex.value - 1) / usersResults.value.length) * 100);
});

const splitUserName =(name) => {
  return name.split(' ')[0];
};

onMounted(async () => {
  await quizStore.fetchUsersAndResults();
});
</script>

<template>
  <div class="bg-primary text-white p-5 mb-5 flex flex-col">
    <div class="relative flex items-center justify-center h-12">
      <BackButton route="/" class="absolute left-0" />
      <Heading size="lg" text="Ranking" />
    </div>
  
    <div v-if="topThree.length === 3" class="podio w-full flex justify-center items-end pt-5 pb-10">
      <!-- 2º lugar -->
      <div class="flex flex-col items-center w-28 translate-y-3">
        <img
          :src="topThree[1].image"
          class="w-16 h-16 rounded-full border-4 border-gray-200 shadow-md"
          alt="Segundo colocado"
        >
        <p class="text-sm mt-2 font-semibold text-center">
          {{ splitUserName(topThree[1].name) }}
        </p>
        <div class="text-xs bg-gray-100 px-4 py-2 rounded-lg mt-1 shadow text-gray-800 font-medium">
          {{ topThree[1].score }} pontos
        </div>
      </div>

      <!-- 1º lugar -->
      <div class="flex flex-col items-center w-28">
        <img
          :src="topThree[0].image"
          class="w-[80px] h-[80px] rounded-full border-4 border-yellow-400 shadow-lg"
          alt="Primeiro colocado"
        >
        <p class="text-sm mt-2 font-bold text-center">
          {{ splitUserName(topThree[0].name) }}
        </p>
        <div class="text-xs bg-gray-100 text-gray-800 px-4 py-2 rounded-lg mt-1 shadow font-semibold">
          {{ topThree[0].score }} pontos
        </div>
      </div>

      <!-- 3º lugar -->
      <div class="flex flex-col items-center w-28 translate-y-7">
        <img
          :src="topThree[2].image"
          class="w-16 h-16 rounded-full border-4 border-gray-200 shadow-md"
          alt="Terceiro colocado"
        >
        <p class="text-sm mt-2 font-semibold text-center truncate">
          {{ splitUserName(topThree[2].name) }}
        </p>
        <div class="text-xs bg-gray-100 px-4 py-2 rounded-lg mt-1 shadow text-gray-800 font-medium">
          {{ topThree[2].score }} pontos
        </div>
      </div>
    </div>
  </div>
  <Container>
    <!-- RANKING COMPLETO -->
    <div class="ranking w-full space-y-3 mb-5">
      <div
        v-for="(user, index) in others"
        :key="user.id"
        class="flex items-center justify-between bg-white rounded-xl shadow p-4"
      >
        <div class="flex items-center gap-3">
          <span class="font-bold">{{ index + 4 }}</span>
          <Avatar :image="user?.image" class="w-8 h-8" />
          <div>
            <div class="text-sm font-semibold">
              {{ user.name }}
            </div>
            <div class="text-xs text-gray-400">
              {{ user.email }}
            </div>
          </div>
        </div>
        <span class="font-bold text-sm">{{ user.score }} pts</span>
      </div>
    </div>
  </Container>
</template>
