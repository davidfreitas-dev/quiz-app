<script setup>
import { UserIcon } from '@heroicons/vue/24/outline';
import { EnvelopeIcon } from '@heroicons/vue/24/outline';
import { LockClosedIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  type: { 
    type: String, 
    default: '' 
  },
  icon: { 
    type: String, 
    default: '' 
  },
  text: { 
    type: String, 
    default: '' 
  },
  modelValue: { 
    type: [ String, Number ], 
    default: null 
  }
});
const emit = defineEmits(['update:modelValue', 'onKeyupEnter']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <div class="flex items-center gap-2 w-full h-12 rounded-xl border-2 border-secondary-light bg-white focus-within:ring-2 ring-primary transition-colors p-4">
    <UserIcon
      v-if="(icon === 'UserIcon')"
      class="w-5 h-5 text-gray-400"
    />
    
    <EnvelopeIcon
      v-if="(icon === 'EnvelopeIcon')"
      class="w-5 h-5 text-gray-400"
    />

    <LockClosedIcon
      v-if="(icon === 'LockClosedIcon')"
      class="w-5 h-5 text-gray-400"
    />

    <input
      className="bg-transparent flex-1 text-dark text-sm font-medium placeholder:text-gray-400 outline-none"
      :type="type"
      :value="modelValue"
      :placeholder="text"
      @input="updateValue"
      @keyup.enter="$emit('onKeyupEnter')"
    >
  </div>
</template>