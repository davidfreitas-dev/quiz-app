import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';

export function useAuth() {
  const signIn = async (payload) => {
    let result;

    const auth = getAuth();

    await signInWithEmailAndPassword(auth, payload.email, payload.password)
      .then((res) => {
        result = {
          status: 'success',
          message: 'Logado com sucesso!',
          data: auth.currentUser
        };
      })
      .catch((err) => {
        result = {
          code: err.code,
          status: 'error',
          message: err.message
        };
      });

    return result;
  };

  const signUp = async (payload) => {
    let result;

    const auth = getAuth();

    await createUserWithEmailAndPassword(auth, payload.email, payload.password)
      .then((res) => {
        result = {
          status: 'success',
          message: 'Logado com sucesso!',
          data: auth.currentUser
        };
      })
      .catch((err) => {
        result = {
          code: err.code,
          status: 'error',
          message: err.message
        };
      });

    return result;
  };

  const passwordReset = async (email) => {
    let result;

    const auth = getAuth();

    await sendPasswordResetEmail(auth, email)
      .then((res) => {
        result = {
          status: 'success',
          message: 'Link de recuperação enviado com sucesso!'
        };
      })
      .catch((err) => {
        result = {
          code: err.code,
          status: 'error',
          message: err.message
        };
      });

    return result;
  };

  const logOut = async () => {
    let result;

    const auth = getAuth();

    await signOut(auth)
      .then((res) => {
        result = {
          status: 'success',
          message: 'Logout efetuado com sucesso!'
        };
      })
      .catch((err) => {
        result = {
          code: err.code,
          status: 'error',
          message: err.message
        };
      });

    return result;
  };

  return {
    signUp,
    signIn,
    passwordReset,
    logOut
  };
}