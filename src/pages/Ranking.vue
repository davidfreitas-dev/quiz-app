<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase-firestore';
import Heading from '@/components/Heading.vue';
import Text from '@/components/Text.vue';
import Button from '@/components/Button.vue';
import Loader from '@/components/Loader.vue';

const router = useRouter();

const users = ref([]);

const isLoading = ref(true);

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

  isLoading.value = false;
};

onMounted(async () => {
  await loadUsers();
});
</script>

<template>
  <div class="flex flex-col items-start w-full p-7">
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

    <div class="table w-full mt-5 mb-20">
      <table
        v-if="!isLoading && users.length"
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
            v-for="(user, index) in users"
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