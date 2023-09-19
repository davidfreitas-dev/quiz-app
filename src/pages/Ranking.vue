<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import Heading from '@/components/Heading.vue';

const users = ref(undefined);

const loadUsers = async () => {
  let data = [];

  const querySnapshot = await getDocs(collection(db, 'users'));

  querySnapshot.forEach((doc) => {
    data.push({
      ...{ id: doc.id },
      ...doc.data()
    });
  });

  users.value = data;
};

onMounted(async () => {
  await loadUsers();
});

const totalScore = (quizzes) =>{
  return quizzes
    .map(quiz => quiz.score * 1)
    .reduce((total, current) => total + current, 0);
};
</script>

<template>
  <div class="flex flex-col items-start w-full min-h-screen p-7">
    <Heading
      size="lg"
      text="Ranking"
    />

    <div class="relative overflow-x-auto w-full mt-5">
      <table class="w-full text-sm text-left text-gray-500">
        <thead class="text-xs text-primary-font uppercase">
          <tr>
            <th
              scope="col"
              class="py-3"
            >
              #
            </th>
            <th
              scope="col"
              class="px-6 py-3"
            >
              Participante
            </th>
            <th
              scope="col"
              class="py-3"
              align="right"
            >
              Pontos
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in users"
            :key="index"
            class="bg-white"
          >
            <th
              scope="row"
              class="py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              {{ index+1 }}  
            </th>

            <td class="px-6 py-4">
              {{ user.name }}
            </td>

            <td
              align="right"
              class="p-4"
            >
              {{ totalScore(user.quizzes) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>