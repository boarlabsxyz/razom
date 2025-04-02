const CODE_MIN = 1000;
const CODE_MAX = 9999;

export const generateSecureCode = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return (CODE_MIN + (array[0] % (CODE_MAX - CODE_MIN + 1))).toString();
};
