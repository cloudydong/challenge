export const baseMethodTestTemplate = (method: any, ...args: any) => {
  const calledTimes = 1;
  expect(method).toHaveBeenCalledTimes(calledTimes);
  expect(method).toHaveBeenCalledWith(...args);
  return;
};
