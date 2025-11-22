export const formatPrice = (price: number, currency = 'MAD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateDiscount = (price: number, discountPercent: number): number => {
  return price * (1 - discountPercent / 100);
};

export const calculateTotal = (
  items: Array<{ price: number; quantity: number }>, 
  discount = 0, 
  freeShipping = false
) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discount / 100);
  const shipping = freeShipping ? 0 : 50;
  const total = subtotal - discountAmount + shipping;
  
  return {
    subtotal,
    discountAmount,
    shipping,
    total,
  };
};
