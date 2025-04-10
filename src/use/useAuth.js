import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { useException } from '@/use/useException';
import { useToast } from '@/use/useToast';

export function useAuth() {
  const isLoading = ref(false);

  const { handleException, exception } = useException();
  const { toast, toastData, handleToast } = useToast();

  const withLoading = async (fn) => {
    isLoading.value = true;    
    try {
      return await fn();
    } catch (err) {
      handleException(err.code);
      handleToast('error', exception.value);
    } finally {
      isLoading.value = false;
    }
  };

  const signIn = async ({ email, password }) => {
    const auth = getAuth();

    return withLoading(async () => {
      await signInWithEmailAndPassword(auth, email, password);
      return {
        status: 'success',
        message: 'Logado com sucesso!',
        data: auth.currentUser,
      };
    });
  };

  const signUp = async ({ email, password }) => {
    const auth = getAuth();

    return withLoading(async () => {
      await createUserWithEmailAndPassword(auth, email, password);
      return {
        status: 'success',
        message: 'Usuário criado com sucesso!',
        data: auth.currentUser,
      };
    });
  };

  const passwordReset = async (email) => {
    const auth = getAuth();

    return withLoading(async () => {
      await sendPasswordResetEmail(auth, email);
      return {
        status: 'success',
        message: 'Link de recuperação enviado com sucesso!',
      };
    });
  };

  const logOut = async () => {
    const auth = getAuth();

    return withLoading(async () => {
      await signOut(auth);
      return {
        status: 'success',
        message: 'Logout efetuado com sucesso!',
      };
    });
  };

  return {
    toast,
    toastData,
    isLoading,
    signUp,
    signIn,
    passwordReset,
    logOut,
  };
}
