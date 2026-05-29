export const generateOrderId = (radix: number, length: number): string => {
  const id = `ORD-${Math.random().toString(radix).substr(2, length).toUpperCase()}`;
  return id;
};
