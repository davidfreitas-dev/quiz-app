<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/Button.vue';

const router = useRouter();

const count = ref(10);

const message = computed(() => {
  switch (true) {
  case count.value >= 0 && count.value <= 4:
    return 'Que pena...';
  case count.value >= 5 && count.value <= 8:
    return 'É isso aí!';
  case count.value == 9:
    return 'Muito bem!';
  case count.value == 10:
    return 'Parabéns';
  default:
    return 'Nota não especificada nos intervalos.';
  }
});

const emoji = computed(() => {
  switch (true) {
  case count.value >= 0 && count.value <= 4:
    return '😕';
  case count.value >= 5 && count.value <= 8:
    return '😊';
  case count.value == 9:
    return '🤩';
  case count.value == 10:
    return '🥳';
  default:
    return 'Nota não especificada nos intervalos.';
  }
});
</script>

<template>
  <div class="flex flex-col items-center gap-3 p-7 min-h-screen">
    <div class="text-9xl mt-10">
      {{ emoji }}
    </div>

    <div class="flex-1 text-5xl text-center font-extrabold leading-tight">
      {{ message }} Você tirou <span class="text-success">Nota {{ count }}</span>
    </div>

    <Button
      size="block"
      text="Voltar ao início"
      @click="router.push('/')"
    />
  </div>
</template>