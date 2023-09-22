export function useStorage() {
  const setStorage = (key, value) => {
    localStorage.setItem(`quiz-app.${key}`, JSON.stringify(value));
  };

  const getStorage = (key) => {
    const json = localStorage.getItem(`quiz-app.${key}`);
    return JSON.parse(json);
  };

  const removeStorage = (key) => {
    localStorage.removeItem(`quiz-app.${key}`);
  };

  return {
    setStorage,
    getStorage,
    removeStorage
  };
}