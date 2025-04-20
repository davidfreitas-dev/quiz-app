import { ref } from 'vue';
import { useToast } from '@/use/useToast';

export function useLoading() {
  const isLoading = ref(false);
  
  const { toast, toastData, handleToast } = useToast();

  const withLoading = async (fn) => {
    isLoading.value = true;
    try {
      await fn();
    } catch (err) {
      console.error('Erro na requisição: ', err);
      handleToast('error', 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.');
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    withLoading,
    toastData,
    toast,
  };
}
