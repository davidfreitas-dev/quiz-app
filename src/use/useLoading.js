import { ref } from 'vue';
import { useToast } from '@/use/useToast';

export function useLoading() {
  const isLoading = ref(false);
  
  const { showToast } = useToast();

  const withLoading = async (fn, errMsg = 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.') => {
    isLoading.value = true;
    try {
      await fn();
    } catch (err) {
      console.error('Erro na requisição:', err);
      showToast('error', errMsg);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    withLoading
  };
}
