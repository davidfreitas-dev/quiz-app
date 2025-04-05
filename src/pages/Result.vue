<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useStorage } from '@/use/useStorage';
import Container from '@/components/Container.vue';
import Button from '@/components/Button.vue';

const route = useRoute();
const router = useRouter();
const quiz = ref(undefined);

const getQuiz = async () => {
  const user = getStorage('user');

  const q = query(
    collection(db, 'results'), 
    where('idquiz', '==', Number(route.params.id)), 
    where('iduser', '==', user.id)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    quiz.value = doc.data();
  });
};

onMounted(async () => {
  getQuiz();
});

const message = computed(() => {
  switch (true) {
  case quiz.value.score >= 0 && quiz.value.score <= 4:
    return 'Que pena...';
  case quiz.value.score >= 5 && quiz.value.score <= 8:
    return 'É isso aí!';
  case quiz.value.score == 9:
    return 'Muito bem!';
  case quiz.value.score == 10:
    return 'Parabéns';
  default:
    return 'Nota não especificada nos intervalos.';
  }
});

const emoji = computed(() => {
  switch (true) {
  case quiz.value.score >= 0 && quiz.value.score <= 4:
    return '😕';
  case quiz.value.score >= 5 && quiz.value.score <= 8:
    return '😊';
  case quiz.value.score == 9:
    return '🤩';
  case quiz.value.score == 10:
    return '🥳';
  default:
    return 'Nota não especificada nos intervalos.';
  }
});

const { getStorage } = useStorage();
</script>

<template>
  <Container>
    <div
      v-if="quiz"
      class="flex flex-col items-center gap-3 min-h-screen"
    >
      <div class="text-9xl mt-10">
        {{ emoji }}
      </div>

      <div class="flex-1 text-5xl text-center font-extrabold leading-tight">
        {{ message }} Você tirou <span class="text-success">Nota {{ quiz.score }}</span>
      </div>

      <Button
        size="block"
        text="Voltar ao início"
        @click="router.push('/')"
      />
    </div>
  </Container>
</template>