import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
  customization?: Record<string, any>;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product, customization?: Record<string, any>) => void;
  removeFromCart: (productId: string, customization?: Record<string, any>) => void;
  updateQuantity: (productId: string, quantity: number, customization?: Record<string, any>) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('spinshop_cart', []);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const addToCart = (product: Product, customization: Record<string, any> = {}) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && 
        JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      return [...prev, { ...product, quantity: 1, customization }];
    });
  };

  const removeFromCart = (productId: string, customization: Record<string, any> = {}) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === productId &&
            JSON.stringify(item.customization) === JSON.stringify(customization))
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, customization: Record<string, any> = {}) => {
    if (quantity === 0) {
      removeFromCart(productId, customization);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId &&
        JSON.stringify(item.customization) === JSON.stringify(customization)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
