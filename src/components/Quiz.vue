<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/solid';
import Progressbar from '@/components/Progressbar.vue';
import Text from '@/components/Text.vue';
import Actions from '@/components/Actions.vue';
</script>

<template>
  <div class="quiz-container flex flex-col items-start gap-5 w-full min-h-screen p-7">
    <Text
      size="sm"
      weight="semibold"
      text="Questão 1 de 10"
    />

    <Progressbar progress="80" />

    <Text
      size="lg"
      weight="bold"
      text="Responda a pergunta selecionando uma das opções abaixo e clicando em continuar!"
    />

    <div class="options flex flex-1 flex-col items-start w-full gap-3">
      <div class="option flex items-center gap-2 p-5 w-full text-primary rounded-2xl bg-primary-light">
        <CheckCircleIcon class="h-6 w-6" />
        <label class="ml-2 text-sm font-semibold">
          Option 1
        </label>
      </div>

      <div class="option flex items-center gap-2 p-5 w-full text-font rounded-2xl bg-light">
        <span class="h-5 w-5 mr-1 border-2 border-gray-200 rounded-full" />
        <label class="ml-2 text-sm font-semibold">
          Option 2
        </label>
      </div>

      <div class="option flex items-center gap-2 p-5 w-full text-font rounded-2xl bg-light">
        <span class="h-5 w-5 mr-1 border-2 border-gray-200 rounded-full" />
        <label class="ml-2 text-sm font-semibold">
          Option 3
        </label>
      </div>

      <div class="option flex items-center gap-2 p-5 w-full text-font rounded-2xl bg-light">
        <span class="h-5 w-5 mr-1 border-2 border-gray-200 rounded-full" />
        <label class="ml-2 text-sm font-semibold">
          Option 4
        </label>
      </div>

      <div class="option flex items-center gap-2 p-5 w-full text-font rounded-2xl bg-light">
        <span class="h-5 w-5 mr-1 border-2 border-gray-200 rounded-full" />
        <label class="ml-2 text-sm font-semibold">
          Option 5
        </label>
      </div>
    </div>

    <Actions />
  </div>
</template>