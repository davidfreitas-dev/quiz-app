import { ref } from 'vue';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { useException } from '@/use/useException';
import { useToast } from '@/use/useToast';

export function useAuth() {
  const isLoading = ref(false);

  const { handleException, exception } = useException();
  const { toast, toastData, showToast } = useToast();

  const withLoading = async (fn) => {
    isLoading.value = true;    
    try {
      return await fn();
    } catch (err) {
      handleException(err.code);
      showToast('error', exception.value);
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

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    return withLoading(async () => {
      const result = await signInWithPopup(auth, provider);
      return {
        status: 'success',
        message: 'Login com Google realizado com sucesso!',
        data: result.user,
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
    signInWithGoogle
  };
}
