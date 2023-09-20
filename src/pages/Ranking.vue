<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import { useRouter } from 'vue-router';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import Button from '@/components/Button.vue';
import Loader from '@/components/Loader.vue';

const router = useRouter();

const users = ref([]);

const loadUsers = async () => {
  let data = [];

  const querySnapshot = await getDocs(collection(db, 'users'));

  querySnapshot.forEach((doc) => {
    data.push({
      ...{ id: doc.id },
      ...doc.data()
    });
  });

  users.value = data.sort((a, b) => b.score - a.score);
};

const isLoading = ref(true);

onMounted(async () => {
  await loadUsers();
  isLoading.value = false;
});
</script>

<template>
  <div class="flex flex-col items-start w-full min-h-screen p-7">
    <Heading
      size="lg"
      text="Ranking"
    />
    
    <div
      v-if="isLoading"
      class="flex-1 flex flex-col items-center justify-center w-full"
    >
      <Loader color="primary" />
    </div>

    <Text
      v-if="!isLoading && !users.length"
      text="Nenhum participante cadastrado ainda :("
      class="text-center"
    />

    <div
      v-if="!isLoading && users.length"
      class="flex-1 relative overflow-x-auto w-full mt-5"
    >
      <table class="w-full text-sm text-left text-gray-500 overflow-hidden">
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
              class="p-3"
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

            <td class="p-3">
              {{ user.name }}
            </td>

            <td
              align="right"
              class="p-4"
            >
              {{ user.score }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Button
      size="block"
      text="Voltar ao início"
      @click="router.push('/')"
    />
  </div>
</template>