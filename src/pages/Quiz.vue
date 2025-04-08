<script setup>
import { onMounted } from 'vue';
import { useQuiz } from '@/use/useQuiz';
import { RadioGroup, RadioGroupLabel, RadioGroupOption, } from '@headlessui/vue';
import Container from '@/components/Container.vue';
import QuizHeader from '@/components/QuizHeader.vue';
import QuestionOption from '@/components/QuestionOption.vue';
import Actions from '@/components/Actions.vue';
import Loader from '@/components/Loader.vue';
import Toast from '@/components/Toast.vue';

const {
  quiz,
  isLoading,
  isQuizDone,
  currentQuestionIndex,
  currentQuestion,
  isLastQuestion,
  progress,
  toast,
  toastData,
  loadUserFromStorage,
  fetchQuiz,
  selectOptionByValue,
  getCurrentSelectedOption,
  goToPreviousQuestion,
  goToNextQuestion,
  computeOptionClass,
} = useQuiz();

onMounted(async () => {
  loadUserFromStorage();
  await fetchQuiz();
});
</script>

<template>
  <Container>
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center w-full h-screen"
    >
      <Loader color="primary" />
    </div>

    <div
      v-if="!isLoading && quiz"
      class="quiz-container flex flex-col items-start w-full"
    >
      <QuizHeader
        v-if="currentQuestion"
        :quiz-id="quiz.id"
        :question-id="currentQuestion?.id"
        :total-questions="quiz.questions.length"
        :question-text="currentQuestion.question"
        :progress="progress"
      />
      
      <RadioGroup
        :model-value="getCurrentSelectedOption()"
        @update:model-value="selectOptionByValue"
        class="flex flex-1 flex-col items-start w-full gap-3 mb-3"
      >
        <RadioGroupLabel class="sr-only">
          Escolha uma opção
        </RadioGroupLabel>

        <RadioGroupOption
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          :value="option.option"
          v-slot="{ checked }"
          as="template"
        >
          <QuestionOption
            :option="option"
            :checked="checked"
            :is-quiz-done="isQuizDone"
            :correct-answer="currentQuestion.answer"
            :get-option-class="computeOptionClass"
          />
        </RadioGroupOption>
      </RadioGroup>

      <Actions
        class="mt-5"
        :text-left="currentQuestionIndex === 0 ? 'Voltar' : 'Anterior'"
        :text-right="isLastQuestion ? 'Finalizar' : 'Próxima'"
        @on-handle-left="goToPreviousQuestion"
        @on-handle-right="goToNextQuestion"
      />

      <Toast
        ref="toast"
        :toast-data="toastData"
      />
    </div>
  </Container>
</template>
