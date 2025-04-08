<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';
import Container from '@/components/Container.vue';
import Heading from '@/components/Heading.vue';
import Button from '@/components/Button.vue';

const router = useRouter();
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
  <Container>
    <Heading size="lg" text="Ranking" />

    <div v-if="!isLoading && usersResults.length" class="text-center w-full my-4">
      <div class="bg-primary-light text-primary p-5 rounded-xl text-sm font-medium">
        Você está melhor que {{ currentPercentile }}% dos jogadores!
      </div>
    </div>

    <!-- PÓDIO -->
    <div v-if="topThree.length === 3" class="flex justify-center items-end">
      <!-- 2º lugar -->
      <div class="flex flex-col items-center w-28 translate-y-3">
        <img
          :src="topThree[1].image"
          class="w-16 h-16 rounded-full border-4 border-gray-200 shadow-md"
          alt="Segundo colocado"
        >
        <p class="text-sm mt-2 text-gray-700 font-semibold text-center">
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
        <p class="text-sm mt-2 text-gray-700 font-bold text-center">
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
        <p class="text-sm mt-2 text-gray-700 font-semibold text-center truncate">
          {{ splitUserName(topThree[2].name) }}
        </p>
        <div class="text-xs bg-gray-100 px-4 py-2 rounded-lg mt-1 shadow text-gray-800 font-medium">
          {{ topThree[2].score }} pontos
        </div>
      </div>
    </div>

    <!-- RANKING COMPLETO -->
    <div class="space-y-3">
      <div
        v-for="(user, index) in others"
        :key="user.id"
        class="flex items-center justify-between bg-white rounded-xl shadow p-3"
      >
        <div class="flex items-center gap-3">
          <span class="font-bold w-6 text-right">{{ index + 4 }}</span>
          <img
            :src="user.image || '../assets/user.png'"
            class="w-8 h-8 rounded-full"
            :alt="`Imagem de ${user.name}`"
          >
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

    <!-- BOTÃO -->
    <div class="fixed left-0 bottom-0 w-full p-5 bg-white">
      <Button size="block" @click="router.push('/')">
        Voltar ao início
      </Button>
    </div>
  </Container>
</template>
