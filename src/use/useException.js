import { ref } from 'vue';

const errorMessages = {
  'auth/invalid-login-credentials': 'Credenciais de login inválidas.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/email-already-in-use': 'Este e-mail já foi utilizado por outro usuário.',
  'auth/user-not-found': 'Nenhuma conta encontrada para este e-mail.',
  'auth/too-many-requests': 'Conta bloqueada por excesso de tentativas.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/weak-password': 'Sua senha deve possuir no mínimo 6 caracteres.',
  'auth/user-disabled': 'Conta inativa.',
  'auth/internal-error': 'Erro interno. Contate o administrador do sistema.',
  'auth/popup-closed-by-user': 'O pop-up foi fechado antes da conclusão.',
  'auth/network-request-failed': 'Falha na conexão. Verifique sua internet.'
};

export function useException() {
  const exception = ref('');

  const handleException = (code) => {
    exception.value = errorMessages[code] || 'Ocorreu um erro inesperado. Tente novamente.';
  };

  return {
    handleException,
    exception
  };
}
