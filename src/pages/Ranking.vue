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
  <div class="flex flex-col h-screen">
    <Container class="bg-primary text-white pb-0 mb-5">
      <div class="relative flex items-center justify-center h-12">
        <BackButton route="/" class="absolute left-0" />
        <Heading
          size="lg"
          text="Ranking"
          class="text-white"
        />
      </div>
  
      <div v-if="topThree.length === 3" class="w-full flex justify-center items-end pt-3">
        <!-- 2º lugar -->
        <div class="flex flex-col items-center w-full">
          <img
            :src="topThree[1].image"
            class="w-16 h-16 rounded-full border-4 border-white shadow-md z-10"
            alt="Segundo colocado"
          >
          <p class="text-sm mt-2 font-semibold text-center">
            {{ splitUserName(topThree[1].name) }}
          </p>
          <div class="text-xs my-1 px-4 py-1.5 rounded-lg bg-white text-primary font-bold">
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
          <img
            :src="topThree[0].image"
            class="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-md z-10"
            alt="Primeiro colocado"
          >
          <p class="text-sm mt-2 font-bold text-center">
            {{ splitUserName(topThree[0].name) }}
          </p>
          <div class="text-xs my-1 px-4 py-1.5 rounded-lg bg-white text-primary font-bold">
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
          <img
            :src="topThree[2].image"
            class="w-16 h-16 rounded-full border-4 border-white shadow-md z-10"
            alt="Terceiro colocado"
          >
          <p class="text-sm mt-2 font-semibold text-center">
            {{ splitUserName(topThree[2].name) }}
          </p>
          <div class="text-xs my-1 px-4 py-1.5 rounded-lg bg-white text-primary font-bold">
            {{ topThree[2].score }} XP
          </div>
          <div class="bg-[#aea7ed] text-white px-3 py-1 mt-2 font-medium w-full text-center h-[55px]">
            <div class="flex flex-col justify-center h-full">
              <span class="text-3xl font-bold">3</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  
    <Container class="flex-1 overflow-y-auto px-5">
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
  </div>
</template>
