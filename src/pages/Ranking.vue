<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import Button from '@/components/Button.vue';

const router = useRouter();
const isLoading = ref(true);
const results = ref([]);
const users = ref([]);

const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));

  querySnapshot.forEach((doc) => {
    users.value.push({
      ...{ id: doc.id },
      ...{ score: 0 },
      ...doc.data()
    });
  });

  await getResults();

  isLoading.value = false;
};

const getResults = async () => {
  const querySnapshot = await getDocs(collection(db, 'results'));

  querySnapshot.forEach((doc) => {
    results.value.push({
      ...{ id: doc.id },
      ...doc.data()
    });
  });
};

const usersResults = computed(() => {
  const data = users.value.map(user => {
    results.value.forEach(result => {
      if (user.id === result.iduser) {
        user.score += result.score;
      }
    });

    return user;
  });

  return data.sort((a, b) => b.score - a.score);
});

onMounted(() => {
  getUsers();
});
</script>

<template>
  <div class="flex flex-col items-start w-full p-7">
    <Heading
      size="lg"
      text="Ranking"
    />

    <Text
      v-if="!isLoading && !usersResults.length"
      text="Nenhum participante cadastrado ainda :("
      class="text-center"
    />

    <div class="table w-full mt-5 mb-20">
      <table
        v-if="usersResults && usersResults.length"
        class="w-full text-sm"
      >
        <thead class="text-dark font-bold uppercase">
          <tr>
            <td
              class="py-3"
              width="7%"
            >
              #
            </td>
            <td
              class="p-1"
              width="83%"
            >
              Participante
            </td>
            <td
              class="py-3"
              width="10%"
            >
              Pontos
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in usersResults"
            :key="index"
          >
            <td
              class="py-3"
            >
              {{ index+1 }}
            </td>
            <td
              class="py-2"
            >
              <div class="flex items-center">
                <div
                  v-if="!user.image"
                  class="default-img bg-[url('@/assets/user.jpeg')] bg-cover bg-no-repeat bg-center w-10 h-10"
                />
              
                <img
                  v-else
                  :src="user.image"
                  :alt="`Imagem de ${user.name}`"
                  class="user-img mx-1 w-8 h-8 rounded-full"
                >

                <div class="pl-2">
                  <div class="font-semibold">
                    {{ user.name }}
                  </div>
                  
                  <div class="font-normal text-xs text-gray-500">
                    {{ user.email }}
                  </div>
                </div>  
              </div>
            </td>
            <td
              class="py-3"
              align="center"
            >
              {{ user.score }}
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="!usersResults || !usersResults.length"
        role="status"
        class="max-w-md space-y-4 divide-y divide-gray-200 animate-pulse"
      >
        <div
          v-for="(n, index) in 5"
          :key="index"
          class="flex items-center justify-between pt-4"
        >
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full w-24 mb-2.5" />
            <div class="w-32 h-2 bg-gray-200 rounded-full" />
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full w-12" />
        </div>
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div class="fixed left-0 bottom-0 w-full p-[5%]">
      <Button
        size="block"
        text="Voltar ao início"
        @click="router.push('/')"
      />
    </div>
  </div>
</template>