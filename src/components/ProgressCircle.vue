<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  percentage: {
    type: Number,
    required: true,
    validator: (v) => v >= 0 && v <= 100,
  },
  value: {
    type: Number,
    required: true,
  }
});

const CIRCUMFERENCE = 2 * Math.PI * 45;

const animatedValue = ref(0);
const animatedPercentage = ref(0);
const duration = 500; // duração da animação em ms

const dashOffset = computed(() => {
  return CIRCUMFERENCE - (CIRCUMFERENCE * animatedPercentage.value / 100);
});

watch(
  () => [props.value, props.percentage],
  ([newVal, newPercent]) => {
    const startValue = animatedValue.value;
    const startPercent = animatedPercentage.value;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      animatedValue.value = startValue + (newVal - startValue) * progress;
      animatedPercentage.value = startPercent + (newPercent - startPercent) * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },
  { immediate: true }
);
</script>

<template>
  <div class="relative w-14 h-14">
    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="#E5E7EB"
        stroke-width="10"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="#61cdb9"
        stroke-width="10"
        fill="none"
        stroke-linecap="round"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <div class="font-bold">
        {{ Math.round(animatedValue) }}
      </div>
    </div>
  </div>
</template>
