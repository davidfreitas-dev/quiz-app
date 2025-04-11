<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useAuth } from '@/use/useAuth';
import { ExclamationTriangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid';

import Container from '@/components/Container.vue';
import Avatar from '@/components/Avatar.vue';
import BackButton from '@/components/BackButton.vue';
import Heading from '@/components/Heading.vue';
import UserStats from '@/components/UserStats.vue';
import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';

const router = useRouter();

const { logOut } = useAuth();

const { user } = storeToRefs(useUserStore()); 

const modalRef = ref(null);

const showModal = () => {
  modalRef.value?.setOpen();
};

const closeModal = () => {
  modalRef.value?.closeModal();
};

const signOut = async () => {
  const response = await logOut();
  if (response.status === 'success') {
    router.push('/signin');
  }
};
</script>

<template>
  <div class="relative w-full">
    <div class="bg-primary text-white p-5 h-[146px] flex justify-between items-start">
      <div class="flex items-center justify-between w-full">
        <BackButton route="/" />
        <Heading
          size="lg"
          text="Perfil"
          class="text-white"
        />
        <div class="w-6" />
      </div>
    </div>
        
    <div class="absolute left-1/2 -bottom-[180px] transform -translate-x-1/2 w-[90%]">
      <div class="relative flex flex-col items-center gap-3 bg-white shadow-lg p-5 rounded-xl pt-12">
        <div class="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <Avatar :image="user.image" class="w-20 h-20 rounded-full" />
        </div>
        <div class="flex flex-col items-center">
          <span class="font-semibold text-lg">{{ user.name }}</span>
          <span class="text-sm text-secondary">{{ user.email }}</span>
        </div>
        <UserStats
          :quizzes="2"
          :points="18"
          :ranking="1"
        />
      </div>
    </div>
  </div>

  <Container class="mt-48">
    <Button size="block" @click="showModal">
      Encerrar Sessão
      <ArrowRightOnRectangleIcon class="h-5 w-5 ml-3" />
    </Button>
  </Container>

  <Modal ref="modalRef" @on-modal-confirm="signOut">
    <template #icon>
      <ExclamationTriangleIcon class="h-8 w-8 text-yellow-400" />
    </template>  
    Deseja realmente sair e finalizar a sessão?
  </Modal>
</template>