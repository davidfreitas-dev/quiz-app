import { ref } from 'vue';

const toast = ref(null);

const toastData = ref({
  message: '',
  type: 'error'
});

const showToast = (type, message) => {
  toastData.value.type = type;
  toastData.value.message = message;
  toast.value?.showToast();
};

export function useToast() {
  return {
    toast,
    toastData,
    showToast
  };
}
