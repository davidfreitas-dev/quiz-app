<script setup>
import { ref } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import Button from '@/components/Button.vue';

const emit = defineEmits(['onModalClose']);

const open = ref(false);

const setClose = () => {
  open.value = false;
};

const setOpen = () => {
  open.value = true;
};

const closeModal = () => {
  emit('onModalClose');
  setClose();
};

defineExpose({
  setOpen,
  closeModal
});
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
      @close="closeModal"
    >
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div class="relative p-4 w-full max-w-md max-h-full z-50">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <DialogPanel class="relative bg-white rounded-lg shadow-sm w-full">
            <!-- Botão de fechar -->
            <button
              type="button"
              class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 w-8 h-8 rounded-lg text-sm inline-flex justify-center items-center"
              @click="closeModal"
            >
              <XMarkIcon class="h-6 w-6" />
              <span class="sr-only">Close modal</span>
            </button>

            <div class="p-4 md:p-5 text-center">
              <!-- Ícone (slot opcional) -->
              <div v-if="$slots.icon" class="flex justify-center mb-4">
                <slot name="icon" />
              </div>

              <!-- Título (slot opcional) -->
              <div v-if="$slots.title" class="mb-5 text-left">
                <DialogTitle as="h3" class="text-lg font-semibold text-gray-800">
                  <slot name="title" />
                </DialogTitle>
              </div>

              <!-- Conteúdo principal -->
              <div class="modal-body overflow-y-auto text-gray-600 font-medium my-5 p-0.5">
                <slot />
              </div>

              <!-- Ações -->
              <slot name="actions">
                <div class="flex justify-center gap-3">
                  <Button color="primary" @click="closeModal">
                    Confirmar
                  </Button>
                  <Button color="outline" @click="closeModal">
                    Cancelar
                  </Button>
                </div>
              </slot>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
 /* Melhora o desempenho de rolagem em dispositivos móveis */
.modal-body {
  -webkit-overflow-scrolling: touch;
}

/* Oculta a barra de rolagem */
.modal-body::-webkit-scrollbar {
  display: none;
}
</style>