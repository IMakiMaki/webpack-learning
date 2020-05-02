export const one = () => {
  let test = '1221' + Math.random();
  return 'this is one function' + Math.random() + test;
};

export const two = () => {
  const length = Object.keys({ a: '1', b: '2', c: '3' }).length;
  return 'this is two function' + length + Math.random();
};
