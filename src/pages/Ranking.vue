<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useQuizStore } from '@/stores/quiz';
import NavBar from '@/components/NavBar.vue';
import Podium from '@/components/Podium.vue';
import Avatar from '@/components/Avatar.vue';
import Container from '@/components/Container.vue';

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
    <NavBar route="/" class="bg-primary" />
    <Podium :top-three="topThree" :split-user-name="splitUserName" />
    <Container class="flex-1 overflow-y-auto bg-light">
      <div
        v-for="(user, index) in others"
        :key="user.id"
        class="flex items-center justify-between bg-white rounded-xl shadow-lg py-4 px-5 mb-3"
      >
        <div class="flex items-center gap-5">
          <span class="font-medium text-gray-500">{{ index + 4 }}</span>
          <Avatar :image="user?.image" class="w-10 h-10" />
          <div class="">
            <div class="text-sm font-semibold leading-6">
              {{ user.name }}
            </div>
            <div class="text-xs text-gray-400">
              {{ user.score }} pontos
            </div>
          </div>
        </div>
        <!-- <span class="font-bold text-sm">{{ user.score }} pts</span> -->
      </div>
    </Container>
  </div>
</template>
