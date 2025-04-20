<script setup>
import { onMounted } from 'vue';
import { useQuiz } from '@/use/useQuiz';
import { RadioGroup, RadioGroupLabel, RadioGroupOption, } from '@headlessui/vue';
import Container from '@/components/Container.vue';
import QuizHeader from '@/components/QuizHeader.vue';
import QuestionOption from '@/components/QuestionOption.vue';
import NavActions from '@/components/NavActions.vue';
import PageLoader from '@/components/PageLoader.vue';

const {
  quiz,
  isQuizDone,
  isLoading,
  currentQuestionIndex,
  currentQuestion,
  isLastQuestion,
  progress,
  fetchQuiz,
  selectOptionByValue,
  getCurrentSelectedOption,
  goToPreviousQuestion,
  goToNextQuestion,
  computeOptionClass,
} = useQuiz();

onMounted(async () => {
  await fetchQuiz();
});
</script>

<template>
  <Container>
    <PageLoader :visible="isLoading" />

    <div v-if="!isLoading && quiz" class="quiz-container flex flex-col items-start w-full">
      <QuizHeader
        v-if="currentQuestion"
        :quiz-id="quiz.id"
        :question-id="currentQuestion?.id"
        :total-questions="quiz.totalQuestions"
        :question-text="currentQuestion.text"
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
            :show-result-icons="isQuizDone"
            :correct-answer="currentQuestion.answer"
            :get-option-class="computeOptionClass"
          />
        </RadioGroupOption>
      </RadioGroup>

      <NavActions
        class="mt-5"
        :text-left="currentQuestionIndex === 0 ? 'Voltar' : 'Anterior'"
        :text-right="isLastQuestion ? 'Finalizar' : 'Próxima'"
        @on-handle-left="goToPreviousQuestion"
        @on-handle-right="goToNextQuestion"
      />
    </div>
  </Container>
</template>
